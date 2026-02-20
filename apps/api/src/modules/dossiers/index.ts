// apps/api/src/modules/dossiers/index.ts

export { DossiersModule } from './dossiers.module';
export { DossiersService } from './dossiers.service';
export { DocumentGeneratorService } from './document-generator.service';
export { DossiersController } from './dossiers.controller';
export * from './dto';
Mise à jour de app.module.ts
Vérifie que DossiersModule est bien importé :

TypeScript

// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AidsModule } from './modules/aids/aids.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { DossiersModule } from './modules/dossiers/dossiers.module';
// import { AdminModule } from './modules/admin/admin.module'; // Pour plus tard
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
    ProfileModule,
    AidsModule,
    EligibilityModule,
    DossiersModule,  // ← Ajouté
    // AdminModule,
  ],
})
export class AppModule {}
Structure finale du module Dossiers
text

apps/api/src/modules/dossiers/
├── dto/
│   ├── create-dossier.dto.ts
│   ├── update-dossier.dto.ts
│   ├── dossier-filters.dto.ts
│   └── index.ts
├── document-generator.service.ts   # Génération de lettres
├── dossiers.service.ts             # Logique métier
├── dossiers.controller.ts          # Endpoints REST
├── dossiers.module.ts              # Configuration module
└── index.ts                        # Exports
Tests avec curl/HTTPie
Prérequis : Obtenir un token et récupérer un aidId
Bash

# Se connecter pour obtenir un token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"

# Récupérer l'ID de la première aide (APL)
AID_ID=$(curl -s http://localhost:3001/api/aids?limit=1 | jq -r '.aids[0].id')
echo "Aid ID: $AID_ID"
1. Créer un dossier (POST /api/dossiers)
Bash

# Créer un dossier pour l'APL
curl -X POST http://localhost:3001/api/dossiers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"aidId\": \"$AID_ID\",
    \"userNotes\": \"Dossier à compléter avec mon bail\"
  }"
Réponse attendue (201 Created) :

JSON

{
  "dossier": {
    "id": "clxdos001abc...",
    "userId": "clxuser001...",
    "aidId": "clxaid001...",
    "aidName": "Aide Personnalisée au Logement (APL) Simplifiée",
    "aidCategory": "LOGEMENT",
    "status": "BROUILLON",
    "aid": {
      "id": "clxaid001...",
      "name": "Aide Personnalisée au Logement (APL) Simplifiée",
      "slug": "apl-simplifiee",
      "category": "LOGEMENT",
      "shortDescription": "Aide mensuelle pour réduire le montant de votre loyer...",
      "authority": "CAF (Caisse d'Allocations Familiales)",
      "geographicScope": "NATIONAL",
      "isActive": true
    },
    "formData": {
      "personalInfo": {
        "fullName": "",
        "birthDate": "",
        "address": "",
        "phone": "",
        "email": "test@aidesmax.fr"
      },
      "aidSpecificData": {
        "age": 25,
        "professionalStatus": "SALARIE",
        "familyStatus": "CELIBATAIRE",
        "childrenCount": 0,
        "annualIncome": 24000,
        "postalCode": "75011",
        "department": "75",
        "region": "Île-de-France",
        "housingType": "APPARTEMENT",
        "housingStatus": "LOCATAIRE",
        "hasRenovationProject": false,
        "hasBusinessProject": false,
        "isStudent": false
      },
      "declaredDocuments": []
    },
    "generatedContent": "═══════════════════════════════════════...",
    "userNotes": "Dossier à compléter avec mon bail",
    "externalReference": null,
    "createdAt": "2024-01-15T17:00:00.000Z",
    "updatedAt": "2024-01-15T17:00:00.000Z",
    "submittedAt": null
  }
}
2. Créer un dossier avec des données personnalisées
Bash

curl -X POST http://localhost:3001/api/dossiers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"aidId\": \"$AID_ID\",
    \"formData\": {
      \"personalInfo\": {
        \"fullName\": \"Jean Dupont\",
        \"phone\": \"0612345678\",
        \"address\": \"15 rue de la Paix, 75001 Paris\"
      }
    },
    \"userNotes\": \"Dossier prioritaire\"
  }"
3. Lister les dossiers (GET /api/dossiers)
Bash

# Liste simple
curl -X GET http://localhost:3001/api/dossiers \
  -H "Authorization: Bearer $TOKEN"

# Avec filtre par statut
curl -X GET "http://localhost:3001/api/dossiers?status=BROUILLON" \
  -H "Authorization: Bearer $TOKEN"

# Avec pagination
curl -X GET "http://localhost:3001/api/dossiers?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"

# Avec filtre par catégorie d'aide
curl -X GET "http://localhost:3001/api/dossiers?aidCategory=LOGEMENT" \
  -H "Authorization: Bearer $TOKEN"
