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
}

export interface Credentials {
  email: string;
  password: string;
}