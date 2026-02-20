// apps/api/src/modules/profile/index.ts

export { ProfileModule } from './profile.module';
export { ProfileService } from './profile.service';
export { ProfileController } from './profile.controller';
export * from './dto';
Mise à jour de app.module.ts
Vérifie que ProfileModule est bien importé :

TypeScript

// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
// ... autres imports
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,  // ← Ajouté
    // ... autres modules (AidsModule, EligibilityModule, DossiersModule, AdminModule)
  ],
})
export class AppModule {}
Structure finale du module Profile
text

apps/api/src/modules/profile/
├── dto/
│   ├── create-update-profile.dto.ts
│   └── index.ts
├── profile.controller.ts
├── profile.module.ts
├── profile.service.ts
└── index.ts
Tests avec curl/HTTPie
Prérequis : Obtenir un token
Bash

# Se connecter pour obtenir un token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"
1. Créer un profil (POST /api/profile)
Bash

# Avec curl
curl -X POST http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 28,
    "professionalStatus": "SALARIE",
    "familyStatus": "EN_COUPLE",
    "childrenCount": 1,
    "annualIncome": 32000,
    "postalCode": "75011",
    "department": "75",
    "region": "Île-de-France",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "housingConstructionYear": 1985,
    "hasRenovationProject": false,
    "hasBusinessProject": false,
    "isStudent": false
  }'
Réponse attendue (201 Created pour une création, 200 OK pour une mise à jour) :

JSON

{
  "profile": {
    "id": "clx9876543210fedcba",
    "userId": "clx1234567890abcdef",
    "age": 28,
    "professionalStatus": "SALARIE",
    "familyStatus": "EN_COUPLE",
    "childrenCount": 1,
    "annualIncome": 32000,
    "postalCode": "75011",
    "department": "75",
    "region": "Île-de-France",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "housingConstructionYear": 1985,
    "hasRenovationProject": false,
    "hasBusinessProject": false,
    "isStudent": false,
    "rawData": {
      "age": 28,
      "professionalStatus": "SALARIE",
      "familyStatus": "EN_COUPLE",
      "childrenCount": 1,
      "annualIncome": 32000,
      "postalCode": "75011",
      "department": "75",
      "region": "Île-de-France",
      "housingType": "APPARTEMENT",
      "housingStatus": "LOCATAIRE",
      "housingConstructionYear": 1985,
      "hasRenovationProject": false,
      "hasBusinessProject": false,
      "isStudent": false
    },
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
2. Exemple de profil étudiant
Bash

curl -X POST http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 22,
    "professionalStatus": "ETUDIANT",
    "familyStatus": "CELIBATAIRE",
    "childrenCount": 0,
    "annualIncome": 8000,
    "postalCode": "31000",
    "department": "31",
    "region": "Occitanie",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "housingConstructionYear": null,
    "hasRenovationProject": false,
    "hasBusinessProject": false,
    "isStudent": true
  }'
3. Récupérer le profil (GET /api/profile)
Bash

# Avec curl
curl -X GET http://localhost:3001/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Avec HTTPie
http GET localhost:3001/api/profile \
  "Authorization: Bearer $TOKEN"
Réponse attendue (200 OK) :

JSON

{
  "profile": {
    "id": "clx9876543210fedcba",
    "userId": "clx1234567890abcdef",
    "age": 28,
    "professionalStatus": "SALARIE",
    "familyStatus": "EN_COUPLE",
    "childrenCount": 1,
    "annualIncome": 32000,
    "postalCode": "75011",
    "department": "75",
    "region": "Île-de-France",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "housingConstructionYear": 1985,
    "hasRenovationProject": false,
    "hasBusinessProject": false,
    "isStudent": false,
    "rawData": { ... },
    "createdAt": "2024-01-15T15:00:00.000Z",
    "updatedAt": "2024-01-15T15:30:00.000Z"
  }
}
4. Test erreur - Profil non trouvé (404)
Bash

# Créer un nouvel utilisateur sans profil
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "nouveau'$(date +%s)'@test.com", "password": "Test1234"}')

NEW_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')

# Essayer de récupérer son profil (n'existe pas encore)
curl -X GET http://localhost:3001/api/profile \
  -H "Authorization: Bearer $NEW_TOKEN"
Réponse attendue (404 Not Found) :

JSON

{
  "statusCode": 404,
  "message": "Aucun profil trouvé. Veuillez compléter le questionnaire.",
  "error": "Not Found",
  "timestamp": "2024-01-15T15:45:00.000Z",
  "path": "/api/profile"
}
5. Test erreur - Validation (400)
Bash

# Données invalides
curl -X POST http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": -5,
    "professionalStatus": "INVALIDE",
    "familyStatus": "CELIBATAIRE",
    "childrenCount": 0,
    "annualIncome": 20000,
    "postalCode": "123",
    "department": "75",
    "region": "Île-de-France",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "hasRenovationProject": false,
    "hasBusinessProject": false,
    "isStudent": false
  }'
Réponse attendue (400 Bad Request) :

JSON

{
  "statusCode": 400,
  "message": "Erreur de validation",
  "error": "Bad Request",
  "details": {
    "age": ["L'âge doit être positif"],
    "professionalStatus": ["Le statut professionnel doit être l'une des valeurs suivantes : ETUDIANT, SALARIE, INDEPENDANT, CHOMEUR, RETRAITE, INACTIF"],
    "postalCode": ["Le code postal doit contenir exactement 5 caractères", "Le code postal doit contenir 5 chiffres"]
  },
  "timestamp": "2024-01-15T15:50:00.000Z",
  "path": "/api/profile"
}
6. Test sans authentification (401)
Bash

