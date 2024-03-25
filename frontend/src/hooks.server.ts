import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token');
  const basicAuth = event.cookies.get('basicAuth');

  const unguardedRoutes = ['/login', '/register', '/admin'];

  if (!token && !unguardedRoutes.find((route) => event.url.pathname.startsWith(route))) {
    const inSession = event.cookies.get('in_sess');
    const message = inSession ? 'Your session has expired.' : 'You need to login to view this content.';
    redirect(302, `/login?next=${encodeURIComponent(event.url.pathname + event.url.search)}&message=${encodeURIComponent(message)}`);
  }

  event.locals.token = token;
  event.locals.basicAuth = basicAuth;

  const response = await resolve(event);
  return response;
};

export const handleFetch: HandleFetch = async ({ event, fetch, request }) => {
  if (request.url.startsWith('http://tse.info.uqam.ca/api')) {
    const requestCookies = event.request.headers.get('cookie');
    
    if (requestCookies) {
      request.headers.set('cookie', requestCookies);
    }

    request = new Request(
      request.url.replace('http://tse.info.uqam.ca/api', 'http://backend:5001'),
      request,
    );
  }

  return fetch(request);
};
