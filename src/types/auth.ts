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
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  cnh: string;
  expedition_cnh_date: number
  phone_id: string;
  birthday_date: Date;
  status: boolean;
  vehicles: Vehicle[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string,
  refreshToken: string
}