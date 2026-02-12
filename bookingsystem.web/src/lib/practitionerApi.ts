import { UpdatePractitionerInfoRequest } from '@/src/types/practitioner';

const getApiUrl = () => {
  const aspireHttpsUrl = process.env.services__bookingsystem_api__https__0;
  const aspireHttpUrl = process.env.services__bookingsystem_api__http__0;
  
  if (aspireHttpsUrl) return aspireHttpsUrl;
  if (aspireHttpUrl) return aspireHttpUrl;
  
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  return 'http://localhost:5080';
};

const API_BASE_URL = getApiUrl();

export const practitionerApi = {
  async updatePractitionerInfo(data: UpdatePractitionerInfoRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/practitioner/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return response;
  },

  async getPractitionerInfo(id: string): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/practitioner/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response;
  },
};
