// MCP Registry HTTP domain verification: serves MCP_REGISTRY_AUTH (`v=MCPv1; k=ed25519; p=<pubkey>`) to claim the io.agentage namespace; 404 until set. Reached via the next.config rewrite (leading-dot app segments are unreliable across Next).
export const dynamic = 'force-dynamic';

export function GET(): Response {
  const proof = process.env.MCP_REGISTRY_AUTH?.trim();
  if (!proof) {
    return new Response('Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new Response(`${proof}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
