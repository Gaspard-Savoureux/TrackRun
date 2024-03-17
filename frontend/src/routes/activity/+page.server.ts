/* eslint-disable no-unused-vars */
import {error, fail, redirect} from '@sveltejs/kit';
import type {PageServerLoad, RequestEvent} from '../$types';
import { API_URL } from '../../constants';

// Enumération des codes d'erreur
enum ErrorCode {
    Missing,
    InvalidNom,
    InvalidVille,
    InvalidTypeActivite,
    InvalidDate,
    InvalidDuree,
    InvalidDistance,
    InvalidComment
}

// Fonction pour récupérer les messages d'erreur en fonction du code d'erreur
/**
 * Returns the error message based on the error code and variable name.
 *
 * @param {ErrorCode} errorCode - The error code representing the type of error.
 * @param {string} variable - The name of the variable associated with the error.
 * @returns {string} - The error message.
 */
function getErrorMessage(errorCode: ErrorCode, variable: string): string {
  switch (errorCode) {
  case ErrorCode.Missing:
    return `Veuillez entrer le champ "${variable}" de l'activité.`;
  case ErrorCode.InvalidNom:
    return `Le champ "${variable}" de l'activité doit être une chaîne de caractères d'une longueur maximale de 256 caractères.`;
  case ErrorCode.InvalidVille:
    return `Le champ "${variable}" de l'activité doit être une chaîne de caractères d'une longueur maximale de 100 caractères.`;
  case ErrorCode.InvalidTypeActivite:
    return `Le champ "${variable}" de l'activité doit être soit "Course" ou "Vélo".`;
  case ErrorCode.InvalidDate:
    return `Le champ "${variable}" de l'activité doit être une date valide au format JJ-MM-AAAA.`;
  case ErrorCode.InvalidDuree:
    return `Le champ "${variable}" de l'activité doit être au format HH:MM, où HH représente les heures et MM les minutes.`;
  case ErrorCode.InvalidDistance:
    return `Le champ "${variable}" de l'activité doit être un nombre positif.`;
  case ErrorCode.InvalidComment:
    return `Le champ "${variable}" de l'activité doit être une chaîne de caractères d'une longueur maximale de 1000 caractères.`;
  default:
    return 'Une erreur inconnue s\'est produite.';
  }
}

//liste des validation
/**
 * Checks if the given nom (string) is valid.
 *
 * @param {string} nom - The nom to be validated.
 * @return {boolean} - Returns true if the nom is valid, otherwise false.
 */
function isValidNom(nom: string): boolean {
  return nom.length <= 256;
}

/**
 * Checks if the given string is a valid ville.
 *
 * @param {string} ville - The string to be checked.
 * @return {boolean} - Returns true if the string is a valid ville, otherwise false.
 */
function isValidVille(ville: string): boolean {
  return ville.length <= 100;
}

/**
 * Checks if the given type of activity is valid.
 *
 * @param {string} typeActivite - The type of activity to be checked.
 * @return {boolean} - Returns true if the type of activity is valid, false otherwise.
 */
function isValidTypeActivite(typeActivite: string): boolean {
  return typeActivite === 'Running' || typeActivite === 'Biking' || typeActivite === 'Walking' || typeActivite === null;
}

/**
 * Checks if a given date is in a valid format.
 *
 * @param {string} date - The date to be checked in the format 'YYYY-MM-DD'.
 * @return {boolean} Returns true if the date is in a valid format, otherwise false.
 */
function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return date !== null && dateRegex.test(date);
}

/**
 * Checks whether the given duration string is a valid format (hh:mm).
 *
 * @param {string} duree - The duration string to be validated.
 * @return {boolean} - Returns true if the duration string is valid, otherwise false.
 */
function isValidDuree(duree: string): boolean {
  const dureeRegex = /^\d{1,2}:\d{2}$/;
  return duree !== null && dureeRegex.test(duree);
}

/**
 * Checks if the given distance is a valid number greater than or equal to 0.
 *
 * @param {string} distance - The distance to be validated.
 * @return {boolean} - Returns true if the distance is valid, otherwise false.
 */
