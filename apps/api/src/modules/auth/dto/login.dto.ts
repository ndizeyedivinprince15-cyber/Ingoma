// apps/api/src/modules/auth/dto/login.dto.ts

import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { LoginUserDto as ILoginUserDto } from '@aidesmax/shared';

/**
 * DTO pour la connexion d'un utilisateur
 * 
 * Validation:
 * - Email: format valide, obligatoire
 * - Password: obligatoire
 * 
 * Compatible avec l'interface LoginUserDto de @aidesmax/shared
 */
export class LoginDto implements ILoginUserDto {
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe est requis' })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  password: string;
}
