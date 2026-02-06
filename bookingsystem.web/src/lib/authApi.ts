import {
  LoginRequest,
  AdminRegisterRequest,
  PatientRegisterRequest,
  PractitionerRegisterRequest,
  UserRole,
} from '@/src/types/auth';

const getApiUrl = () => {
  const aspireHttpsUrl = process.env.services__bookingsystem_api__https__0;
  const aspireHttpUrl = process.env.services__bookingsystem_api__http__0;
  
  if (aspireHttpsUrl) return aspireHttpsUrl;
  if (aspireHttpUrl) return aspireHttpUrl;
  
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  return 'http://localhost:5080';
};

const API_BASE_URL = getApiUrl();

export const authApi = {
  async login(role: UserRole, data: LoginRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/auth/${role}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },

  async registerAdmin(data: AdminRegisterRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/auth/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },

  async registerPatient(data: PatientRegisterRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/auth/patient/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },

  async registerPractitioner(data: PractitionerRegisterRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/auth/practitioner/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },
};
