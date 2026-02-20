/**
 * Réponse API standard pour les erreurs
 */
export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
    details?: Record<string, string[]>;
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
    page?: number;
    limit?: number;
}
//# sourceMappingURL=api.d.ts.map