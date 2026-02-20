// apps/api/src/modules/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import {
  AuthResponse,
  User as UserDto,
  JwtPayload,
} from '@aidesmax/shared';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';

/**
 * Service d'authentification
 * 
 * Gère :
 * - L'inscription des nouveaux utilisateurs
 * - La connexion et génération de tokens JWT
 * - La transformation des entités User en DTO
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  // Nombre de rounds pour le hash bcrypt (12 = bon équilibre sécurité/performance)
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   * 
   * @param registerDto - Données d'inscription (email, password)
   * @returns AuthResponse avec user et token
   * @throws ConflictException si l'email existe déjà
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = registerDto;

    // Vérifier si l'email existe déjà
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Créer l'utilisateur
    const user = await this.usersService.create({
      email,
      passwordHash,
    });

    this.logger.log(`Nouvel utilisateur inscrit: ${user.email} (${user.id})`);

    // Générer le token JWT
    const { accessToken, expiresIn } = this.generateToken(user);

    // Retourner la réponse d'authentification
    return {
      user: this.toUserDto(user),
      accessToken,
      expiresIn,
    };
  }

  /**
   * Connexion d'un utilisateur
   * 
   * @param loginDto - Données de connexion (email, password)
   * @returns AuthResponse avec user et token
   * @throws UnauthorizedException si les identifiants sont incorrects
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Rechercher l'utilisateur
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Message générique pour ne pas révéler si l'email existe
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Mettre à jour la date de dernière connexion
    await this.usersService.updateLastLogin(user.id);

    this.logger.log(`Connexion réussie: ${user.email}`);

    // Générer le token JWT
    const { accessToken, expiresIn } = this.generateToken(user);

    // Retourner la réponse avec la date de connexion mise à jour
    return {
      user: this.toUserDto({
        ...user,
        lastLoginAt: new Date(),
      }),
      accessToken,
      expiresIn,
    };
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   * 
   * @param user - Utilisateur (depuis le token JWT)
   * @returns UserDto sans le hash du mot de passe
   */
  getMe(user: User): UserDto {
    return this.toUserDto(user);
  }

  /**
   * Générer un token JWT pour un utilisateur
   * 
   * @param user - Utilisateur pour lequel générer le token
   * @returns Token et durée d'expiration
   */
  private generateToken(user: User): { accessToken: string; expiresIn: number } {
    // Payload du token (conforme à JwtPayload de @aidesmax/shared)
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Récupérer la durée d'expiration depuis la config
    const expiresInConfig = this.configService.get<string>('jwt.expiresIn', '900s');
    
    // Générer le token
    const accessToken = this.jwtService.sign(payload);

    // Calculer expiresIn en secondes pour la réponse
    const expiresIn = this.parseExpiresIn(expiresInConfig);

    return { accessToken, expiresIn };
  }

  /**
   * Convertir une durée string en secondes
   * Supporte les formats: "900", "900s", "15m", "1h"
   */
  private parseExpiresIn(value: string): number {
    const match = value.match(/^(\d+)(s|m|h)?$/);
    if (!match) {
      return 900; // Défaut: 15 minutes
    }

    const num = parseInt(match[1], 10);
    const unit = match[2] || 's';

    switch (unit) {
      case 'h':
        return num * 3600;
      case 'm':
        return num * 60;
      case 's':
      default:
        return num;
    }
  }

  /**
   * Transformer une entité User Prisma en DTO User
   * Exclut le hash du mot de passe et formate les dates
   * 
   * @param user - Entité User de Prisma
   * @returns UserDto conforme à @aidesmax/shared
   */
  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    };
  }
}
