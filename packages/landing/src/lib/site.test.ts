import { describe, expect, it } from 'vitest';
import { errorReportEndpoint } from './site';

describe('errorReportEndpoint', () => {
  it('appends the collector path to the API base', () => {
    expect(errorReportEndpoint('https://api.agentage.io/api')).toBe(
      'https://api.agentage.io/api/errors/report'
    );
  });

  it('does not double the slash when the base has a trailing one', () => {
    expect(errorReportEndpoint('https://api.agentage.io/api//')).toBe(
      'https://api.agentage.io/api/errors/report'
    );
  });

  it('keeps a sentinel host intact so the entrypoint can substitute it', () => {
    expect(errorReportEndpoint('https://api.site-fqdn.sentinel.invalid/api')).toContain(
      'site-fqdn.sentinel.invalid'
    );
  });
});
