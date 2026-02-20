// apps/api/src/common/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

/**
 * Décorateur pour récupérer l'utilisateur connecté depuis la requête
 * 
 * Usage:
 *   @Get('me')
 *   getProfile(@CurrentUser() user: User) {
 *     return user;
 *   }
 * 
 *   // Ou pour récupérer une propriété spécifique:
 *   @Get('me')
 *   getProfile(@CurrentUser('id') userId: string) {
 *     return userId;
 *   }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    
    if (!user) {
      return null;
    }
    
    return data ? user[data] : user;
  },
);
