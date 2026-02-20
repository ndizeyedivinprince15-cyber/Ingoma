// apps/api/src/modules/eligibility/index.ts

export { EligibilityModule } from './eligibility.module';
export { EligibilityService } from './eligibility.service';
export { EligibilityEngineService } from './eligibility-engine.service';
export { EligibilityController } from './eligibility.controller';
export * from './dto';
Mise à jour de app.module.ts
Vérifie que EligibilityModule est bien importé :

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
    ProfileModule,
    AidsModule,
    EligibilityModule,  // ← Ajouté
    // ... autres modules (DossiersModule, AdminModule)
  ],
})
export class AppModule {}
Structure finale du module Eligibility
text

apps/api/src/modules/eligibility/
├── dto/
│   ├── evaluate-eligibility.dto.ts
│   └── index.ts
├── eligibility-engine.service.ts   # Moteur de règles
├── eligibility.service.ts          # Orchestration + persistance
├── eligibility.controller.ts       # Endpoint REST
├── eligibility.module.ts           # Configuration module
└── index.ts                        # Exports
Tests avec curl/HTTPie
1. Mode ANONYME (sans JWT, avec profileData)
Bash

# Profil d'un étudiant locataire
curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
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
    }
  }'
Réponse attendue (200 OK) :

JSON

{
  "results": [
    {
      "aidId": "clxaid001",
      "aid": {
        "id": "clxaid001",
        "name": "Aide Personnalisée au Logement (APL) Simplifiée",
        "slug": "apl-simplifiee",
        "category": "LOGEMENT",
        "shortDescription": "Aide mensuelle pour réduire le montant de votre loyer...",
        "authority": "CAF (Caisse d'Allocations Familiales)",
        "geographicScope": "NATIONAL",
        "isActive": true
      },
      "isEligible": true,
      "probabilityScore": 1.0,
      "estimatedAmountMin": 200,
      "estimatedAmountMax": 200,
      "criteriaResults": [
        {
          "criterion": "Âge ≥ 18",
          "passed": true,
          "message": "Critère d'âge validé (18 ans ou plus)",
          "field": "age",
          "expected": 18,
          "actual": 22
        },
        {
          "criterion": "Statut d'occupation = locataire",
          "passed": true,
          "message": "Vous êtes bien locataire",
          "field": "housingStatus",
          "expected": "LOCATAIRE",
          "actual": "LOCATAIRE"
        },
        {
          "criterion": "Revenus annuels < 30 000 €",
          "passed": true,
          "message": "Vos revenus sont éligibles (inférieurs à 30 000 €/an)",
          "field": "annualIncome",
          "expected": 30000,
          "actual": 8000
        }
      ],
      "explanation": "Vous êtes éligible à l'aide \"Aide Personnalisée au Logement (APL) Simplifiée\". Tous les critères requis sont remplis."
    },
    {
      "aidId": "clxaid002",
      "aid": {
        "id": "clxaid002",
        "name": "Chèque Énergie Simplifié",
        "slug": "cheque-energie-simplifie",
        "category": "ENERGIE",
        "shortDescription": "Aide annuelle pour payer vos factures d'énergie...",
        "authority": "Ministère de la Transition Écologique",
        "geographicScope": "NATIONAL",
        "isActive": true
      },
      "isEligible": true,
      "probabilityScore": 1.0,
      "estimatedAmountMin": 48,
      "estimatedAmountMax": 277,
      "criteriaResults": [
        {
          "criterion": "Revenus annuels < 11 000 €",
          "passed": true,
          "message": "Vos revenus sont éligibles au chèque énergie",
          "field": "annualIncome",
          "expected": 11000,
          "actual": 8000
        },
        {
          "criterion": "Statut d'occupation dans [locataire, propriétaire]",
          "passed": true,
          "message": "Vous occupez un logement éligible",
          "field": "housingStatus",
          "expected": ["LOCATAIRE", "PROPRIETAIRE"],
          "actual": "LOCATAIRE"
        }
      ],
      "explanation": "Vous êtes éligible à l'aide \"Chèque Énergie Simplifié\". Tous les critères requis sont remplis."
    },
    {
      "aidId": "clxaid003",
      "aid": {
        "id": "clxaid003",
        "name": "Bourse sur Critères Sociaux (BCS)",
        "slug": "bourse-criteres-sociaux",
        "category": "ETUDES",
        "shortDescription": "Bourse d'études pour les étudiants aux revenus modestes...",
        "authority": "CROUS",
        "geographicScope": "NATIONAL",
        "isActive": true
      },
      "isEligible": true,
      "probabilityScore": 1.0,
      "estimatedAmountMin": 1200,
      "estimatedAmountMax": 1200,
      "criteriaResults": [
        {
          "criterion": "Étudiant = oui",
          "passed": true,
          "message": "Vous êtes bien inscrit comme étudiant",
          "field": "isStudent",
          "expected": true,
          "actual": true
        },
        {
          "criterion": "Âge < 28",
          "passed": true,
          "message": "Critère d'âge validé (moins de 28 ans)",
          "field": "age",
          "expected": 28,
          "actual": 22
        },
        {
          "criterion": "Revenus annuels < 35 000 €",
          "passed": true,
          "message": "Revenus du foyer éligibles",
          "field": "annualIncome",
          "expected": 35000,
          "actual": 8000
        }
      ],
      "explanation": "Vous êtes éligible à l'aide \"Bourse sur Critères Sociaux (BCS)\". Tous les critères requis sont remplis."
    },
    {
      "aidId": "clxaid004",
      "aid": {
        "id": "clxaid004",
        "name": "Aide à la Création d'Entreprise (ACRE Simplifiée)",
        "slug": "acre-simplifiee",
        "category": "BUSINESS",
        "shortDescription": "Exonération partielle de charges sociales...",
        "authority": "URSSAF",
        "geographicScope": "NATIONAL",
        "isActive": true
      },
      "isEligible": false,
      "probabilityScore": 0.0,
      "estimatedAmountMin": null,
      "estimatedAmountMax": null,
      "criteriaResults": [
        {
          "criterion": "Projet de création d'entreprise = oui",
          "passed": false,
          "message": "Vous devez avoir un projet de création ou reprise d'entreprise",
          "field": "hasBusinessProject",
          "expected": true,
          "actual": false
        }
      ],
      "explanation": "Vous n'êtes pas éligible à l'aide \"Aide à la Création d'Entreprise (ACRE Simplifiée)\". Critères non remplis : Vous devez avoir un projet de création ou reprise d'entreprise"
    }
  ],
  "totalAidsEvaluated": 4,
  "eligibleCount": 3,
  "evaluatedAt": "2024-01-15T16:30:00.000Z",
  "persisted": false
}
2. Mode ANONYME avec filtre catégorie
Bash

curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
      "age": 25,
      "professionalStatus": "SALARIE",
      "familyStatus": "CELIBATAIRE",
      "childrenCount": 0,
      "annualIncome": 25000,
      "postalCode": "75011",
      "department": "75",
      "region": "Île-de-France",
      "housingType": "APPARTEMENT",
      "housingStatus": "LOCATAIRE",
      "hasRenovationProject": false,
      "hasBusinessProject": false,
      "isStudent": false
    },
    "category": "LOGEMENT"
  }'
3. Mode CONNECTÉ (avec JWT, utilise le profil stocké, avec persistance)
Bash

# D'abord, se connecter pour obtenir le token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

# Évaluation avec persistance (utilise le profil de l'utilisateur)
curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
Réponse attendue (200 OK) :

JSON

{
  "results": [
    {
      "aidId": "clxaid001",
      "aid": { ... },
      "isEligible": true,
      "probabilityScore": 1.0,
      "estimatedAmountMin": 175,
      "estimatedAmountMax": 175,
      "criteriaResults": [ ... ],
      "explanation": "..."
    },
    ...
  ],
  "totalAidsEvaluated": 4,
  "eligibleCount": 1,
  "evaluatedAt": "2024-01-15T16:35:00.000Z",
  "persisted": true,
  "profileId": "clx9876543210fedcba"
}
4. Mode CONNECTÉ sans persistance
Bash

curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"persistResults": false}'
5. Mode CONNECTÉ avec profileData (recalcul ponctuel, pas de persistance)
Bash

curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "profileData": {
      "age": 30,
      "professionalStatus": "CHOMEUR",
      "familyStatus": "CELIBATAIRE",
      "childrenCount": 0,
      "annualIncome": 12000,
      "postalCode": "75011",
      "department": "75",
      "region": "Île-de-France",
      "housingType": "APPARTEMENT",
      "housingStatus": "LOCATAIRE",
      "hasRenovationProject": false,
      "hasBusinessProject": true,
      "isStudent": false
    }
  }'
6. Erreur - Mode anonyme sans profileData (400)
Bash

curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -d '{}'
JSON

{
  "statusCode": 400,
  "message": "Aucune donnée de profil fournie. Veuillez fournir profileData ou vous connecter.",
  "error": "Bad Request"
}
7. Erreur - Utilisateur connecté sans profil (404)
Bash

# Créer un nouvel utilisateur sans profil
REGISTER_RESP=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "sansprofil'$(date +%s)'@test.com", "password": "Test1234"}')

NEW_TOKEN=$(echo $REGISTER_RESP | jq -r '.accessToken')

# Essayer d'évaluer sans profil
curl -X POST http://localhost:3001/api/eligibility/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -d '{}'
JSON

{
  "statusCode": 404,
  "message": "Aucun profil trouvé. Veuillez compléter le questionnaire.",
  "error": "Not Found"
}
Script de test complet
Bash

#!/bin/bash
# test-eligibility.sh

API_URL="http://localhost:3001/api"

echo "=== Test Module Eligibility ==="
echo ""

# 1. Test mode anonyme avec profileData
echo "1. Test mode ANONYME avec profileData..."
ANON_RESULT=$(curl -s -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
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
      "hasRenovationProject": false,
      "hasBusinessProject": false,
      "isStudent": true
    }
  }')

ELIGIBLE_COUNT=$(echo $ANON_RESULT | jq -r '.eligibleCount')
PERSISTED=$(echo $ANON_RESULT | jq -r '.persisted')

