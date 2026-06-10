/**
 * ENS subgraph queries (owned names, subnames, recent registrations).
 * Every function fails SOFT (null/[]), and callers must render gracefully —
 * the hosted endpoint is deprecated and may eventually disappear. An override
 * URL (decentralized-network gateway with key) can be set via env.
 */

const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_ENS_SUBGRAPH_URL ||
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

async function query<T>(q: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: q, variables }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.errors) return null;
    return json.data as T;
  } catch {
    return null;
  }
}

export type OwnedName = {
  name: string;
  expiry: number | null;
  wrapped: boolean;
};

/** Names where `address` is registrant, manager, or wrapped owner. */
export async function fetchOwnedNames(address: string): Promise<OwnedName[] | null> {
  const addr = address.toLowerCase();
  type D = { name: string | null; expiryDate: string | null; wrappedDomain: { name: string } | null };
  const data = await query<{
    asRegistrant: D[];
    asOwner: D[];
    asWrapped: D[];
  }>(
    `query owned($addr: String!) {
      asRegistrant: domains(first: 500, where: { registrant: $addr }) {
        name expiryDate wrappedDomain { name }
      }
      asOwner: domains(first: 500, where: { owner: $addr }) {
        name expiryDate wrappedDomain { name }
      }
      asWrapped: domains(first: 500, where: { wrappedOwner: $addr }) {
        name expiryDate wrappedDomain { name }
      }
    }`,
    { addr },
  );
  if (!data) return null;

  const seen = new Map<string, OwnedName>();
  for (const d of [...data.asRegistrant, ...data.asOwner, ...data.asWrapped]) {
    if (!d.name || d.name.includes("[")) continue; // skip unindexable labels
    seen.set(d.name, {
      name: d.name,
      expiry: d.expiryDate ? Number(d.expiryDate) : null,
      wrapped: Boolean(d.wrappedDomain),
    });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export type RecentRegistration = { name: string; registeredAt: number };

export async function fetchRecentRegistrations(limit = 24): Promise<RecentRegistration[] | null> {
  const data = await query<{
    registrations: { registrationDate: string; domain: { name: string | null } }[];
  }>(
    `query recent($limit: Int!) {
      registrations(first: $limit, orderBy: registrationDate, orderDirection: desc) {
        registrationDate
        domain { name }
      }
    }`,
    { limit },
  );
  if (!data) return null;
  return data.registrations
    .filter((r) => r.domain.name && !r.domain.name.includes("["))
    .map((r) => ({ name: r.domain.name as string, registeredAt: Number(r.registrationDate) }));
}

/** Count of registrations since `sinceUnix` (capped at 1000 by pagination). */
export async function fetchRegistrationsSince(sinceUnix: number): Promise<number | null> {
  const data = await query<{ registrations: { id: string }[] }>(
    `query since($since: Int!) {
      registrations(first: 1000, where: { registrationDate_gt: $since }) { id }
    }`,
    { since: sinceUnix },
  );
  if (!data) return null;
  return data.registrations.length;
}

export type Subname = { name: string; owner: string };

export async function fetchSubnames(parent: string, parentNode: string): Promise<Subname[] | null> {
  // Domain.parent is the namehash id of the parent node.
  const data = await query<{
    domains: { name: string | null; owner: { id: string } }[];
  }>(
    `query subs($parent: String!) {
      domains(first: 200, where: { parent: $parent }) {
        name
        owner { id }
      }
    }`,
    { parent: parentNode.toLowerCase() },
  );
  if (!data) return null;
  return data.domains
    .filter((d) => d.name && !d.name.includes("["))
    .map((d) => ({ name: d.name as string, owner: d.owner.id }));
}
