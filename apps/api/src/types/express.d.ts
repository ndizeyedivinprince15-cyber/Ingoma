// apps/api/src/types/express.d.ts

import { User } from '@prisma/client';

/**
 * Extension des types Express pour inclure l'utilisateur dans la requête
 */
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
3.2. Prisma & Base de données
