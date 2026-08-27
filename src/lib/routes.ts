/**
 * Routes that actually resolve right now. Every nav/footer link is driven
 * off this set instead of being deleted, so pages coming online in later
 * plans just need their path added here to reappear in navigation.
 */
export const LIVE_ROUTES = new Set<string>(["/"]);

export function isLive(href: string): boolean {
  return LIVE_ROUTES.has(href);
}