curl -X GET http://localhost:3001/api/profile
Réponse attendue (401 Unauthorized) :

JSON

{
  "statusCode": 401,
  "message": "Authentification requise.",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T15:55:00.000Z",
  "path": "/api/profile"
}
Script de test complet
Bash

#!/bin/bash
# test-profile.sh

API_URL="http://localhost:3001/api"
EMAIL="testprofile$(date +%s)@example.com"
PASSWORD="TestPassword123"

echo "=== Test Module Profile ==="
echo ""

# 1. Créer un nouvel utilisateur
echo "1. Création d'un nouvel utilisateur..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
echo "   ✅ Utilisateur créé, token obtenu"

# 2. Tester GET /profile sans profil (doit être 404)
echo ""
echo "2. Test GET /profile sans profil (doit être 404)..."
GET_NO_PROFILE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/profile" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$GET_NO_PROFILE" | tail -1)
if [ "$HTTP_CODE" = "404" ]; then
  echo "   ✅ 404 Not Found - OK"
else
  echo "   ❌ Expected 404, got $HTTP_CODE"
fi

# 3. Créer un profil
echo ""
echo "3. Test POST /profile (création)..."
CREATE_PROFILE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 25,
    "professionalStatus": "SALARIE",
    "familyStatus": "CELIBATAIRE",
    "childrenCount": 0,
    "annualIncome": 28000,
    "postalCode": "69001",
    "department": "69",
    "region": "Auvergne-Rhône-Alpes",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "hasRenovationProject": false,
    "hasBusinessProject": true,
    "isStudent": false
  }')

HTTP_CODE=$(echo "$CREATE_PROFILE" | tail -1)
BODY=$(echo "$CREATE_PROFILE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  echo "   ✅ 201 Created - OK"
  PROFILE_ID=$(echo $BODY | jq -r '.profile.id')
  echo "   Profile ID: $PROFILE_ID"
else
  echo "   ❌ Expected 201, got $HTTP_CODE"
  echo "   Body: $BODY"
fi

# 4. Récupérer le profil
echo ""
echo "4. Test GET /profile (profil existant)..."
GET_PROFILE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/profile" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$GET_PROFILE" | tail -1)
BODY=$(echo "$GET_PROFILE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ 200 OK - Profil récupéré"
  AGE=$(echo $BODY | jq -r '.profile.age')
  echo "   Age dans le profil: $AGE"
else
  echo "   ❌ Expected 200, got $HTTP_CODE"
fi

# 5. Mettre à jour le profil
echo ""
echo "5. Test POST /profile (mise à jour)..."
UPDATE_PROFILE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "age": 26,
    "professionalStatus": "INDEPENDANT",
    "familyStatus": "EN_COUPLE",
    "childrenCount": 1,
    "annualIncome": 35000,
    "postalCode": "69001",
    "department": "69",
    "region": "Auvergne-Rhône-Alpes",
    "housingType": "APPARTEMENT",
    "housingStatus": "LOCATAIRE",
    "hasRenovationProject": true,
    "hasBusinessProject": true,
    "isStudent": false
  }')

HTTP_CODE=$(echo "$UPDATE_PROFILE" | tail -1)
BODY=$(echo "$UPDATE_PROFILE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ 200 OK - Profil mis à jour"
  NEW_AGE=$(echo $BODY | jq -r '.profile.age')
  NEW_STATUS=$(echo $BODY | jq -r '.profile.professionalStatus')
  echo "   Nouvel âge: $NEW_AGE, Nouveau statut: $NEW_STATUS"
else
  echo "   ❌ Expected 200, got $HTTP_CODE"
fi

# 6. Test validation
echo ""
echo "6. Test validation (données invalides)..."
INVALID=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"age": -1, "professionalStatus": "INVALIDE"}')

HTTP_CODE=$(echo "$INVALID" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
  echo "   ✅ 400 Bad Request - Validation OK"
else
  echo "   ❌ Expected 400, got $HTTP_CODE"
fi

echo ""
echo "=== Tests Profile terminés ==="
Récapitulatif Étape 3.4
Fichier	Status	Description
profile/dto/create-update-profile.dto.ts	✅	DTO avec validation class-validator
profile/dto/index.ts	✅	Export des DTOs
profile/profile.service.ts	✅	Logique métier (get, upsert)
profile/profile.controller.ts	✅	Endpoints REST
profile/profile.module.ts	✅	Configuration module
profile/index.ts	✅	Exports publics
Endpoints implémentés
Méthode	URL	Auth	Description	Status codes
POST	/api/profile	✅ JWT	Créer/Mettre à jour le profil	201 (créé), 200 (MAJ), 400, 401
GET	/api/profile	✅ JWT	Récupérer le profil	200, 401, 404
Points clés
Upsert intelligent : Le service détecte automatiquement s'il s'agit d'une création ou d'une mise à jour
Status code dynamique : 201 pour création, 200 pour mise à jour
Validation complète : Tous les champs sont validés avec des messages d'erreur en français
Export du service : ProfileService est exporté pour être utilisé par d'autres modules (notamment EligibilityModule)
Prêt pour l'Étape 3.5 (Module Aids) ?
Étape 3.5 – Module Aids
Vue d'ensemble
Le module Aids gère le catalogue des aides et subventions disponibles. Il expose des endpoints publics pour la consultation et des endpoints protégés pour l'administration.

Fichiers à créer
