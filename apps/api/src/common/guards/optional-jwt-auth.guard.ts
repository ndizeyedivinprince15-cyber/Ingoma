// apps/api/src/common/guards/optional-jwt-auth.guard.ts

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard JWT optionnel
 * Tente d'authentifier mais ne bloque pas si pas de token
 * Utile pour les endpoints qui fonctionnent en mode anonyme ET connecté
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Toujours tenter l'authentification
    return super.canActivate(context);
  }

  // Ne pas lever d'exception si pas de token
  handleRequest<TUser = unknown>(
    _err: Error | null,
    user: TUser | false,
  ): TUser | null {
    // Si l'utilisateur n'est pas authentifié, retourner null au lieu de lever une exception
    return user || null;
  }
}
