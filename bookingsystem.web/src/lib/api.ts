import { Book } from '@/types/book';

// Get the API URL from environment variables
// Aspire will inject this automatically via service references
const getApiUrl = () => {
  // Check for Aspire-injected service reference first (prefer HTTPS if available)
  const aspireHttpsUrl = process.env.services__bookingsystem_api__https__0;
  const aspireHttpUrl = process.env.services__bookingsystem_api__http__0;
  
  if (aspireHttpsUrl) return aspireHttpsUrl;
  if (aspireHttpUrl) return aspireHttpUrl;
  
  // Fallback to NEXT_PUBLIC_API_URL for local development
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // Final fallback
  return 'http://localhost:5080';
};

const API_BASE_URL = getApiUrl();

export const booksApi = {
  async getAll(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    
    return response.json();
  },

  async getById(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    
    return response.json();
  },

  async create(book: Omit<Book, 'id'>): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create book');
    }
    
    return response.json();
  },

  async update(id: string, book: Partial<Book>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  },
};
