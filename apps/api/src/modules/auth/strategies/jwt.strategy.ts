// apps/api/src/modules/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { JwtPayload } from '@aidesmax/shared';
import { UsersService } from '../../users/users.service';

/**
 * Stratégie JWT pour Passport
 * 
 * Extrait et valide le token JWT depuis le header Authorization
 * Récupère l'utilisateur complet depuis la base de données
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extraction du token depuis le header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ne pas ignorer l'expiration
      ignoreExpiration: false,
      // Secret pour vérifier la signature
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Méthode appelée après validation du token
   * Le payload est déjà décodé et vérifié par Passport
   * 
   * @param payload - Payload du JWT décodé
   * @returns L'utilisateur complet (sera injecté dans request.user)
   */
  async validate(payload: JwtPayload): Promise<User> {
    // Récupérer l'utilisateur depuis la base de données
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Retourner l'utilisateur complet (sera disponible via @CurrentUser())
    return user;
  }
}
