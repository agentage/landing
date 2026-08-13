'use client';
import { useEffect } from 'react';
import { installErrorReporter } from '@agentage/observability/browser';
import { ERROR_REPORT_URL } from '../lib/site';

// Endpoint is build-baked like the waitlist POST - runtime-env.sh rewrites the sentinel host.
export function ErrorReporter() {
  useEffect(
    () => installErrorReporter({ endpoint: ERROR_REPORT_URL, service: 'agentage-landing' }),
    []
  );
  return null;
}
