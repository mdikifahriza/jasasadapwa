import { sanityClient } from "./sanityClient";

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: any;
  tags?: string[];
}): Promise<T> {
  return sanityClient.fetch(query, params, {
    next: { tags },
  });
}
