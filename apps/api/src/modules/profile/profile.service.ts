import { Injectable } from '@nestjs/common';
import {
  ProfessionalStatus,
  FamilyStatus,
  HousingType,
  HousingStatus,
} from '@aidesmax/shared';

@Injectable()
export class ProfileService {
  mapProfile(profile: any) {
    return {
      ...profile,
      professionalStatus: profile.professionalStatus as ProfessionalStatus,
      familyStatus: profile.familyStatus as FamilyStatus,
      housingType: profile.housingType as HousingType,
      housingStatus: profile.housingStatus as HousingStatus,
      rawData: profile.rawData as unknown as Record<string, unknown> | null,
    };
  }
}