'use client';
import { ErrorReporter as KitErrorReporter } from '@agentage/observability/react';
import { ERROR_REPORT_URL } from '../lib/site';

// Endpoint is build-baked like the waitlist POST - runtime-env.sh rewrites the sentinel host.
export function ErrorReporter() {
  return <KitErrorReporter endpoint={ERROR_REPORT_URL} service="agentage-landing" />;
}
