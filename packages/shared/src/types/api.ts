// packages/shared/src/types/api.ts

/**
 * Réponse API standard pour les erreurs
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, string[]>; // Erreurs de validation par champ
  timestamp?: string;
  path?: string;
}

/**
 * Réponse paginée générique
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Paramètres de pagination standard
 */
export interface PaginationParams {
  page?: number;   // Défaut: 1
  limit?: number;  // Défaut: 20, max: 100
}
