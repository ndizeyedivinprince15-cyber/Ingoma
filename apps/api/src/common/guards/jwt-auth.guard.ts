// apps/api/src/common/guards/jwt-auth.guard.ts

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Guard d'authentification JWT
 * Vérifie la présence et la validité du token JWT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Ajouter ici une logique pour rendre l'auth optionnelle si besoin
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | false,
    info: Error | undefined,
  ): TUser {
    if (err) {
      throw err;
    }
    
    if (!user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expiré. Veuillez vous reconnecter.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token invalide.');
      }
      throw new UnauthorizedException('Authentification requise.');
    }
    
    return user;
  }
}
