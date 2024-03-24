import { describe, it, afterAll } from 'vitest';
import { isValidNom, isValidVille, isValidTypeActivite, obtenirDateDemain, obtenirPastDate, isValidDate, isValidDuree, isValidDistance, isValidComment } from '../routes/activity/+page.server'; 

let validTests: number = 0;
const invalidTests: string[] = [];

describe('Test #1 : Champs Name', () => {
  it('Limite Minimum', () => {
    const longName = 'a'.repeat(2);
    const result = isValidNom(longName);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Name minimum echec');
    }
  });

  it('Limite Maximum', () => {
    const longName = 'a'.repeat(257);
    const result = isValidNom(longName);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Name maximum echec');
    }
  });

  it('Name valide', () => {
    const validName = 'John Doe';
    const result = isValidNom(validName);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Name valide echec');
    }
  });
});

describe('Test #2 : Champs City', () => {
  it('Limite Minimum', () => {
    const longCity = '';
    const result = isValidVille(longCity);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation City minimum echec');
    }
  });

  it('Limite Maximum', () => {
    const longCity = 'a'.repeat(101);
    const result = isValidVille(longCity);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation City maximum echec');
    }
  });

  it('City valide', () => {
    const validCity = 'New York';
    const result = isValidVille(validCity);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation City valide echec');
    }
  });
});

describe('Test #3 : Champs type d\'activité', () => {

  it('Type invalide', () => {
    const invalidType = 'Dance';
    const result = isValidTypeActivite(invalidType);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Type invalide echec');
    }
  });

  it('Type valide', () => {
    const validType = 'Walking';
    const result = isValidTypeActivite(validType);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Type valide(Walking) echec');
    }
  });

  it('Type valide', () => {
    const validType = 'Biking';
    const result = isValidTypeActivite(validType);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Type valide(Biking) echec');
    }
  });

  it('Type valide', () => {
    const validType = 'Running';
    const result = isValidTypeActivite(validType);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Type valide(Running) echec');
    }
  });
});

describe('Test #4 : Champs Date', () => {

  it('Date vide', () => {
    const InvalidDate = '';
    const result = isValidDate(InvalidDate);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Date null echec');
    }
  });

  it('Date invalide Maximum', () => {
    const InvalidDate = obtenirDateDemain();
    const result = isValidDate(InvalidDate);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Date futur echec');
    }
  });

  it('Date Minimum', () => {
    const limitValidPastDate = obtenirPastDate();
    const invalidDateObj = new Date(limitValidPastDate);
    invalidDateObj.setDate(invalidDateObj.getDate() - 1);
    // Reformater la date en chaîne YYYY-MM-DD
    const invalidDate = invalidDateObj.getFullYear() + '-' +
                      ('0' + (invalidDateObj.getMonth() + 1)).slice(-2) + '-' +
                      ('0' + invalidDateObj.getDate()).slice(-2);
    const result = isValidDate(invalidDate);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Date Minimum echec');
    }
  });

  it('Date valide', () => {
    const validDate = '2024-03-16';
    const result = isValidDate(validDate);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Date valide echec');
    }
  });
});

describe('Test #5 : Champs Duree', () => {

  it('Duree vide', () => {
    const validDuree = '';
    const result = isValidDuree(validDuree);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Duree null echec');
    }
  });

  it('Duree Minimum', () => {
    const InvalidDuree = '-000:00:01';
    const result = isValidDuree(InvalidDuree);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Duree Minimum echec');
    }
  });

  it('Duree valide', () => {
    const validDuree = '000:00:00';
    const result = isValidDuree(validDuree);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Duree valide echec');
    }
  });

  it('Duree Maximum', () => {
    const invalidDuree = '100:00:01';
    const result = isValidDuree(invalidDuree);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Duree Maximum echec');
    }
  });
});

describe('Test #6 : Champs Distance', () => {

  it('Distance vide', () => {
    const validDistance = '';
    const result = isValidDistance(validDistance);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Distance vide echec');
    }
  });

  it('Distance Minimum', () => {
    const InvalidDistance = '-00.01';
    const result = isValidDistance(InvalidDistance);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Distance Minimum echec');
    }
  });

  it('Distance caractere', () => {
    const InvalidDistance = '00d.01a';
    const result = isValidDistance(InvalidDistance);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Distance caractere echec');
    }
  });

  it('Distance valide point', () => {
    const validDistance = '123.456';
    const result = isValidDistance(validDistance);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Distance valide point echec');
    }
  });

  it('Distance valide virgule', () => {
    const validDistance = '123,456';
    const result = isValidDistance(validDistance);
    if (!result) {
      validTests++;
    } else {
      invalidTests.push('Validation Distance valide virgule echec');
    }
  });
});

describe('Test #7 : Champs Comment', () => {

  it('Comment vide', () => {
    const validComment = '';
    const result = isValidComment(validComment);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Comment null echec');
    }
  });

  it('Comment valide', () => {
    const validComment = 'blabla';
    const result = isValidComment(validComment);
    if (result) {
      validTests++;
    } else {
      invalidTests.push('Validation Comment valide echec');
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
