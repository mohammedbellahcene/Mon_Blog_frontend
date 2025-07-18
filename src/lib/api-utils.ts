// Utilitaire pour gérer les URLs de l'API
export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://127.0.0.1:8080';
};

export const getApiEndpoint = (endpoint: string): string => {
  return `${getApiUrl()}/api${endpoint}`;
};

export const getFileUrl = (filename: string): string => {
  return `${getApiUrl()}/api/files/${filename}`;
}; 