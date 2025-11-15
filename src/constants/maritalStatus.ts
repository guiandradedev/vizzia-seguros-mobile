export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOW = 'WIDOW',
}

export const MaritalStatusLabelPT: Record<MaritalStatus, string> = {
  [MaritalStatus.SINGLE]: 'Solteiro(a)',
  [MaritalStatus.MARRIED]: 'Casado(a)',
  [MaritalStatus.DIVORCED]: 'Divorciado(a)',
  [MaritalStatus.WIDOW]: 'Viúvo(a)',
};

export const MaritalStatusOptions: MaritalStatus[] = [
  MaritalStatus.SINGLE,
  MaritalStatus.MARRIED,
  MaritalStatus.DIVORCED,
  MaritalStatus.WIDOW,
];

export type MaritalStatusType = MaritalStatus | '';

export default MaritalStatus;

// Mapping values expected by the backend API
export const MaritalStatusApiLabel: Record<MaritalStatus, string> = {
  [MaritalStatus.SINGLE]: 'Single',
  [MaritalStatus.MARRIED]: 'Married',
  [MaritalStatus.DIVORCED]: 'Divorced',
  [MaritalStatus.WIDOW]: 'Widow',
};

export const getMaritalStatusApiValue = (status: MaritalStatusType) => {
  if (!status) return '';
  return MaritalStatusApiLabel[status as MaritalStatus] || '';
};
