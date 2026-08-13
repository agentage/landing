import { createLogger } from '@agentage/observability';

// Server-side JSON logger; the estate log agent tails container stdout.
export const log = createLogger({ service: 'agentage-landing' });
