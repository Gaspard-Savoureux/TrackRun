/* eslint-disable no-unused-vars */
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
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
function isValidNom(nom: string): boolean {
  return nom.length <= 256;
}

function isValidVille(ville: string): boolean {
  return ville.length <= 100;
}

function isValidTypeActivite(typeActivite: string): boolean {
  return typeActivite === 'Running' || typeActivite === 'Biking' || typeActivite === 'Walking' || typeActivite === null;
}

function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return date !== null && dateRegex.test(date);
}

function isValidDuree(duree: string): boolean {
  const dureeRegex = /^\d{1,2}:\d{2}$/;
  return duree !== null && dureeRegex.test(duree);
}

function isValidDistance(distance: string): boolean {
  const distanceNumber = parseFloat(distance || '');
  return !isNaN(distanceNumber) && distanceNumber >= 0;
}

function isValidComment(comment: string): boolean {
  return comment.length <= 1000;
}

function convertDureeToSecondes(duree: string): number {
  const [hours, minutes] = duree.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

/*async function extractFormData(request: Request) {
  const data = await request.formData();
  const activiteData = [
    data.get('nom')!,
    data.get('ville')!,
    data.get('typeActivite')!,
    data.get('date')!,
    data.get('duree')!,
    data.get('distance')!,
    data.get('comment')!,
  ];
  return activiteData;
}*/

//formulaire manuelle
export const actions: object = {
  ajouterActivite: async ({ fetch, request }: RequestEvent) => {
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

    console.log(name);
    console.log(city);
    console.log(type);
    console.log(date);
    console.log(duree);
    console.log(distance);
    console.log(comment);
    console.log(segments);

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

    const res = await fetch(`${API_URL}/activity/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city , type, date, durationTotal, distanceTotal, comment, segments }),
    });

    console.log(res);

    if (res.status === 400 || res.status === 401) {

      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
      });
    }


    if (res.ok) {
      // Si la requête est réussie, redirigez l'utilisateur vers une autre page (par exemple, la page d'accueil)
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
