/* eslint-disable no-unused-vars */
import type { RequestEvent } from '../$types';
import { redirect, fail } from '@sveltejs/kit';

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

interface Activite {
    nom: string;
    ville: string;
    typeActivite: 'Course' | 'Vélo';
    date: string;
    duree: string;
    distance: string;
    comment: string;
}

const activites: Activite[] = [];

export const actions: object = {
  ajouterActivite: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const activiteData = extractActiviteData(formData);

    if (!activiteData) {
      return fail(400, {
        success: false,
        message: getErrorMessage(ErrorCode.Missing, 'nom'), // Utilisation de la fonction getErrorMessage pour obtenir le message d'erreur approprié
      });
    }

    activites.push(activiteData);

    redirect(302, '/activite');
  },
};

function areRequiredFieldsPresent(nom: string | null, ville: string | null, typeActivite: 'Course' | 'Vélo' | null, date: string | null, duree: string | null, distance: string | null, comment: string | null): boolean {
  return !!(nom && ville && typeActivite && date && duree && distance && comment);
}

function validateField(field): boolean {
  if (!field.validator(field.value)) {
    fail(400, {
      success: false,
      message: getErrorMessage(field.errorCode, field.fieldName),
    });
    return false;
  }
  return true;
}


function extractActiviteData(formData: FormData): Activite | null {
  const nom = formData.get('nom') as string ?? '';
  const ville = formData.get('ville') as string ?? '';
  const typeActivite = formData.get('typeActivite') as 'Course' | 'Vélo' | null;
  const date = formData.get('date') as string ?? '';
  const duree = formData.get('duree') as string ?? '';
  const distance = formData.get('distance') as string ?? '';
  const comment = formData.get('comment') as string ?? '';

  if (!areRequiredFieldsPresent(nom, ville, typeActivite, date, duree, distance, comment)) {
    return null;
  }

  const fieldsToValidate = [
    { value: nom, validator: isValidNom, errorCode: ErrorCode.InvalidNom, fieldName: 'nom' },
    { value: ville, validator: isValidVille, errorCode: ErrorCode.InvalidVille, fieldName: 'ville' },
    { value: typeActivite, validator: isValidTypeActivite, errorCode: ErrorCode.InvalidTypeActivite, fieldName: 'typeActivite' },
    { value: date, validator: isValidDate, errorCode: ErrorCode.InvalidDate, fieldName: 'date' },
    { value: duree, validator: isValidDuree, errorCode: ErrorCode.InvalidDuree, fieldName: 'duree' },
    { value: distance, validator: isValidDistance, errorCode: ErrorCode.InvalidDistance, fieldName: 'distance' },
    { value: comment, validator: isValidComment, errorCode: ErrorCode.InvalidComment, fieldName: 'comment' },
  ];

  for (const field of fieldsToValidate) {
    if (!validateField(field)) {
      return null;
    }
  }

  return { nom, ville, typeActivite: typeActivite!, date, duree, distance, comment };
}

function isValidNom(nom: string | null): boolean {
  return typeof nom === 'string' && nom.length <= 256;
}

function isValidVille(ville: string | null): boolean {
  return typeof ville === 'string' && ville.length <= 100;
}

function isValidTypeActivite(typeActivite: 'Course' | 'Vélo' | null): boolean {
  return typeActivite === 'Course' || typeActivite === 'Vélo';
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
