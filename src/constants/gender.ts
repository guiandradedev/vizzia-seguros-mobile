export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const GenderLabelPT: Record<Gender, string> = {
  [Gender.MALE]: 'Masculino',
  [Gender.FEMALE]: 'Feminino',
  [Gender.OTHER]: 'Outro',
};

export const GenderOptions: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER];

export type GenderType = Gender | '';

export default Gender;

// Mapping values expected by the backend API
export const GenderApiLabel: Record<Gender, string> = {
  [Gender.MALE]: 'Masculine',
  [Gender.FEMALE]: 'Feminine',
  [Gender.OTHER]: 'Other',
};

export const getGenderApiValue = (gender: GenderType) => {
  if (!gender) return '';
  return GenderApiLabel[gender as Gender] || '';
};

// Return the PT display label for a stored value. Accepts either the enum key (e.g. 'MALE')
// or the API value (e.g. 'Masculine'). Falls back to returning the raw value as string.
export const getGenderDisplayLabel = (gender: string | GenderType) => {
  if (!gender) return '';
  if (GenderOptions.includes(gender as Gender)) {
    return GenderLabelPT[gender as Gender];
  }
  const entry = Object.entries(GenderApiLabel).find(([, apiVal]) => apiVal === gender);
  if (entry && entry[0]) {
    const key = entry[0] as Gender;
    return GenderLabelPT[key];
  }
  return String(gender);
};
