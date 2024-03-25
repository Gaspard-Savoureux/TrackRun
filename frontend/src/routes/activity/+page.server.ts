/* eslint-disable no-unused-vars */
import {error, fail, redirect} from '@sveltejs/kit';
import type {PageServerLoad, RequestEvent} from '../$types';
import { API_URL } from '../../constants';
import {ErrorCode} from '$lib/errorCode';


// Fonction pour récupérer les messages d'erreur en fonction du code d'erreur
/**
 * Returns the error message based on the error code and variable name.
 *
 * @param {ErrorCode} errorCode - The error code representing the type of error.
 * @param {string} variable - The name of the variable associated with the error.
 * @returns {string} - The error message.
 */
export function _getErrorMessage(errorCode: ErrorCode, variable: string): string {
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
    return `Le champ "${variable}" de l'activité doit être une date valide au format AAAA-MM-JJ.`;
  case ErrorCode.InvalidDuree:
    return `Le champ "${variable}" de l'activité doit être au format HH:MM, où HH représente les heures et MM les minutes.`;
  case ErrorCode.InvalidDistance:
    return `Le champ "${variable}" de l'activité doit être un nombre positif.`;
  case ErrorCode.InvalidComment:
    return `Le champ "${variable}" de l'activité doit être une chaîne de caractères d'une longueur maximale de 1000 caractères.`;
  case ErrorCode.InvalidGPX:
    return `Le champ "${variable}" de l'activité doit être au format GPX.`;
  case ErrorCode.InvalidId:
    return `Le champ "${variable}" de l'activité est manquant ou invalide.`;
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
export function _isValidNom(nom: string): boolean {
  return nom.length >= 3 && nom.length <= 256;
}

/**
 * Checks if the given string is a valid ville.
 *
 * @param {string} ville - The string to be checked.
 * @return {boolean} - Returns true if the string is a valid ville, otherwise false.
 */
export function _isValidVille(ville: string): boolean {
  return ville.length <= 100;
}

/**
 * Checks if the given type of activity is valid.
 *
 * @param {string} typeActivite - The type of activity to be checked.
 * @return {boolean} - Returns true if the type of activity is valid, false otherwise.
 */
export function _isValidTypeActivite(typeActivite: string): boolean {
  return typeActivite === 'Running' || typeActivite === 'Biking' || typeActivite === 'Walking' ;
}

export function _obtenirPastDate(): string {
  const mostOldPersonne = 150 ; 
  const today = new Date();
  today.setFullYear(today.getFullYear() - mostOldPersonne);
  const dateIlYa150Ans = today.getFullYear() + '-' +
                         ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
                         ('0' + today.getDate()).slice(-2);
  return dateIlYa150Ans;
}

export function _obtenirDateDemain(): string {
  const today = new Date();
  const futurDate = new Date(today);
  futurDate.setDate(today.getDate() + 1);
  const futurDateString = futurDate.getFullYear() + '-' +
                           ('0' + (futurDate.getMonth() + 1)).slice(-2) + '-' +
                           ('0' + futurDate.getDate()).slice(-2);
  return futurDateString;
}

/**
 * Checks if a given date is in a valid format.
 *
 * @param {string} date - The date to be checked in the format 'YYYY-MM-DD'.
 * @return {boolean} Returns true if the date is in a valid format, otherwise false.
 */
export function _isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const pastDate = _obtenirPastDate();
  const futurDate = _obtenirDateDemain();
  let isValid = true; // Initialisation de la variable de validation

  if (date === null) {
    isValid = false;
  } else if (!dateRegex.test(date)) {
    isValid = false;
  } else if (new Date(date) >= new Date(futurDate)) {
    isValid = false;
  } else if (new Date(date) < new Date(pastDate)) {
    isValid = false;
  }

  return isValid;
}

/**
 * Checks whether the given duration string is a valid format (hh:mm).
 *
 * @param {string} duree - The duration string to be validated.
 * @return {boolean} - Returns true if the duration string is valid, otherwise false.
 */
export function _isValidDuree(duree: string): boolean {
  const dureeRegex = /^\d{1,2}:\d{2}$/;
  return duree !== null && dureeRegex.test(duree);
}

/**
 * Checks if the given distance is a valid number greater than or equal to 0.
 *
 * @param {string} distance - The distance to be validated.
 * @return {boolean} - Returns true if the distance is valid, otherwise false.
 */
export function isValidDistance(distance: string): boolean {
  let isValid = false;

  if (distance.trim() === '') {
    isValid = true;
  } else {
    const normalizedDistance = distance.replace(',', '.');

    if (/^\d+(\.\d+)?$/.test(normalizedDistance)) {
      const distanceNumber = parseFloat(normalizedDistance);
      isValid = !isNaN(distanceNumber) && distanceNumber >= 0;
    }
  }

  return isValid;
}


/**
 * Check whether a comment is valid.
 *
 * @param {string} comment - The comment to be checked.
 * @return {boolean} - True if the comment is valid, false otherwise.
 */
