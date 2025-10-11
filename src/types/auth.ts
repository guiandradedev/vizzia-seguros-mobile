export interface Vehicle {
  // id: number;
  // model: string;
  // brand: string;
  // year: number;
  // license_plate: string;
  // renavam: string;
  // user_id: number;
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