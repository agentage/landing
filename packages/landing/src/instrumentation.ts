import { onRequestError as kitOnRequestError } from '@agentage/observability/next';
import { log } from './lib/logger';

// Next runs this once per server process, before any request. Inert unless
// OTEL_EXPORTER_OTLP_ENDPOINT + OTEL_SERVICE_NAME are set (deploy-substituted).
export { register } from '@agentage/observability/next';

// Server render / route errors, emitted as the estate ErrorEvent shape.
export const onRequestError = kitOnRequestError(log);
