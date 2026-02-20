import { UserRole } from '../constants/enums';
/**
 * Utilisateur (données publiques, sans mot de passe)
 */
export interface User {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
}
/**
 * Données pour l'inscription
 */
export interface RegisterUserDto {
    email: string;
    password: string;
}
/**
 * Données pour la connexion
 */
export interface LoginUserDto {
    email: string;
    password: string;
}
/**
 * Réponse d'authentification
 */
export interface AuthResponse {
    user: User;
    accessToken: string;
    expiresIn: number;
}
/**
 * Payload du JWT décodé
 */
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}
//# sourceMappingURL=user.d.ts.map