function isValidDistance(distance: string): boolean {
  const distanceNumber = parseFloat(distance || '');
  return !isNaN(distanceNumber) && distanceNumber >= 0;
}

/**
 * Check whether a comment is valid.
 *
 * @param {string} comment - The comment to be checked.
 * @return {boolean} - True if the comment is valid, false otherwise.
 */
function isValidComment(comment: string): boolean {
  return comment.length <= 1000;
}

/**
 * Converts given duration string to seconds.
 *
 * @param {string} duree - The duration string in the format 'hh:mm'.
 * @return {number} - The duration in seconds.
 */
function convertDureeToSecondes(duree: string): number {
  const [hours, minutes] = duree.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

//formulaire manuelle
/**
 * Adds an activity to the system.
 *
 * @param {Object} RequestEvent - The request event object.
 * @returns {Object} - The response object.
 */
export const actions: object = {
  /**
   * Add activity to the system.
   * @param {Object} requestEvent - The request event object containing the cookies, fetch, and request properties.
   * @returns {Object} - The response object containing the status code and body.
   */
  ajouterActiviteManuel: async ({ cookies, fetch, request }: RequestEvent) => {
    //const activiteData = await extractFormData(request);
    const data = await request.formData();
    const name = data.get('nom');
    const city = data.get('ville');
    const type = data.get('typeActivite');
    const date = data.get('date');
    const duree = data.get('duree');
    const distance = data.get('distance');
    const comment = data.get('comment');
    const segments = '{}';

    // Validation des champs
    if (!isValidNom(<string>name)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidNom, 'Nom'),
      });
    }
    if (!isValidVille(<string>city)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidVille, 'ville'),
      });
    }
    if (!isValidTypeActivite(<string>type)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidTypeActivite, 'Type d\'activité'),
      });
    }
    if (!isValidDate(<string>date)) {
      redirect(302, '/');
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDate, 'Date'),
      });
    }
    if (!isValidDuree(<string>duree)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDuree, 'Durée'),
      });
    }
    if (!isValidDistance(<string>distance)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDistance, 'Distance'),
      });
    }
    if (!isValidComment(<string>comment)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidComment, 'Commentaires'),
      });
    }
    const durationTotal = convertDureeToSecondes(<string>duree);
    const distanceTotal = Number(distance);

    const token = cookies.get('token');

    const res = await fetch(`${API_URL}/activity/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, city , type, date, durationTotal, distanceTotal, comment, segments }),
    });

    if (res.status === 400 || res.status === 401) {

      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
      });
    }

    if (res.ok) {
      redirect(302, '/');
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Activité ajoutée avec succès!',
      },
    };
  },
  ajouterActiviteGPX: async ({ cookies, fetch, request }: RequestEvent) => {
    //const activiteData = await extractFormData(request);
    const data = await request.formData();
    const name = data.get('nom');
    const type = data.get('typeActivite');
    const comment = data.get('comment');
    const segments = data.get('fichierGPX');

    // Validation des champs TODO

    const token = cookies.get('token');

    const res = await fetch(`${API_URL}/activity/gpxForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type, comment, segments }),
    });

    if (res.status === 400 || res.status === 401) {

      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
      });
    }

    if (res.ok) {
      redirect(302, '/');
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Activité ajoutée avec succès!',
      },
    };

  },
};


/**
 * Loads activities from the server.
 *
 * @param {Object} options - The options for making the API request.
 * @param {Function} options.fetch - The fetch function for making network requests.
 * @param {Object} options.cookies - The cookies object for accessing cookies.
 * @returns {Promise<Object>} - The promise that resolves to the activities object from the server.
 * @throws {Error} - Returns an error if the API request fails.
 */
export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const token = cookies.get('token');
  const res = await fetch(`${API_URL}/activity/getActivity`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return error(404, { message: 'Could not get activities'});
  }
  const activities = await res.json();

  return { activities };
};
