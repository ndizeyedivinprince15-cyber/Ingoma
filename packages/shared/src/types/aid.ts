export enum AidCategory {
  HOUSING = 'HOUSING',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
}

export enum GeographicScope {
  NATIONAL = 'NATIONAL',
  REGIONAL = 'REGIONAL',
  LOCAL = 'LOCAL',
}

export type Aid = {
  id: string;
  name: string;
  slug: string;
  category: AidCategory;
  shortDescription: string;
  longDescription: string;
  authority: string;
  geographicScope: GeographicScope;
  eligibilityRules?: string | object;
  estimationRules?: string | object;
  isActive: boolean;
};

export type AidSummary = Pick<Aid, 'id' | 'name' | 'slug' | 'category' | 'shortDescription' | 'authority'>;

export type AidsListResponse = AidSummary[];
export type AidDetailResponse = Aid;

export type CreateAidDto = Omit<Aid, 'id'>;
export type UpdateAidDto = Partial<CreateAidDto>;