# Landing site image - build once, run anywhere. NEXT_PUBLIC_* are baked as
# sentinels and docker/runtime-env.sh substitutes SITE_FQDN / GA_MEASUREMENT_ID
# at container start, so one digest serves every environment.
FROM node:26-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Dependencies (whole workspace, from the lockfile).
FROM base AS deps
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/landing/package*.json ./packages/landing/
RUN npm ci && npm cache clean --force

# Build shared -> landing (@agentage/design-system comes from npm, already in
# node_modules). Sentinels, not real values: static metadata + the client bundle
# bake these; the entrypoint substitutes at start.
FROM base AS build
ENV NEXT_PUBLIC_SITE_FQDN=site-fqdn.sentinel.invalid
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=__GA_MEASUREMENT_ID__
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY packages/shared/ ./packages/shared/
COPY packages/landing/ ./packages/landing/
RUN npm run build -w @agentage/shared \
  && npm run build -w @agentage/landing

# Runtime: Next.js standalone server.
FROM node:26-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat wget
COPY --from=build --chown=node:node /app/packages/landing/.next/standalone ./
COPY --from=build --chown=node:node /app/packages/landing/.next/static ./packages/landing/.next/static
COPY --from=build --chown=node:node /app/packages/landing/public ./packages/landing/public
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
# Build provenance, baked late so a changing SHA only busts this layer.
ARG COMMIT_SHA=""
ARG BUILD_TIME=""
ENV COMMIT_SHA=$COMMIT_SHA
ENV BUILD_TIME=$BUILD_TIME
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1
COPY --chmod=755 docker/runtime-env.sh /runtime-env.sh
USER node
ENTRYPOINT ["/runtime-env.sh"]
CMD ["node", "packages/landing/server.js"]
