// apps/api/src/modules/auth/auth.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthResponse, User as UserDto } from '@aidesmax/shared';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Contrôleur d'authentification
 * 
 * Endpoints:
 * - POST /api/auth/register - Inscription
 * - POST /api/auth/login - Connexion
 * - GET /api/auth/me - Profil utilisateur connecté
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/register
   * 
   * Inscription d'un nouvel utilisateur
   * 
   * @param registerDto - Email et mot de passe
   * @returns AuthResponse avec user et accessToken
   * 
   * @status 201 - Inscription réussie
   * @status 400 - Validation échouée
   * @status 409 - Email déjà utilisé
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * POST /api/auth/login
   * 
   * Connexion d'un utilisateur existant
   * 
   * @param loginDto - Email et mot de passe
   * @returns AuthResponse avec user et accessToken
   * 
   * @status 200 - Connexion réussie
   * @status 400 - Validation échouée
   * @status 401 - Identifiants incorrects
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * GET /api/auth/me
   * 
   * Récupérer les informations de l'utilisateur connecté
   * 
   * @param user - Utilisateur extrait du token JWT
   * @returns UserDto (sans le hash du mot de passe)
   * 
   * @status 200 - Succès
   * @status 401 - Token manquant ou invalide
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User): UserDto {
    return this.authService.getMe(user);
  }
}
