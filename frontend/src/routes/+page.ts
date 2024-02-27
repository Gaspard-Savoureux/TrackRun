import type { PageLoad } from './$types';
import {API_URL} from '../constants';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');
  const data: DogApiResponse = await res.json();

  let backendData;
  try {
    const response = await fetch(API_URL);
    backendData = await response.text();
  } catch (error: unknown) {
    backendData = `Make sure your backend is running! Request failed with error: ${error}`;
  }

  return {
    imageSrc: data.message,
    backendData,
  };
};
