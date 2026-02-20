// apps/api/src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Module Users
 * Gère les opérations CRUD sur les utilisateurs
 * Utilisé par AuthModule pour la création et validation des comptes
 */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
