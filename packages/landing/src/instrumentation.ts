// Next runs this once per server process, before any request. Inert unless
// OTEL_EXPORTER_OTLP_ENDPOINT + OTEL_SERVICE_NAME are set (deploy-substituted).
export { register } from '@agentage/observability/next';