if [ "$PERSISTED" = "false" ] && [ "$ELIGIBLE_COUNT" -gt "0" ]; then
  echo "   ✅ Mode anonyme OK - $ELIGIBLE_COUNT aides éligibles, persisted=$PERSISTED"
else
  echo "   ❌ Erreur mode anonyme"
  echo "   $ANON_RESULT"
fi

# 2. Test mode anonyme sans profileData (doit être 400)
echo ""
echo "2. Test mode ANONYME sans profileData (doit être 400)..."
NO_DATA=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -d '{}')

HTTP_CODE=$(echo "$NO_DATA" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
  echo "   ✅ 400 Bad Request - OK"
else
  echo "   ❌ Expected 400, got $HTTP_CODE"
fi

# 3. Test mode connecté avec profil
echo ""
echo "3. Test mode CONNECTÉ avec profil existant..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

CONNECTED_RESULT=$(curl -s -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')

PERSISTED=$(echo $CONNECTED_RESULT | jq -r '.persisted')
PROFILE_ID=$(echo $CONNECTED_RESULT | jq -r '.profileId')

if [ "$PERSISTED" = "true" ] && [ "$PROFILE_ID" != "null" ]; then
  echo "   ✅ Mode connecté OK - persisted=$PERSISTED, profileId=$PROFILE_ID"
else
  echo "   ❌ Erreur mode connecté"
  echo "   $CONNECTED_RESULT"
fi

# 4. Test mode connecté avec persistResults=false
echo ""
echo "4. Test mode CONNECTÉ avec persistResults=false..."
NO_PERSIST=$(curl -s -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"persistResults": false}')

PERSISTED=$(echo $NO_PERSIST | jq -r '.persisted')
if [ "$PERSISTED" = "false" ]; then
  echo "   ✅ persistResults=false respecté"
else
  echo "   ❌ persisted devrait être false"
fi

# 5. Test avec filtre catégorie
echo ""
echo "5. Test avec filtre catégorie LOGEMENT..."
FILTERED=$(curl -s -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
      "age": 25, "professionalStatus": "SALARIE", "familyStatus": "CELIBATAIRE",
      "childrenCount": 0, "annualIncome": 25000, "postalCode": "75011",
      "department": "75", "region": "Île-de-France", "housingType": "APPARTEMENT",
      "housingStatus": "LOCATAIRE", "hasRenovationProject": false,
      "hasBusinessProject": false, "isStudent": false
    },
    "category": "LOGEMENT"
  }')

TOTAL=$(echo $FILTERED | jq -r '.totalAidsEvaluated')
echo "   ✅ $TOTAL aide(s) LOGEMENT évaluée(s)"

# 6. Test avec utilisateur sans profil (doit être 404)
echo ""
echo "6. Test utilisateur connecté SANS profil (doit être 404)..."
EMAIL="noprofil$(date +%s)@test.com"
NEW_REG=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"Test1234\"}")
NEW_TOKEN=$(echo $NEW_REG | jq -r '.accessToken')

NO_PROFILE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/eligibility/evaluate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  -d '{}')

HTTP_CODE=$(echo "$NO_PROFILE" | tail -1)
if [ "$HTTP_CODE" = "404" ]; then
  echo "   ✅ 404 Not Found - OK (pas de profil)"
else
  echo "   ❌ Expected 404, got $HTTP_CODE"
fi

echo ""
echo "=== Tests Eligibility terminés ==="
Récapitulatif Étape 3.6
Fichier	Status	Description
eligibility/dto/evaluate-eligibility.dto.ts	✅	DTO avec validation
eligibility/dto/index.ts	✅	Export des DTOs
eligibility/eligibility-engine.service.ts	✅	Moteur de règles (évaluation récursive)
eligibility/eligibility.service.ts	✅	Orchestration + persistance
eligibility/eligibility.controller.ts	✅	Endpoint REST
eligibility/eligibility.module.ts	✅	Configuration module
eligibility/index.ts	✅	Exports publics
Endpoint implémenté
Méthode	URL	Auth	Description	Status codes
POST	/api/eligibility/evaluate	❌/✅	Évaluer l'éligibilité	200, 400, 404
Fonctionnalités du moteur
Fonctionnalité	Status
Évaluation récursive AND/OR	✅
Opérateurs ==, !=, <, >, <=, >=	✅
Opérateurs in, notIn, exists, notExists	✅
Estimation fixed	✅
Estimation range	✅
Estimation formula (avec bonus enfants, modificateur revenus)	✅
Messages personnalisés (successMessage, failureMessage)	✅
Messages par défaut générés	✅
Persistance optionnelle des résultats	✅
Prêt pour l'Étape 3.7 (Module Dossiers) ?
Étape 3.7 – Module Dossiers
Vue d'ensemble
Le module Dossiers gère les dossiers de demande d'aide créés par les utilisateurs. Il permet de :

Créer un dossier pré-rempli pour une aide
Lister et consulter ses dossiers
Modifier les données et le statut d'un dossier
Générer un contenu de demande (lettre type)
Fichiers à créer
