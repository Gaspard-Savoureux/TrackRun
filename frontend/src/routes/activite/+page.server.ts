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
function isValidNom(nom: string | null): boolean {
  return typeof nom === 'string' && nom.length <= 256;
}

function isValidVille(ville: string | null): boolean {
  return typeof ville === 'string' && ville.length <= 100;
}

function isValidTypeActivite(typeActivite: string | null): boolean {
  return typeActivite === 'Course' || typeActivite === 'Vélo' || typeActivite === null;
}

function isValidDate(date: string | null): boolean {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  return date !== null && dateRegex.test(date);
}

function isValidDuree(duree: string | null): boolean {
  const dureeRegex = /^\d{1,2}:\d{2}$/;
  return duree !== null && dureeRegex.test(duree);
}

function isValidDistance(distance: string | null): boolean {
  const distanceNumber = parseFloat(distance || '');
  return !isNaN(distanceNumber) && distanceNumber >= 0;
}

function isValidComment(comment: string | null): boolean {
  return typeof comment === 'string' && comment.length <= 1000;
}

async function extractFormData(request: Request): Promise<(string | null)[]> {
  const data = await request.formData();
  const values = [
    data.get('nom')?.toString() ?? null,
    data.get('ville')?.toString() ?? null,
    data.get('typeActivite')?.toString() ?? null,
    data.get('date')?.toString() ?? null,
    data.get('duree')?.toString() ?? null,
    data.get('distance')?.toString() ?? null,
    data.get('comment')?.toString() ?? null,
  ];
  return values;
}

//formulaire manuelle
export const actions: object = {
  ajouterActivite: async ({ request }: RequestEvent) => {
    const [nom, ville, typeActivite, date, duree, distance, comment] = await extractFormData(request);

    // Validation des champs
    if (!isValidNom(nom)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidNom, 'Nom'),
        fields: { nom },
      });
    }
    if (!isValidVille(ville)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidVille, 'Ville'),
        fields: { ville },
      });
    }
    if (!isValidTypeActivite(typeActivite)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidTypeActivite, 'Type d\'activité'),
        fields: { typeActivite },
      });
    }
    if (!isValidDate(date)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDate, 'Date'),
        fields: { date },
      });
    }
    if (!isValidDuree(duree)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDuree, 'Durée'),
        fields: { duree },
      });
    }
    if (!isValidDistance(distance)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidDistance, 'Distance'),
        fields: { distance },
      });
    }
    if (!isValidComment(comment)) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.InvalidComment, 'Commentaires'),
        fields: { comment },
      });
    }

    const activiteData = {
      nom,
      ville,
      typeActivite,
      date,
      duree,
      distance,
      comment,
    };

    const res = await fetch(`${API_URL}/activity/manual`, {
      method: 'POST',
      body: JSON.stringify({ activiteData }),
    });

    if (res.status === 400 || res.status === 401) {
      const errorData = await res.json();
      return fail(res.status, {
        success: false,
        message: errorData.message,
        fields: errorData.fields,
      });
    }

    if (res.ok) {
      // Si la requête est réussie, redirigez l'utilisateur vers une autre page (par exemple, la page d'accueil)
      // eslint-disable-next-line no-console
      console.log('succes!');
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
