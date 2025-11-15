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
