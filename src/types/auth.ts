export interface Insurance {
  estimated_price: number;
  id_insurance: number;
  vehicle: Vehicle;
}

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  // optional human-readable model name returned by local flow/API
  model_name?: string;
  brand: string;
  year: number;
  color: string;
  odometer: string;

  park_type: string;
  use_type: string;
  transmission: string;
  motorization: string;
}

import { MaritalStatusType } from '@/constants/maritalStatus';
import { GenderType } from '@/constants/gender';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  cnhN: string;
  expedition_cnh_date: number
  phone_id: string;
  birthday_date: Date;
  status: boolean;
  vehicles: Vehicle[];
  marital_status: MaritalStatusType;
  gender?: GenderType | '';
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string,
  refreshToken: string
}