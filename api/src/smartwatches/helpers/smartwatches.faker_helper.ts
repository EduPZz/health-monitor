import { faker } from '@faker-js/faker';

export function generateFakeSmartwatchData() {
  return {
    bloodGlucose: faker.number.int({
      min: 70,
      max: 140,
    }),
    heartbeat: faker.number.int({
      min: 60,
      max: 100,
    }),
    systolic: faker.number.int({
      min: 90,
      max: 140,
    }),
    diastolic: faker.number.int({
      min: 60,
      max: 90,
    }),
  };
}
