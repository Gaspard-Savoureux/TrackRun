import type { RequestEvent } from '../$types';
import { redirect, fail } from '@sveltejs/kit';

enum ErrorCode {
  MissingNom,
  MissingVille,
  MissingTypeActivite,
  MissingDate,
  MissingDuree,
  MissingDistance,
  MissingComment
}

function getErrorMessage(errorCode: ErrorCode): string {
  switch (errorCode) {
  case ErrorCode.MissingNom:
    return 'Veuillez entrer le nom de l\'activité.';
  case ErrorCode.MissingVille:
    return 'Veuillez entrer la ville.';
  case ErrorCode.MissingTypeActivite:
    return 'Veuillez sélectionner le type d\'activité.';
  case ErrorCode.MissingDate:
    return 'Veuillez entrer la date de l\'activité.';
  case ErrorCode.MissingDuree:
    return 'Veuillez entrer la durée de l\'activité.';
  case ErrorCode.MissingDistance:
    return 'Veuillez entrer la distance parcourue.';
  case ErrorCode.MissingComment:
    return 'Veuillez entrer un commentaire.';
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
        message: 'Veuillez remplir tous les champs du formulaire',
      });
    }

    redirect(302, '/activite');
  },
};

function extractActiviteData(formData: FormData): Activite | null {
  const nom = formData.get('nom') as string;
  const ville = formData.get('ville') as string;
  const typeActivite = formData.get('typeActivite') as 'Course' | 'Vélo';
  const date = formData.get('date') as string;
  const duree = formData.get('duree') as string;
  const distance = formData.get('distance') as string;
  const comment = formData.get('comment') as string;

  if (!nom || !ville || !date || !duree || !distance || !comment) {
    return null;
  }

  return { nom, ville, typeActivite, date, duree, distance, comment };
}
