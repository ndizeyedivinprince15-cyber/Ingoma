// apps/api/src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Placeholder pour build rapide
export type UserRole = any;

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);