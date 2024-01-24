import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');
  const data: DogApiResponse = await res.json();

  return {
    imageSrc: data.message,
  };
};
