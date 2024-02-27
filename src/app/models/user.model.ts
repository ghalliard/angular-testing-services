export interface User{
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface CrateUserDto extends Omit<User, 'id'>{}
