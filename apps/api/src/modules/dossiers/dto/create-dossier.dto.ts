// apps/api/src/modules/dossiers/dto/create-dossier.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';
import {
  CreateDossierDto as ICreateDossierDto,
  DossierFormData,
} from '@aidesmax/shared';

/**
 * DTO pour la création d'un dossier de demande d'aide
 * 
 * Un dossier est créé pour une aide spécifique et pré-rempli
 * avec les données du profil de l'utilisateur.
 * 
 * Compatible avec l'interface CreateDossierDto de @aidesmax/shared
 */
export class CreateDossierDto implements ICreateDossierDto {
  /**
   * ID de l'aide pour laquelle créer le dossier
   */
  @IsString({ message: 'L\'ID de l\'aide est requis' })
  @IsNotEmpty({ message: 'L\'ID de l\'aide ne peut pas être vide' })
  aidId: string;

  /**
   * Données initiales du formulaire (optionnel)
   * Sera fusionné avec les données pré-remplies depuis le profil
   */
  @IsOptional()
  @IsObject({ message: 'formData doit être un objet' })
  formData?: Partial<DossierFormData>;

  /**
   * Notes personnelles de l'utilisateur
   */
  @IsOptional()
  @IsString({ message: 'userNotes doit être une chaîne de caractères' })
  userNotes?: string;
}
