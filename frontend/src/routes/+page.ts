// import type { PageLoad } from './$types';
// import {API_URL} from '../constants';
//
// export const load: PageLoad = async ({ data, fetch }) => {
//   let backendData;
//   try {
//     const response = await fetch(API_URL);
//     backendData = await response.text();
//   } catch (error: unknown) {
//     backendData = `Make sure your backend is running! Request failed with error: ${error}`;
//   }
//
//   return {
//     backendData,
//     message: data.message,
//   };
// };
