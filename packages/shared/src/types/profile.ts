// packages/shared/src/types/profile.ts
export type CreateUpdateProfileDto = any;
export type ProfileResponse = any;
export enum ProfessionalStatus { STUDENT = 'STUDENT', WORKING = 'WORKING' }
export enum FamilyStatus { SINGLE = 'SINGLE', MARRIED = 'MARRIED' }
export enum HousingType { HOUSE = 'HOUSE', APARTMENT = 'APARTMENT' }
export enum HousingStatus { OWN = 'OWN', RENT = 'RENT' }
export type ProfileData = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  professionalStatus?: string;
  familyStatus?: string;
  housingType?: string;
  housingStatus?: string;
};