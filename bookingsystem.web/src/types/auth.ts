export type UserRole = 'patient' | 'admin' | 'practitioner';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AdminRegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface PatientRegisterRequest {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface PractitionerRegisterRequest {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  specialization?: string | null;
  practice?: string | null;
}

export type RegisterRequest = AdminRegisterRequest | PatientRegisterRequest | PractitionerRegisterRequest;
