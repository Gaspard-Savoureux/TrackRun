import type { LayoutServerLoad } from './$types';
import type { Theme } from '$lib/types/theme';
import { theme } from '$lib/stores/theme';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const themeCookie: string | undefined = cookies.get('theme');

  if (themeCookie != undefined) {
    theme.set(themeCookie as Theme);
  }

  return {
    theme: themeCookie,
  };
};
