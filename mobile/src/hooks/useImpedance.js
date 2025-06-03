/**
 * Calcula métricas corporais a partir de peso, impedância, altura, idade e sexo.
 * 
 * @param {Object} params
 * @param {number} params.weight
 * @param {number} params.impedance
 * @param {number} params.height
 * @param {number} params.age
 * @param {"male"|"female"} params.sex
 * @returns {Object}
 */
const checkValueOverflow = (value, minimum, maximum) => {
  if (value < minimum) return minimum;
  if (value > maximum) return maximum;
  return value;
};

export default function useImpedance({
  weight,
  impedance,
  height,
  age,
  sex,
}) {
  if (height > 220) throw new Error("Height is too high (limit: >220cm)");
  if (weight < 10 || weight > 200) throw new Error("Weight is either too low or too high (limits: <10kg and >200kg)");
  if (age > 99) throw new Error("Age is too high (limit >99 years)");
  if (impedance > 3000) throw new Error("Impedance is too high (limit >3000ohm)");

  const getLBMCoefficient = () => {
    let lbm = (height * 9.058 / 100) * (height / 100);
    lbm += weight * 0.32 + 12.226;
    lbm -= impedance * 0.0068;
    lbm -= age * 0.0542;
    return lbm;
  };

  const getBMR = () => {
    let bmr;
    if (sex === "female") {
      bmr = 864.6 + weight * 10.2036;
      bmr -= height * 0.39336;
      bmr -= age * 6.204;
      if (bmr > 2996) bmr = 5000;
    } else {
      bmr = 877.8 + weight * 14.916;
      bmr -= height * 0.726;
      bmr -= age * 8.976;
      if (bmr > 2322) bmr = 5000;
    }
    return checkValueOverflow(bmr, 500, 10000);
  };

  const getFatPercentage = () => {
    const const_ = sex === "female" && age <= 49 ? 9.25 : sex === "female" && age > 49 ? 7.25 : 0.8;
    const LBM = getLBMCoefficient();
    let coefficient = 1.0;
    if (sex === "male" && weight < 61) {
      coefficient = 0.98;
    } else if (sex === "female" && weight > 60) {
      coefficient = 0.96;
      if (height > 160) coefficient *= 1.03;
    } else if (sex === "female" && weight < 50) {
      coefficient = 1.02;
      if (height > 160) coefficient *= 1.03;
    }
    let fatPercentage = (1.0 - (((LBM - const_) * coefficient) / weight)) * 100;
    if (fatPercentage > 63) fatPercentage = 75;
    return checkValueOverflow(fatPercentage, 5, 75);
  };

  const getWaterPercentage = () => {
    let waterPercentage = (100 - getFatPercentage()) * 0.7;
    const coefficient = waterPercentage <= 50 ? 1.02 : 0.98;
    if (waterPercentage * coefficient >= 65) waterPercentage = 75;
    return checkValueOverflow(waterPercentage * coefficient, 35, 75);
  };

  const getBoneMass = () => {
    const base = sex === "female" ? 0.245691014 : 0.18016894;
    let boneMass = (base - (getLBMCoefficient() * 0.05158)) * -1;
    if (boneMass > 2.2) {
      boneMass += 0.1;
    } else {
      boneMass -= 0.1;
    }
    if (sex === "female" && boneMass > 5.1) boneMass = 8;
    else if (sex === "male" && boneMass > 5.2) boneMass = 8;
    return checkValueOverflow(boneMass, 0.5, 8);
  };

  const getMuscleMass = () => {
    let muscleMass = weight - ((getFatPercentage() * 0.01) * weight) - getBoneMass();
    if (sex === "female" && muscleMass >= 84) muscleMass = 120;
    else if (sex === "male" && muscleMass >= 93.5) muscleMass = 120;
    return checkValueOverflow(muscleMass, 10, 120);
  };

  const getVisceralFat = () => {
    let vfal;
    if (sex === "female") {
      if (weight > (13 - (height * 0.5)) * -1) {
        const subsubcalc = ((height * 1.45) + (height * 0.1158) * height) - 120;
        const subcalc = weight * 500 / subsubcalc;
        vfal = (subcalc - 6) + (age * 0.07);
      } else {
        const subcalc = 0.691 + (height * -0.0024) + (height * -0.0024);
        vfal = (((height * 0.027) - (subcalc * weight)) * -1) + (age * 0.07) - age;
      }
    } else {
      if (height < weight * 1.6) {
        const subcalc = ((height * 0.4) - (height * (height * 0.0826))) * -1;
        vfal = ((weight * 305) / (subcalc + 48)) - 2.9 + (age * 0.15);
      } else {
        const subcalc = 0.765 + height * -0.0015;
        vfal = (((height * 0.143) - (weight * subcalc)) * -1) + (age * 0.15) - 5.0;
      }
    }
    return checkValueOverflow(vfal, 1, 50);
  };

  const getBMI = () => {
    return checkValueOverflow(weight / ((height / 100) * (height / 100)), 10, 90);
  };

  const getIdealWeight = () => {
    if (sex === "female") {
      return (height - 70) * 0.6;
    } else {
      return (height - 80) * 0.7;
    }
  };

  const getFatMassToIdeal = () => {
    const mass = (weight * (getFatPercentage() / 100)) - (weight * (25 / 100));
    if (mass < 0) {
      return { type: "to_gain", mass: mass * -1 };
    } else {
      return { type: "to_lose", mass };
    }
  };

  const getProteinPercentage = () => {
    let proteinPercentage = (getMuscleMass() / weight) * 100;
    proteinPercentage -= getWaterPercentage();
    return checkValueOverflow(proteinPercentage, 5, 32); 
  };

  const getBodyType = () => {
    const fatPercentage = getFatPercentage();
    const muscleMass = getMuscleMass();
    let factor = 1;
    if (fatPercentage > 25) factor = 0;
    else if (fatPercentage < 15) factor = 2;
    if (muscleMass > 40) return 2 + (factor * 3);
    else if (muscleMass < 30) return (factor * 3);
    else return 1 + (factor * 3);
  };

  const getMetabolicAge = () => {
    let metabolicAge;
    if (sex === "female") {
      metabolicAge = (height * -1.1165) + (weight * 1.5784) + (age * 0.4615) + (impedance * 0.0415) + 83.2548;
    } else {
      metabolicAge = (height * -0.7471) + (weight * 0.9161) + (age * 0.4184) + (impedance * 0.0517) + 54.2267;
    }
    return checkValueOverflow(metabolicAge, 15, 80);
  };

  return {
    fatPercentage: parseFloat(getFatPercentage().toFixed(1)),
    waterPercentage: parseFloat(getWaterPercentage().toFixed(1)),
    muscleMass: parseFloat(getMuscleMass().toFixed(1)),
    boneMass: parseFloat(getBoneMass().toFixed(1)),
    visceralFat: parseFloat(getVisceralFat().toFixed(1)),
    bmi: parseFloat(getBMI().toFixed(1)),
    bmr: Math.round(getBMR()),
    idealWeight: parseFloat(getIdealWeight().toFixed(1)),
    proteinPercentage: parseFloat(getProteinPercentage().toFixed(1)),
    metabolicAge: Math.round(getMetabolicAge()),
    bodyType: getBodyType(),
    fatMassToIdeal: getFatMassToIdeal(),
  };
}