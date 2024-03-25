import { describe, it, afterAll } from 'vitest';
import { getErrorMessage } from '../routes/activity/+page.server';
import {ErrorCode} from '$lib/errorCode';

let validTests: number = 0;
const invalidTests: string[] = [];

describe('Test #1 : Msg Error Manuel and Gpx', () => {

  it('Msg Error champ vide', () => {
    const variable = 'vide';
    const message = getErrorMessage(ErrorCode.Missing, variable);
    if (message === 'Veuillez entrer le champ "' + variable + '" de l\'activité.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ vide');
    }
  });

  it('Msg Error champ Name', () => {
    const variable = 'Name';
    const message = getErrorMessage(ErrorCode.InvalidNom, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être une chaîne de caractères d\'une longueur maximale de 256 caractères.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Name');
    }
  });

  it('Msg Error champ City', () => {
    const variable = 'City';
    const message = getErrorMessage(ErrorCode.InvalidVille, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être une chaîne de caractères d\'une longueur maximale de 100 caractères.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ City');
    }
  });

  it('Msg Error champ Type activity', () => {
    const variable = 'Type activity';
    const message = getErrorMessage(ErrorCode.InvalidTypeActivite, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être soit "Course" ou "Vélo".') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Type activity');
    }
  });

  it('Msg Error champ Date', () => {
    const variable = 'Date';
    const message = getErrorMessage(ErrorCode.InvalidDate, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être une date valide au format AAAA-MM-JJ.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Date');
    }
  });

  it('Msg Error champ Durée', () => {
    const variable = 'Durée';
    const message = getErrorMessage(ErrorCode.InvalidDuree, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être au format HH:MM, où HH représente les heures et MM les minutes.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Durée');
    }
  });

  it('Msg Error champ Distance', () => {
    const variable = 'Distance';
    const message = getErrorMessage(ErrorCode.InvalidDistance, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être un nombre positif.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Distance');
    }
  });

  it('Msg Error champ Comment', () => {
    const variable = 'Comment';
    const message = getErrorMessage(ErrorCode.InvalidComment, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être une chaîne de caractères d\'une longueur maximale de 1000 caractères.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ Comment');
    }
  });

  it('Msg Error champ FileGPX', () => {
    const variable = 'FileGPX';
    const message = getErrorMessage(ErrorCode.InvalidGPX, variable);
    if (message === 'Le champ "' + variable + '" de l\'activité doit être au format GPX.') {
      validTests++;
    } else {
      invalidTests.push('Fail Msg Error champ FileGPX');
    }
  });
});

/* eslint-disable no-console */
afterAll(() => {
  console.log(`Nombre de tests valides passés: ${validTests}`);
  if (invalidTests.length > 0) {
    console.log('Tests invalides avec leurs messages d\'erreur :');
    invalidTests.forEach((test) => console.log(test));
  } else {
    console.log('Aucun test invalide.');
  }
});
/* eslint-enable no-console */
