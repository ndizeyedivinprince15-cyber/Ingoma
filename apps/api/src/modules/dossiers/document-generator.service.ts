// apps/api/src/modules/dossiers/document-generator.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  UserProfile,
  AidSummary,
  DossierFormData,
} from '@aidesmax/shared';

/**
 * Paramètres pour la génération de document
 */
export interface GenerateDocumentParams {
  user: User;
  profile: UserProfile | null;
  aid: AidSummary;
  formData: DossierFormData;
}

/**
 * Service de génération de documents
 * 
 * Pour le MVP, génère une simple lettre de demande en texte.
 * 
 * TODO pour la production :
 * - Intégration avec un LLM pour génération personnalisée
 * - Génération de PDF
 * - Templates par type d'aide
 */
@Injectable()
export class DocumentGeneratorService {
  private readonly logger = new Logger(DocumentGeneratorService.name);

  /**
   * Générer le contenu du dossier (lettre de demande)
   * 
   * @param params - Données pour la génération
   * @returns Contenu textuel de la demande
   */
  generateDossierContent(params: GenerateDocumentParams): string {
    const { user, profile, aid, formData } = params;

    this.logger.debug(`Génération de contenu pour l'aide "${aid.name}"`);

    // Récupérer les informations disponibles
    const fullName = formData.personalInfo?.fullName || 'Non renseigné';
    const email = formData.personalInfo?.email || user.email;
    const phone = formData.personalInfo?.phone || 'Non renseigné';
    const address = formData.personalInfo?.address || 'Non renseignée';

    // Informations du profil
    const age = profile?.age || 'Non renseigné';
    const situation = this.formatProfessionalStatus(profile?.professionalStatus);
    const familyStatus = this.formatFamilyStatus(profile?.familyStatus);
    const children = profile?.childrenCount ?? 0;
    const income = profile?.annualIncome 
      ? new Intl.NumberFormat('fr-FR').format(profile.annualIncome) + ' €'
      : 'Non renseigné';
    const postalCode = profile?.postalCode || 'Non renseigné';
    const housingStatus = this.formatHousingStatus(profile?.housingStatus);

    // Date formatée
    const today = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Générer la lettre
    const content = `
═══════════════════════════════════════════════════════════════════════════════
                    DEMANDE D'AIDE - ${aid.name.toUpperCase()}
═══════════════════════════════════════════════════════════════════════════════

Date : ${today}

═══════════════════════════════════════════════════════════════════════════════
INFORMATIONS DU DEMANDEUR
═══════════════════════════════════════════════════════════════════════════════

Nom complet       : ${fullName}
Email             : ${email}
Téléphone         : ${phone}
Adresse           : ${address}
Code postal       : ${postalCode}

═══════════════════════════════════════════════════════════════════════════════
SITUATION PERSONNELLE
═══════════════════════════════════════════════════════════════════════════════

Âge               : ${age} ans
Statut            : ${situation}
Situation familiale : ${familyStatus}
Enfants à charge  : ${children}
Revenus annuels   : ${income}
Logement          : ${housingStatus}

═══════════════════════════════════════════════════════════════════════════════
AIDE DEMANDÉE
═══════════════════════════════════════════════════════════════════════════════

Nom de l'aide     : ${aid.name}
Catégorie         : ${this.formatCategory(aid.category)}
Organisme         : ${aid.authority}

Description :
${aid.shortDescription}

═══════════════════════════════════════════════════════════════════════════════
LETTRE DE MOTIVATION
═══════════════════════════════════════════════════════════════════════════════

Madame, Monsieur,

Je soussigné(e) ${fullName}, sollicite par la présente le bénéfice de l'aide 
"${aid.name}" auprès de ${aid.authority}.

Ma situation actuelle :
- Je suis ${situation.toLowerCase()}
- Ma situation familiale : ${familyStatus.toLowerCase()}${children > 0 ? `, avec ${children} enfant(s) à charge` : ''}
- Mes revenus annuels s'élèvent à ${income}
- Je suis ${housingStatus.toLowerCase()}

Cette aide me permettrait de [à compléter selon votre situation].

Je reste à votre disposition pour tout renseignement complémentaire et vous 
prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${fullName}
${email}
${phone !== 'Non renseigné' ? phone : ''}

═══════════════════════════════════════════════════════════════════════════════
PIÈCES À JOINDRE
═══════════════════════════════════════════════════════════════════════════════

${this.formatRequiredDocuments(formData.declaredDocuments)}

═══════════════════════════════════════════════════════════════════════════════
                        Document généré par AidesMax
                    Ce document doit être complété et signé
═══════════════════════════════════════════════════════════════════════════════
`.trim();

    return content;
  }

  /**
   * Formater le statut professionnel pour l'affichage
   */
  private formatProfessionalStatus(status?: string): string {
    const labels: Record<string, string> = {
      ETUDIANT: 'Étudiant(e)',
      SALARIE: 'Salarié(e)',
      INDEPENDANT: 'Travailleur indépendant',
      CHOMEUR: 'Demandeur d\'emploi',
      RETRAITE: 'Retraité(e)',
      INACTIF: 'Sans activité professionnelle',
    };
    return labels[status || ''] || 'Non renseigné';
  }

  /**
   * Formater la situation familiale pour l'affichage
   */
  private formatFamilyStatus(status?: string): string {
    const labels: Record<string, string> = {
      CELIBATAIRE: 'Célibataire',
      EN_COUPLE: 'En couple',
      VEUF: 'Veuf/Veuve',
      DIVORCE: 'Divorcé(e)',
    };
    return labels[status || ''] || 'Non renseignée';
  }

  /**
   * Formater le statut de logement pour l'affichage
   */
  private formatHousingStatus(status?: string): string {
    const labels: Record<string, string> = {
      LOCATAIRE: 'Locataire',
      PROPRIETAIRE: 'Propriétaire',
      HEBERGE_GRATUIT: 'Hébergé(e) à titre gratuit',
      SANS_DOMICILE: 'Sans domicile fixe',
    };
    return labels[status || ''] || 'Non renseigné';
  }

  /**
   * Formater la catégorie d'aide pour l'affichage
   */
  private formatCategory(category: string): string {
    const labels: Record<string, string> = {
      LOGEMENT: 'Logement',
      ENERGIE: 'Énergie',
      ETUDES: 'Études',
      BUSINESS: 'Création d\'entreprise',
      SANTE: 'Santé',
      TRANSPORT: 'Transport',
      FAMILLE: 'Famille',
    };
    return labels[category] || category;
  }

  /**
   * Formater la liste des documents requis
   */
  private formatRequiredDocuments(documents?: string[]): string {
    if (!documents || documents.length === 0) {
      return '□ Aucun document déclaré pour le moment\n  (Consultez les documents requis pour cette aide)';
    }

    return documents
      .map((doc, index) => `□ ${index + 1}. ${doc}`)
      .join('\n');
  }
}
