export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type SerializedUser = {
  id: string;
  name?: string;
  email: string;
  status: UserStatus;
}

export type CreateUserInput = {
  name?: string;
  email: string;
  password: string;
}

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
}
