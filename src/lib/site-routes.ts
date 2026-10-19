/** Keep full-screen lessons, the admin app and LaunchBox's own publication in their own layouts. */
export function isEditorialRoute(pathname: string): boolean {
  return !(
    /^\/admin(?:\/|-|$)/.test(pathname) ||
    /^\/(?:emails|create)(?:\/|$)/.test(pathname) ||
    /^\/launchbox-weekly(?:\/|$)/.test(pathname) ||
    /^\/resources\/classes(?:\/|$)/.test(pathname) ||
    pathname === '/free-class/1'
  );
}
