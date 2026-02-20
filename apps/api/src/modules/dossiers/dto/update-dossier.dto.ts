// apps/api/src/modules/dossiers/dto/update-dossier.dto.ts

import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import {
  UpdateDossierDto as IUpdateDossierDto,
  DossierFormData,
  DossierStatus,
} from '@aidesmax/shared';

/**
 * DTO pour la mise à jour d'un dossier
 * 
 * Tous les champs sont optionnels : seuls les champs fournis seront mis à jour.
 * 
 * Compatible avec l'interface UpdateDossierDto de @aidesmax/shared
 */
export class UpdateDossierDto implements IUpdateDossierDto {
  /**
   * Nouveau statut du dossier
   * Les transitions autorisées sont vérifiées dans le service
   */
  @IsOptional()
  @IsEnum(DossierStatus, {
    message: `Le statut doit être l'une des valeurs suivantes : ${Object.values(DossierStatus).join(', ')}`,
  })
  status?: DossierStatus;

  /**
   * Données du formulaire à mettre à jour
   * Sera fusionné avec les données existantes (shallow merge)
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
