#!/bin/sh
# Build once, run anywhere (landing + dashboard runtime images).
#
# Next.js inlines NEXT_PUBLIC_* into the client bundle and prerendered HTML at
# `next build`, which used to force a separate image per environment. Instead
# the build bakes SENTINELS and this entrypoint rewrites them from runtime env
# before boot, so one image (one digest) serves every environment:
#   site-fqdn.sentinel.invalid  <- SITE_FQDN   (lowercase, hostname-shaped:
#                                  URL parsing + links() lowercase hostnames,
#                                  so an UPPER_CASE token would not survive)
#   __GA_MEASUREMENT_ID__       <- GA_MEASUREMENT_ID (empty = analytics off)
#
# Idempotent: a fresh container substitutes once (~1s); nothing matches after.
# Scope is packages/ - inlined values only land in .next output + app bundles,
# never in node_modules.
set -eu

fqdn=$(printf '%s' "${SITE_FQDN:-dev.agentage.io}" | sed 's|^https\{0,1\}://||; s|/*$||' | tr 'A-Z' 'a-z')
ga="${GA_MEASUREMENT_ID:-}"

grep -rl 'site-fqdn\.sentinel\.invalid' /app/packages 2>/dev/null | while read -r f; do
  sed -i "s|site-fqdn\.sentinel\.invalid|$fqdn|g" "$f"
done
grep -rl '__GA_MEASUREMENT_ID__' /app/packages 2>/dev/null | while read -r f; do
  sed -i "s|__GA_MEASUREMENT_ID__|$ga|g" "$f"
done

echo "runtime-env: SITE_FQDN=$fqdn GA_MEASUREMENT_ID=$([ -n "$ga" ] && echo set || echo unset)"
exec "$@"