export function _isValidComment(comment: string): boolean {
  return comment.length >= 0 && comment.length <= 1000;
}

export function _isGPXFile(file: File | null): boolean {
  let isValid = false;
  if (file !== null) {
    isValid = file.name.toLowerCase().endsWith('.gpx');
  }
  return isValid;
}

/**
 * Converts given duration string to seconds.
 *
 * @param {string} duree - The duration string in the format 'hh:mm'.
 * @return {number} - The duration in seconds.
 */
export function _convertDureeToSecondes(duree: string): number {
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
    if (!_isValidNom(<string>name)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidNom, 'Nom'),
      });
    }
    if (!_isValidVille(<string>city)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidVille, 'ville'),
      });
    }
    if (!_isValidTypeActivite(<string>type)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidTypeActivite, 'Type d\'activité'),
      });
    }
    if (!_isValidDate(<string>date)) {
      redirect(302, '/');
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDate, 'Date'),
      });
    }
    if (!_isValidDuree(<string>duree)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDuree, 'Durée'),
      });
    }
    if (!isValidDistance(<string>distance)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDistance, 'Distance'),
      });
    }
    if (!_isValidComment(<string>comment)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidComment, 'Commentaires'),
      });
    }
    const durationTotal = _convertDureeToSecondes(<string>duree);
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
      redirect(302, '?/activity/');
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
    const data = await request.formData();
    const name = data.get('name');
    const type = data.get('typeActivite');
    const comment = data.get('comment');
    const fichierGPX = data.get('fichierGPX') as File;
    
    // Validation des champs
    if (!name || !type || !comment || !fichierGPX) {
      return fail(400, { 
        success: false, 
        message: _getErrorMessage(ErrorCode.Missing, 'vide'),
      });
    }
    if (!_isValidNom(<string>name)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidNom, 'Nom'),
      });
    }
    if (!_isValidTypeActivite(<string>type)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidTypeActivite, 'Type d\'activité'),
      });
    }
    if (!_isValidComment(<string>comment)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidComment, 'comment'),
      });
    }
    if (!_isGPXFile(fichierGPX)) {
      return fail(400, { 
        success: false, 
        message: _getErrorMessage(ErrorCode.InvalidGPX, 'FormatGPX'),
      });
    }

    const token = cookies.get('token');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('comment', comment);
    formData.append('file', fichierGPX);

    const res = await fetch(`${API_URL}/activity/gpxForm`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 400 || res.status === 401) {

      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
      });
    }

    if (res.ok) {
      redirect(302, '?/activity/');
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Activité ajoutée avec succès!',
      },
    };

  },

  modifierActivite: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const activityId = data.get('activityId');
    const name = data.get('name');
    const city = data.get('city');
    const type = data.get('type');
    const date = data.get('date');
    const duree = data.get('durationTotal');
    const distance = data.get('distanceTotal');
    const comment = data.get('comment');
    const segments = '{}';

    // Validation des champs
    if (!activityId || !name || !city || !type || !date || !duree || !distance || !comment) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidId, 'vide'),
      });
    }
    if (!_isValidNom(<string>name)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidNom, 'Nom'),
      });
    }
    if (!_isValidVille(<string>city)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidVille, 'ville'),
      });
    }
    if (!_isValidTypeActivite(<string>type)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidTypeActivite, 'Type d\'activité'),
      });
    }
    if (!_isValidDate(<string>date)) {
      redirect(302, '/');
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDate, 'Date'),
      });
    }
    if (!_isValidDuree(<string>duree)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDuree, 'Durée'),
      });
    }
    if (!isValidDistance(<string>distance)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidDistance, 'Distance'),
      });
    }
    if (!_isValidComment(<string>comment)) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidComment, 'Commentaires'),
      });
    }

    const durationTotal = _convertDureeToSecondes(<string>duree);
    const distanceTotal = Number(distance);

    const token = cookies.get('token');

    const updateRes = await fetch(`${API_URL}/activity/${activityId}`, {//Route a modifier au besoin pour le backend
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, city , type, date, durationTotal, distanceTotal, comment, segments }),
    });

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      return {
        status: updateRes.status,
        body: {
          success: false,
          message: errorData.message || 'Erreur lors de la mise a jour', 
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Activité modifiée avec succès!',
      },
    };
  },

  supprimerActivite: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const activityId = data.get('activityId');
    if (!activityId) {
      return fail(400, {
        success: false,
        message: _getErrorMessage(ErrorCode.InvalidNom, 'id'),
      });
    }

    const token = cookies.get('token');

    const res = await fetch(`${API_URL}/activity/${activityId}`, {//Route a modifier au besoin pour le backend
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 400 || res.status === 401) {
      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
      });
    }

    if (res.ok) {
      return {
        status: 200,
        body: {
          success: true,
          message: 'Activité supprimée avec succès!',
        },
      };
    }

    return fail(500, {
      success: false,
      message: 'Une erreur est survenue lors de la suppression de l\'activité.',
    });
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
