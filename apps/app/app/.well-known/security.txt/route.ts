const SECURITY_TEXT = `Contact: mailto:hello@swiss-trails.com
Preferred-Languages: en, de
Canonical: https://app.swiss-trails.com/.well-known/security.txt
Policy: https://swiss-trails.com/privacy
Expires: 2027-08-10T00:00:00.000Z
`;

export function GET() {
  return new Response(SECURITY_TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
