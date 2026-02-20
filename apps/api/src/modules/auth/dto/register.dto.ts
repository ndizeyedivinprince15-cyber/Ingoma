// apps/api/src/modules/auth/dto/register.dto.ts

import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { RegisterUserDto as IRegisterUserDto } from '@aidesmax/shared';

/**
 * DTO pour l'inscription d'un nouvel utilisateur
 * 
 * Validation:
 * - Email: format valide, obligatoire
 * - Password: min 8 caractères, au moins 1 majuscule et 1 chiffre
 * 
 * Compatible avec l'interface RegisterUserDto de @aidesmax/shared
 */
export class RegisterDto implements IRegisterUserDto {
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email: string;

  @IsString({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre',
  })
  password: string;
}
