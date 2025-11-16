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

// Return the PT display label for a stored value. Accepts either the enum key (e.g. 'SINGLE')
// or the API value (e.g. 'Single'). Falls back to returning the raw value as string.
export const getMaritalStatusDisplayLabel = (status: string | MaritalStatusType) => {
  if (!status) return '';
  // if it's a known enum key
  if (MaritalStatusOptions.includes(status as MaritalStatus)) {
    return MaritalStatusLabelPT[status as MaritalStatus];
  }
  // if it's an API value, find its key
  const entry = Object.entries(MaritalStatusApiLabel).find(([, apiVal]) => apiVal === status);
  if (entry && entry[0]) {
    const key = entry[0] as MaritalStatus;
    return MaritalStatusLabelPT[key];
  }
  // fallback to string
  return String(status);
};