Réponse attendue (200 OK) :

JSON

{
  "dossiers": [
    {
      "id": "clxdos001abc...",
      "aidId": "clxaid001...",
      "aidName": "Aide Personnalisée au Logement (APL) Simplifiée",
      "aidCategory": "LOGEMENT",
      "status": "BROUILLON",
      "createdAt": "2024-01-15T17:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z",
      "submittedAt": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
4. Récupérer un dossier par ID (GET /api/dossiers/:id)
Bash

# Récupérer l'ID du premier dossier
DOSSIER_ID=$(curl -s http://localhost:3001/api/dossiers \
  -H "Authorization: Bearer $TOKEN" | jq -r '.dossiers[0].id')

echo "Dossier ID: $DOSSIER_ID"

# Récupérer le détail
curl -X GET "http://localhost:3001/api/dossiers/$DOSSIER_ID" \
  -H "Authorization: Bearer $TOKEN"
5. Mettre à jour le statut : BROUILLON → PRET (PUT /api/dossiers/:id)
Bash

curl -X PUT "http://localhost:3001/api/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "PRET",
    "formData": {
      "personalInfo": {
        "fullName": "Jean Dupont",
        "phone": "0612345678"
      }
    },
    "userNotes": "Dossier complet, prêt à envoyer"
  }'
Réponse attendue (200 OK) :

JSON

{
  "dossier": {
    "id": "clxdos001abc...",
    "status": "PRET",
    "formData": {
      "personalInfo": {
        "fullName": "Jean Dupont",
        "phone": "0612345678",
        "email": "test@aidesmax.fr",
        ...
      },
      ...
    },
    "userNotes": "Dossier complet, prêt à envoyer",
    ...
  }
}
6. Marquer comme SOUMIS
Bash

curl -X PUT "http://localhost:3001/api/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "SOUMIS"}'
La réponse inclura "submittedAt": "2024-01-15T17:30:00.000Z".

7. Erreurs
Dossier non trouvé (404) :

Bash

curl -X GET http://localhost:3001/api/dossiers/id-inexistant \
  -H "Authorization: Bearer $TOKEN"
JSON

{
  "statusCode": 404,
  "message": "Dossier \"id-inexistant\" non trouvé",
  "error": "Not Found"
}
Transition non autorisée (400) :

Bash

# Essayer de passer de SOUMIS à BROUILLON (interdit pour un user)
curl -X PUT "http://localhost:3001/api/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "BROUILLON"}'
JSON

{
  "statusCode": 400,
  "message": "Transition de statut non autorisée : SOUMIS → BROUILLON",
  "error": "Bad Request"
}
Aide non trouvée (404) :

Bash

curl -X POST http://localhost:3001/api/dossiers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"aidId": "id-aide-inexistante"}'
JSON

{
  "statusCode": 404,
  "message": "Aide \"id-aide-inexistante\" non trouvée",
  "error": "Not Found"
}
Script de test complet
Bash

#!/bin/bash
# test-dossiers.sh

API_URL="http://localhost:3001/api"

echo "=== Test Module Dossiers ==="
echo ""

# 1. Connexion
echo "1. Connexion..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "   ❌ Échec de connexion"
  exit 1
fi
echo "   ✅ Token obtenu"

# 2. Récupérer un aidId
echo ""
echo "2. Récupération d'un ID d'aide..."
AID_ID=$(curl -s "$API_URL/aids?limit=1" | jq -r '.aids[0].id')
echo "   ✅ Aid ID: $AID_ID"

# 3. Créer un dossier
echo ""
echo "3. Création d'un dossier..."
CREATE_RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/dossiers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"aidId\": \"$AID_ID\", \"userNotes\": \"Test dossier\"}")

HTTP_CODE=$(echo "$CREATE_RESP" | tail -1)
BODY=$(echo "$CREATE_RESP" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  DOSSIER_ID=$(echo $BODY | jq -r '.dossier.id')
  echo "   ✅ Dossier créé: $DOSSIER_ID"
else
  echo "   ❌ Erreur création: $HTTP_CODE"
  echo "   $BODY"
  exit 1
fi

# 4. Lister les dossiers
echo ""
echo "4. Liste des dossiers..."
LIST_RESP=$(curl -s "$API_URL/dossiers" -H "Authorization: Bearer $TOKEN")
TOTAL=$(echo $LIST_RESP | jq -r '.meta.total')
echo "   ✅ $TOTAL dossier(s) trouvé(s)"

# 5. Récupérer le dossier
echo ""
echo "5. Récupération du dossier..."
GET_RESP=$(curl -s "$API_URL/dossiers/$DOSSIER_ID" -H "Authorization: Bearer $TOKEN")
STATUS=$(echo $GET_RESP | jq -r '.dossier.status')
echo "   ✅ Statut actuel: $STATUS"

# 6. Passer à PRET
echo ""
echo "6. Transition BROUILLON → PRET..."
UPDATE_RESP=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "PRET", "userNotes": "Prêt à envoyer"}')

HTTP_CODE=$(echo "$UPDATE_RESP" | tail -1)
if [ "$HTTP_CODE" = "200" ]; then
  NEW_STATUS=$(echo "$UPDATE_RESP" | sed '$d' | jq -r '.dossier.status')
  echo "   ✅ Nouveau statut: $NEW_STATUS"
else
  echo "   ❌ Erreur: $HTTP_CODE"
fi

# 7. Passer à SOUMIS
echo ""
echo "7. Transition PRET → SOUMIS..."
SUBMIT_RESP=$(curl -s -X PUT "$API_URL/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "SOUMIS"}')

SUBMITTED_AT=$(echo $SUBMIT_RESP | jq -r '.dossier.submittedAt')
if [ "$SUBMITTED_AT" != "null" ]; then
  echo "   ✅ Soumis le: $SUBMITTED_AT"
else
  echo "   ❌ submittedAt devrait être défini"
fi

# 8. Test transition invalide
echo ""
echo "8. Test transition invalide SOUMIS → BROUILLON..."
INVALID_RESP=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL/dossiers/$DOSSIER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "BROUILLON"}')

HTTP_CODE=$(echo "$INVALID_RESP" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
  echo "   ✅ 400 Bad Request - Transition refusée comme attendu"
else
  echo "   ❌ Expected 400, got $HTTP_CODE"
fi

# 9. Test sans authentification
echo ""
echo "9. Test sans authentification (doit être 401)..."
NO_AUTH=$(curl -s -w "\n%{http_code}" "$API_URL/dossiers")
HTTP_CODE=$(echo "$NO_AUTH" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✅ 401 Unauthorized - OK"
else
  echo "   ❌ Expected 401, got $HTTP_CODE"
fi

echo ""
echo "=== Tests Dossiers terminés ==="
Récapitulatif Étape 3.7
Fichier	Status	Description
dossiers/dto/create-dossier.dto.ts	✅	DTO création
dossiers/dto/update-dossier.dto.ts	✅	DTO mise à jour
dossiers/dto/dossier-filters.dto.ts	✅	DTO filtres
dossiers/dto/index.ts	✅	Export des DTOs
dossiers/document-generator.service.ts	✅	Génération de lettres
dossiers/dossiers.service.ts	✅	Logique métier
dossiers/dossiers.controller.ts	✅	Endpoints REST
dossiers/dossiers.module.ts	✅	Configuration module
dossiers/index.ts	✅	Exports publics
Endpoints implémentés
Méthode	URL	Auth	Description	Status codes
POST	/api/dossiers	✅ JWT	Créer un dossier	201, 400, 401, 404
GET	/api/dossiers	✅ JWT	Lister ses dossiers	200, 401
GET	/api/dossiers/:id	✅ JWT	Détail d'un dossier	200, 401, 403, 404
PUT	/api/dossiers/:id	✅ JWT	Mettre à jour	200, 400, 401, 403, 404
Fonctionnalités
Fonctionnalité	Status
Pré-remplissage depuis le profil	✅
Génération de lettre type	✅
Transitions de statut contrôlées	✅
Contrôle d'accès (propriétaire/admin)	✅
Pagination et filtres	✅
Date de soumission automatique	✅
Backend complet !
🎉 Le backend est maintenant complet avec tous les modules fonctionnels :

Module	Endpoints	Description
Auth	3	Inscription, connexion, profil
Profile	2	Questionnaire d'éligibilité
Aids	5	Catalogue des aides
Eligibility	1	Moteur d'évaluation
Dossiers	4	Gestion des dossiers
Total : 15 endpoints REST fonctionnels

Prêt pour l'Étape 4 (Frontend Next.js) ?
Étape 4 – Frontend Next.js (Partie 1)
Vue d'ensemble
Cette première partie couvre :

4.1 : Configuration du projet Next.js + Tailwind
4.2 : Authentification (login/register, contexte, API client)
4.3 : Questionnaire + évaluation d'éligibilité
4.1 – Configuration & Structure du projet
Structure des dossiers
text

apps/web/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── questionnaire/
│   │   │   └── page.tsx
│   │   └── resultats/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Alert.tsx
│   │   ├── questionnaire/
│   │   │   ├── QuestionnaireForm.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   └── steps/
│   │   │       ├── Step1Personal.tsx
│   │   │       ├── Step2Income.tsx
│   │   │       ├── Step3Housing.tsx
│   │   │       └── Step4Projects.tsx
│   │   └── eligibility/
│   │       ├── EligibilityResults.tsx
│   │       └── AidResultCard.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── EligibilityContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types/
│       └── index.ts
├── .env.local.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
