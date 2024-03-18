import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token');
  const basicAuth = event.cookies.get('basicAuth');

  const unguardedRoutes = ['/login', '/register', '/admin'];
  
  if (!token && !unguardedRoutes.find((route) => event.url.pathname.startsWith(route))) {
    redirect(302, `/login?next=${encodeURIComponent(event.url.pathname + event.url.search)}`);
  }

  event.locals.token = token;
  event.locals.basicAuth = basicAuth;

  const response = await resolve(event);
  return response;
};
