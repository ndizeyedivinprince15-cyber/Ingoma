// packages/shared/src/index.ts

/**
 * @aidesmax/shared
 * 
 * Ce package contient tous les types, interfaces et constantes
 * partagés entre le backend (NestJS) et le frontend (Next.js).
 * 
 * Utilisation :
 *   import { User, ProfileData, AidCategory } from '@aidesmax/shared';
 */

// Types
export * from './types/api';
export * from './types/user';
export * from './types/profile';
export * from './types/aid';
export * from './types/eligibility';
export * from './types/dossier';

// Constantes et énumérations
export * from './constants/enums';
export * from './constants/regions';
