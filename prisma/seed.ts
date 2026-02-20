import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Types simplifiés pour le seed (pour éviter les dépendances complexes)
enum AidCategory {
  LOGEMENT = 'LOGEMENT',
  ENERGIE = 'ENERGIE',
  ETUDES = 'ETUDES',
  BUSINESS = 'BUSINESS',
}

enum GeographicScope {
  NATIONAL = 'NATIONAL',
}

const prisma = new PrismaClient();

const aidsData = [
  {
    name: 'Aide Personnalisée au Logement (APL) Simplifiée',
    slug: 'apl-simplifiee',
    category: AidCategory.LOGEMENT,
    shortDescription:
      'Aide mensuelle pour réduire le montant de votre loyer si vous êtes locataire avec des revenus modestes.',
    longDescription: `L'Aide Personnalisée au Logement (APL) est une aide financière destinée à réduire le montant de votre loyer.`,
    authority: "CAF (Caisse d'Allocations Familiales)",
    geographicScope: GeographicScope.NATIONAL,
    geographicZones: [],
    eligibilityRules: {
      logic: 'AND',
      conditions: [
        {
          field: 'age',
          operator: '>=',
          value: 18,
          failureMessage: 'Vous devez avoir au moins 18 ans',
          successMessage: "Critère d'âge validé (18 ans ou plus)",
        },
        {
          field: 'housingStatus',
          operator: '==',
          value: 'LOCATAIRE',
          failureMessage: 'Cette aide est réservée aux locataires',
          successMessage: 'Vous êtes bien locataire',
        },
        {
          field: 'annualIncome',
          operator: '<',
          value: 30000,
          failureMessage: 'Vos revenus dépassent le plafond de 30 000 €/an',
          successMessage: 'Vos revenus sont éligibles',
        },
      ],
    },
    estimationRules: {
      type: 'formula',
      baseAmount: 200,
      perChildBonus: 50,
      maxAmount: 450,
      incomeModifier: {
        threshold: 15000,
        reductionPercent: 25,
      },
      description: 'Montant mensuel estimé',
    },
    officialLink:
      'https://www.caf.fr/allocataires/droits-et-prestations/s-informer-sur-les-aides/logement-et-cadre-de-vie/les-aides-au-logement',
    requiredDocuments: [
      "Pièce d'identité",
      'Justificatif de domicile',
      "Avis d'imposition N-1",
      'Contrat de bail',
      'RIB',
    ],
    displayOrder: 100,
  },
  {
    name: 'Chèque Énergie Simplifié',
    slug: 'cheque-energie-simplifie',
    category: AidCategory.ENERGIE,
    shortDescription:
      "Aide annuelle pour payer vos factures d'énergie.",
    longDescription: `Le chèque énergie est une aide nominative pour le paiement des factures d'énergie du logement.`,
    authority: 'Ministère de la Transition Écologique',
    geographicScope: GeographicScope.NATIONAL,
    geographicZones: [],
    eligibilityRules: {
      logic: 'AND',
      conditions: [
        {
          field: 'annualIncome',
          operator: '<',
          value: 11000,
          failureMessage: 'Vos revenus dépassent le plafond.',
          successMessage: 'Vos revenus sont éligibles.',
        },
      ],
    },
    estimationRules: {
      type: 'range',
      min: 48,
      max: 277,
      description: 'Montant annuel selon revenus.',
    },
    officialLink: 'https://www.chequeenergie.gouv.fr/',
    requiredDocuments: [],
    displayOrder: 90,
  },
];

async function main() {
  console.log('🌱 Démarrage du seed...\n');

  // 1. Admin
  console.log("👤 Création de l'admin...");
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@aidesmax.fr' },
    update: {},
    create: {
      email: 'admin@aidesmax.fr',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  });

  // 2. User Test
  console.log("👤 Création du user test...");
  const userPassword = await bcrypt.hash('User123!', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@aidesmax.fr' },
    update: {},
    create: {
      email: 'test@aidesmax.fr',
      passwordHash: userPassword,
      role: 'USER',
      emailVerified: true,
      isActive: true,
    },
  });

  // 3. Aides
  console.log('\n📦 Création des aides...');
  for (const aidData of aidsData) {
    await prisma.aid.upsert({
      where: { slug: aidData.slug },
      update: {
        ...aidData,
        // Conversion explicite pour SQLite
        category: aidData.category as string,
        geographicScope: aidData.geographicScope as string,
        geographicZones: JSON.stringify(aidData.geographicZones),
        eligibilityRules: JSON.stringify(aidData.eligibilityRules),
        estimationRules: JSON.stringify(aidData.estimationRules),
        requiredDocuments: JSON.stringify(aidData.requiredDocuments),
      },
      create: {
        ...aidData,
        category: aidData.category as string,
        geographicScope: aidData.geographicScope as string,
        geographicZones: JSON.stringify(aidData.geographicZones),
        eligibilityRules: JSON.stringify(aidData.eligibilityRules),
        estimationRules: JSON.stringify(aidData.estimationRules),
        requiredDocuments: JSON.stringify(aidData.requiredDocuments),
      },
    });
    console.log(`   ✅ Aide créée: "${aidData.name}"`);
  }

  console.log('\n🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });