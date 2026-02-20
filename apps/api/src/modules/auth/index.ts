// apps/api/src/modules/auth/index.ts

export { AuthModule } from './auth.module';
export { AuthService } from './auth.service';
export { AuthController } from './auth.controller';
export { JwtStrategy } from './strategies/jwt.strategy';
export * from './dto';
Structure finale du module Auth
text

apps/api/src/modules/
├── auth/
│   ├── dto/
│   │   ├── index.ts
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── index.ts
├── users/
│   ├── users.module.ts
│   └── users.service.ts
└── prisma/
    ├── prisma.module.ts
    └── prisma.service.ts
Mise à jour de app.module.ts
Vérifie que UsersModule est bien importé (normalement via AuthModule) :

TypeScript

// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
// ... autres imports

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    UsersModule,  // Ajouté
    AuthModule,
    // ... autres modules
  ],
})
export class AppModule {}
Tests avec curl/HTTPie
1. Inscription (register)
Bash

# Avec curl
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nouveau@example.com",
    "password": "MonMotDePasse123"
  }'

# Avec HTTPie
http POST localhost:3001/api/auth/register \
  email=nouveau@example.com \
  password=MonMotDePasse123
Réponse attendue (201 Created) :

JSON

{
  "user": {
    "id": "clx...",
    "email": "nouveau@example.com",
    "role": "USER",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastLoginAt": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
Test erreur - Email déjà utilisé (409) :

Bash

curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "Test1234"}'
Test erreur - Validation (400) :

Bash

# Mot de passe trop court
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "abc"}'
2. Connexion (login)
Bash

# Avec curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aidesmax.fr",
    "password": "User123!"
  }'

# Avec HTTPie
http POST localhost:3001/api/auth/login \
  email=test@aidesmax.fr \
  password=User123!
Réponse attendue (200 OK) :

JSON

{
  "user": {
    "id": "clx...",
    "email": "test@aidesmax.fr",
    "role": "USER",
    "isActive": true,
    "emailVerified": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "lastLoginAt": "2024-01-15T14:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
Test avec compte admin :

Bash

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@aidesmax.fr", "password": "Admin123!"}'
Test erreur - Mauvais identifiants (401) :

Bash

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "mauvais"}'
3. Profil utilisateur connecté (me)
Bash

# D'abord, récupérer un token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

# Puis appeler /me avec le token
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# En une seule ligne avec HTTPie
http GET localhost:3001/api/auth/me \
  "Authorization: Bearer $(http POST localhost:3001/api/auth/login email=test@aidesmax.fr password=User123! -b | jq -r '.accessToken')"
Réponse attendue (200 OK) :

JSON

{
  "id": "clx...",
  "email": "test@aidesmax.fr",
  "role": "USER",
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "lastLoginAt": "2024-01-15T14:30:00.000Z"
}
Test erreur - Sans token (401) :

Bash

curl -X GET http://localhost:3001/api/auth/me
Test erreur - Token invalide (401) :

Bash

curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer token_invalide"
Script de test complet
Voici un script bash pour tester tous les cas :

Bash

#!/bin/bash
# test-auth.sh

API_URL="http://localhost:3001/api"
EMAIL="testauth$(date +%s)@example.com"
PASSWORD="TestPassword123"

echo "=== Test Module Auth ==="
echo ""

# 1. Test Register
echo "1. Test REGISTER..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo "   Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "   ✅ Register OK - Token reçu"
else
  echo "   ❌ Register FAILED"
  exit 1
fi

# 2. Test Register avec email existant (doit échouer)
echo ""
echo "2. Test REGISTER avec email existant (doit être 409)..."
CONFLICT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

HTTP_CODE=$(echo "$CONFLICT_RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "409" ]; then
  echo "   ✅ Conflict 409 OK"
else
  echo "   ❌ Expected 409, got $HTTP_CODE"
fi

# 3. Test Login
echo ""
echo "3. Test LOGIN..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo "   Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "   ✅ Login OK - Token reçu"
else
  echo "   ❌ Login FAILED"
  exit 1
fi

# 4. Test Login avec mauvais password (doit échouer)
echo ""
echo "4. Test LOGIN avec mauvais password (doit être 401)..."
BAD_LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"wrong\"}")

HTTP_CODE=$(echo "$BAD_LOGIN" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✅ Unauthorized 401 OK"
else
  echo "   ❌ Expected 401, got $HTTP_CODE"
fi

# 5. Test Me avec token valide
echo ""
echo "5. Test ME avec token valide..."
ME_RESPONSE=$(curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "   Response: $ME_RESPONSE"
USER_EMAIL=$(echo $ME_RESPONSE | jq -r '.email')

if [ "$USER_EMAIL" = "$EMAIL" ]; then
  echo "   ✅ Me OK - Email correct"
else
  echo "   ❌ Me FAILED - Email incorrect"
fi

# 6. Test Me sans token (doit échouer)
echo ""
echo "6. Test ME sans token (doit être 401)..."
NO_TOKEN=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/auth/me")

HTTP_CODE=$(echo "$NO_TOKEN" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✅ Unauthorized 401 OK"
else
  echo "   ❌ Expected 401, got $HTTP_CODE"
fi

echo ""
echo "=== Tests terminés ==="
Récapitulatif Étape 3.3
Fichier	Status	Description
users/users.module.ts	✅	Module utilisateurs
users/users.service.ts	✅	Service CRUD utilisateurs
auth/dto/register.dto.ts	✅	DTO inscription avec validation
auth/dto/login.dto.ts	✅	DTO connexion avec validation
auth/strategies/jwt.strategy.ts	✅	Stratégie Passport JWT
auth/auth.service.ts	✅	Logique métier auth
auth/auth.controller.ts	✅	Endpoints REST
auth/auth.module.ts	✅	Configuration module
Endpoints implémentés
Méthode	URL	Auth	Description
POST	/api/auth/register	❌	Inscription
POST	/api/auth/login	❌	Connexion
GET	/api/auth/me	✅ JWT	Profil utilisateur
Prêt pour l'Étape 3.4 (Module Profile) ?
Étape 3.4 – Module Profile
Vue d'ensemble
Le module Profile gère le profil d'éligibilité des utilisateurs, c'est-à-dire les réponses au questionnaire qui permettent d'évaluer l'éligibilité aux aides.

Fichiers à créer
