// apps/api/src/modules/aids/index.ts

export { AidsModule } from './aids.module';
export { AidsService } from './aids.service';
export { AidsController } from './aids.controller';
export * from './dto';
Mise à jour de app.module.ts
Vérifie que AidsModule est bien importé :

TypeScript

// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AidsModule } from './modules/aids/aids.module';
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
    AidsModule,  // ← Ajouté
    // ... autres modules (EligibilityModule, DossiersModule, AdminModule)
  ],
})
export class AppModule {}
Structure finale du module Aids
text

apps/api/src/modules/aids/
├── dto/
│   ├── aid-filters.dto.ts
│   ├── create-aid.dto.ts
│   ├── update-aid.dto.ts
│   └── index.ts
├── aids.controller.ts
├── aids.module.ts
├── aids.service.ts
└── index.ts
Tests avec curl/HTTPie
1. Liste des aides (GET /api/aids)
Bash

# Liste simple (sans filtres)
curl -X GET "http://localhost:3001/api/aids"

# Avec pagination
curl -X GET "http://localhost:3001/api/aids?page=1&limit=10"

# Filtrer par catégorie
curl -X GET "http://localhost:3001/api/aids?category=LOGEMENT"

# Filtrer par région (retourne NATIONAL + aides de cette région)
curl -X GET "http://localhost:3001/api/aids?region=Île-de-France"

# Recherche textuelle
curl -X GET "http://localhost:3001/api/aids?search=logement"

# Combinaison de filtres
curl -X GET "http://localhost:3001/api/aids?category=ENERGIE&isActive=true&limit=5"
Réponse attendue (200 OK) :

JSON

{
  "aids": [
    {
      "id": "clxaid001",
      "name": "Aide Personnalisée au Logement (APL) Simplifiée",
      "slug": "apl-simplifiee",
      "category": "LOGEMENT",
      "shortDescription": "Aide mensuelle pour réduire le montant de votre loyer si vous êtes locataire avec des revenus modestes.",
      "authority": "CAF (Caisse d'Allocations Familiales)",
      "geographicScope": "NATIONAL",
      "isActive": true
    },
    {
      "id": "clxaid002",
      "name": "Chèque Énergie Simplifié",
      "slug": "cheque-energie-simplifie",
      "category": "ENERGIE",
      "shortDescription": "Aide annuelle pour payer vos factures d'énergie...",
      "authority": "Ministère de la Transition Écologique",
      "geographicScope": "NATIONAL",
      "isActive": true
    }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
2. Détail d'une aide (GET /api/aids/:idOrSlug)
Bash

# Par slug
curl -X GET "http://localhost:3001/api/aids/apl-simplifiee"

# Par ID
curl -X GET "http://localhost:3001/api/aids/clxaid001"
Réponse attendue (200 OK) :

JSON

{
  "aid": {
    "id": "clxaid001",
    "name": "Aide Personnalisée au Logement (APL) Simplifiée",
    "slug": "apl-simplifiee",
    "category": "LOGEMENT",
    "shortDescription": "Aide mensuelle pour réduire le montant de votre loyer si vous êtes locataire avec des revenus modestes.",
    "longDescription": "L'Aide Personnalisée au Logement (APL) est une aide financière destinée à réduire le montant de votre loyer...",
    "authority": "CAF (Caisse d'Allocations Familiales)",
    "geographicScope": "NATIONAL",
    "geographicZones": [],
    "eligibilityRules": {
      "logic": "AND",
      "conditions": [
        { "field": "age", "operator": ">=", "value": 18 },
        { "field": "housingStatus", "operator": "==", "value": "LOCATAIRE" },
        { "field": "annualIncome", "operator": "<", "value": 30000 }
      ]
    },
    "estimationRules": {
      "type": "formula",
      "baseAmount": 200,
      "perChildBonus": 50,
      "maxAmount": 450
    },
    "officialLink": "https://www.caf.fr/...",
    "requiredDocuments": ["Pièce d'identité", "Justificatif de domicile", "..."],
    "displayOrder": 100,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
Erreur 404 :

Bash

curl -X GET "http://localhost:3001/api/aids/aide-inexistante"
JSON

{
  "statusCode": 404,
  "message": "Aide \"aide-inexistante\" non trouvée",
  "error": "Not Found"
}
3. Créer une aide (POST /api/aids) - Admin
Bash

# D'abord, se connecter en admin pour obtenir le token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@aidesmax.fr", "password": "Admin123!"}' \
  | jq -r '.accessToken')

# Créer une nouvelle aide
curl -X POST http://localhost:3001/api/aids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Prime de Noël Simplifiée",
    "slug": "prime-noel-simplifiee",
    "category": "FAMILLE",
    "shortDescription": "Aide exceptionnelle versée en fin d'\''année aux bénéficiaires de certains minima sociaux.",
    "longDescription": "La prime de Noël est une aide financière versée chaque année en décembre...",
    "authority": "CAF / Pôle Emploi",
    "geographicScope": "NATIONAL",
    "geographicZones": [],
    "eligibilityRules": {
      "logic": "OR",
      "conditions": [
        { "field": "professionalStatus", "operator": "==", "value": "CHOMEUR" },
        { "field": "annualIncome", "operator": "<", "value": 10000 }
      ]
    },
    "estimationRules": {
      "type": "fixed",
      "amount": 152,
      "description": "Montant pour une personne seule"
    },
    "officialLink": "https://www.service-public.fr/particuliers/vosdroits/F1279",
    "requiredDocuments": ["Aucun document requis (versement automatique)"],
    "displayOrder": 50,
    "isActive": true
  }'
Réponse attendue (201 Created) :

JSON

{
  "aid": {
    "id": "clx...",
    "name": "Prime de Noël Simplifiée",
    "slug": "prime-noel-simplifiee",
    "category": "FAMILLE",
    "shortDescription": "Aide exceptionnelle versée en fin d'année...",
    "longDescription": "La prime de Noël est une aide financière...",
    "authority": "CAF / Pôle Emploi",
    "geographicScope": "NATIONAL",
    "geographicZones": [],
    "eligibilityRules": { ... },
    "estimationRules": { "type": "fixed", "amount": 152 },
    "officialLink": "https://...",
    "requiredDocuments": ["Aucun document requis (versement automatique)"],
    "displayOrder": 50,
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
Erreur 409 (slug existant) :

Bash

curl -X POST http://localhost:3001/api/aids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name": "Test", "slug": "apl-simplifiee", "category": "LOGEMENT", "shortDescription": "Test", "authority": "Test", "geographicScope": "NATIONAL", "eligibilityRules": {"logic": "AND", "conditions": []}}'
JSON

{
  "statusCode": 409,
  "message": "Le slug \"apl-simplifiee\" est déjà utilisé",
  "error": "Conflict"
}
Erreur 403 (pas admin) :

Bash

# Avec un token utilisateur normal
USER_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

curl -X POST http://localhost:3001/api/aids \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"name": "Test", "slug": "test", ...}'
JSON

{
  "statusCode": 403,
  "message": "Accès refusé: rôle insuffisant. Rôle(s) requis: ADMIN",
  "error": "Forbidden"
}
4. Mettre à jour une aide (PUT /api/aids/:idOrSlug) - Admin
Bash

curl -X PUT http://localhost:3001/api/aids/prime-noel-simplifiee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "shortDescription": "Aide exceptionnelle versée en décembre aux bénéficiaires de minima sociaux (RSA, ASS...).",
    "displayOrder": 60
  }'
Réponse attendue (200 OK) :

JSON

{
  "aid": {
    "id": "clx...",
    "name": "Prime de Noël Simplifiée",
    "slug": "prime-noel-simplifiee",
    "shortDescription": "Aide exceptionnelle versée en décembre aux bénéficiaires de minima sociaux (RSA, ASS...).",
    "displayOrder": 60,
    ...
  }
}
5. Désactiver une aide (DELETE /api/aids/:idOrSlug) - Admin
Bash

curl -X DELETE http://localhost:3001/api/aids/prime-noel-simplifiee \
  -H "Authorization: Bearer $ADMIN_TOKEN"
Réponse attendue (200 OK) :

JSON

{
  "message": "Aide désactivée avec succès",
  "aid": {
    "id": "clx...",
    "name": "Prime de Noël Simplifiée",
    "slug": "prime-noel-simplifiee",
    "category": "FAMILLE",
    "shortDescription": "...",
    "authority": "CAF / Pôle Emploi",
    "geographicScope": "NATIONAL",
    "isActive": false
  }
}
Script de test complet
Bash

#!/bin/bash
# test-aids.sh

API_URL="http://localhost:3001/api"

echo "=== Test Module Aids ==="
echo ""

# 1. Test GET /aids (public)
echo "1. Test GET /aids (liste publique)..."
LIST_RESPONSE=$(curl -s "$API_URL/aids")
TOTAL=$(echo $LIST_RESPONSE | jq -r '.meta.total')
echo "   ✅ $TOTAL aides trouvées"

# 2. Test GET /aids avec filtres
echo ""
echo "2. Test GET /aids avec filtre catégorie..."
LOGEMENT=$(curl -s "$API_URL/aids?category=LOGEMENT")
COUNT=$(echo $LOGEMENT | jq -r '.aids | length')
echo "   ✅ $COUNT aides dans la catégorie LOGEMENT"

# 3. Test GET /aids/:slug
echo ""
echo "3. Test GET /aids/:slug..."
DETAIL=$(curl -s "$API_URL/aids/apl-simplifiee")
NAME=$(echo $DETAIL | jq -r '.aid.name')
echo "   ✅ Aide trouvée: $NAME"

# 4. Test GET /aids/:slug non existant
echo ""
echo "4. Test GET /aids/:slug inexistant (doit être 404)..."
NOT_FOUND=$(curl -s -w "\n%{http_code}" "$API_URL/aids/inexistant")
HTTP_CODE=$(echo "$NOT_FOUND" | tail -1)
if [ "$HTTP_CODE" = "404" ]; then
  echo "   ✅ 404 Not Found - OK"
else
  echo "   ❌ Expected 404, got $HTTP_CODE"
fi

# 5. Test POST /aids sans auth (doit être 401)
echo ""
echo "5. Test POST /aids sans auth (doit être 401)..."
NO_AUTH=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/aids" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}')
HTTP_CODE=$(echo "$NO_AUTH" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✅ 401 Unauthorized - OK"
else
  echo "   ❌ Expected 401, got $HTTP_CODE"
fi

# 6. Test POST /aids avec user normal (doit être 403)
echo ""
echo "6. Test POST /aids avec user normal (doit être 403)..."
USER_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@aidesmax.fr", "password": "User123!"}' \
  | jq -r '.accessToken')

FORBIDDEN=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/aids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"name":"Test","slug":"test","category":"LOGEMENT","shortDescription":"Test","authority":"Test","geographicScope":"NATIONAL","eligibilityRules":{"logic":"AND","conditions":[]}}')
HTTP_CODE=$(echo "$FORBIDDEN" | tail -1)
if [ "$HTTP_CODE" = "403" ]; then
  echo "   ✅ 403 Forbidden - OK"
else
  echo "   ❌ Expected 403, got $HTTP_CODE"
fi

# 7. Test POST /aids avec admin
echo ""
echo "7. Test POST /aids avec admin..."
ADMIN_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@aidesmax.fr", "password": "Admin123!"}' \
  | jq -r '.accessToken')

SLUG="test-aide-$(date +%s)"
CREATE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/aids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{
    \"name\": \"Aide de Test\",
    \"slug\": \"$SLUG\",
    \"category\": \"LOGEMENT\",
    \"shortDescription\": \"Aide créée pour les tests\",
    \"authority\": \"Test Authority\",
    \"geographicScope\": \"NATIONAL\",
    \"eligibilityRules\": {\"logic\": \"AND\", \"conditions\": [{\"field\": \"age\", \"operator\": \">=\", \"value\": 18}]},
    \"estimationRules\": {\"type\": \"fixed\", \"amount\": 100}
  }")

HTTP_CODE=$(echo "$CREATE" | tail -1)
if [ "$HTTP_CODE" = "201" ]; then
  echo "   ✅ 201 Created - Aide créée"
else
  echo "   ❌ Expected 201, got $HTTP_CODE"
  echo "   Body: $(echo "$CREATE" | sed '$d')"
fi

# 8. Test DELETE /aids/:slug
echo ""
echo "8. Test DELETE /aids/:slug (désactivation)..."
DELETE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/aids/$SLUG" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
HTTP_CODE=$(echo "$DELETE" | tail -1)
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ 200 OK - Aide désactivée"
else
  echo "   ❌ Expected 200, got $HTTP_CODE"
fi

echo ""
echo "=== Tests Aids terminés ==="
Récapitulatif Étape 3.5
Fichier	Status	Description
aids/dto/create-aid.dto.ts	✅	DTO création avec validation
aids/dto/update-aid.dto.ts	✅	DTO mise à jour (champs optionnels)
aids/dto/aid-filters.dto.ts	✅	DTO filtres de recherche
aids/dto/index.ts	✅	Export des DTOs
aids/aids.service.ts	✅	Logique métier (CRUD, pagination, filtres)
aids/aids.controller.ts	✅	Endpoints REST
aids/aids.module.ts	✅	Configuration module
aids/index.ts	✅	Exports publics
Endpoints implémentés
Méthode	URL	Auth	Description	Status codes
GET	/api/aids	❌	Liste paginée avec filtres	200
GET	/api/aids/:idOrSlug	❌	Détail d'une aide	200, 404
POST	/api/aids	✅ ADMIN	Créer une aide	201, 400, 401, 403, 409
PUT	/api/aids/:idOrSlug	✅ ADMIN	Mettre à jour une aide	200, 400, 401, 403, 404, 409
DELETE	/api/aids/:idOrSlug	✅ ADMIN	Désactiver une aide	200, 401, 403, 404
Points clés
Résolution ID/Slug : Les endpoints acceptent aussi bien l'ID que le slug
Soft delete : La suppression ne fait que désactiver l'aide
Filtrage intelligent : Les aides nationales sont toujours incluses quand on filtre par région
Export du service : AidsService est exporté pour être utilisé par EligibilityModule
Prêt pour l'Étape 3.6 (Module Eligibility - Moteur d'évaluation) ?
Étape 3.6 – Module Eligibility (Moteur d'évaluation)
Vue d'ensemble
Le module Eligibility est le cœur du produit AidesMax. Il évalue l'éligibilité d'un profil utilisateur à l'ensemble des aides disponibles, calcule les estimations de montant, et génère des explications détaillées.

Fichiers à créer
