// apps/api/src/common/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@aidesmax/shared';

export const ROLES_KEY = 'roles';

/**
 * Décorateur pour définir les rôles requis pour accéder à un endpoint
 * 
 * Usage:
 *   @Roles(UserRole.ADMIN)
 *   @Get('admin-only')
 *   adminOnlyRoute() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
