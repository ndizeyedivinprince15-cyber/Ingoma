import { ProfileData } from './profile';
import { AidSummary } from './aid';
/**
 * Opérateurs supportés pour les conditions d'éligibilité
 */
export declare const ConditionOperator: {
    readonly EQUALS: "==";
    readonly NOT_EQUALS: "!=";
    readonly GREATER_THAN: ">";
    readonly GREATER_THAN_OR_EQUALS: ">=";
    readonly LESS_THAN: "<";
    readonly LESS_THAN_OR_EQUALS: "<=";
    readonly IN: "in";
    readonly NOT_IN: "notIn";
    readonly EXISTS: "exists";
    readonly NOT_EXISTS: "notExists";
};
export type ConditionOperator = (typeof ConditionOperator)[keyof typeof ConditionOperator];
/**
 * Champs du profil utilisables dans les conditions
 * Correspond aux champs de ProfileData
 */
export type EligibilityField = keyof ProfileData;
/**
 * Valeur possible pour une condition
 */
export type ConditionValue = string | number | boolean | string[] | number[];
/**
 * Condition d'éligibilité simple
 */
export interface EligibilityCondition {
    field: EligibilityField;
    operator: ConditionOperator;
    value: ConditionValue;
    /** Message explicatif affiché si la condition échoue */
    failureMessage?: string;
    /** Message explicatif affiché si la condition réussit */
    successMessage?: string;
}
/**
 * Logique de combinaison des conditions
 */
export type RuleLogic = 'AND' | 'OR';
/**
 * Groupe de règles (récursif, permet l'imbrication)
 */
export interface EligibilityRuleGroup {
    logic: RuleLogic;
    conditions: (EligibilityCondition | EligibilityRuleGroup)[];
}
/**
 * Règles d'éligibilité complètes d'une aide
 */
export type EligibilityRules = EligibilityRuleGroup;
/**
 * Estimation à montant fixe
 */
export interface FixedEstimation {
    type: 'fixed';
    amount: number;
    description?: string;
}
/**
 * Estimation sous forme de fourchette
 */
export interface RangeEstimation {
    type: 'range';
    min: number;
    max: number;
    description?: string;
}
/**
 * Estimation calculée par formule
 */
export interface FormulaEstimation {
    type: 'formula';
    /** Montant de base */
    baseAmount: number;
    /** Bonus par enfant à charge */
    perChildBonus?: number;
    /** Montant maximum (plafond) */
    maxAmount?: number;
    /** Montant minimum (plancher) */
    minAmount?: number;
    /** Réduction basée sur les revenus */
    incomeModifier?: {
        /** Seuil de revenus */
        threshold: number;
        /** Pourcentage de réduction au-delà du seuil (0-100) */
        reductionPercent: number;
    };
    description?: string;
}
/**
 * Règles d'estimation (union des types possibles)
 */
export type EstimationRules = FixedEstimation | RangeEstimation | FormulaEstimation;
/**
 * Résultat de l'évaluation d'une condition
 */
export interface CriterionResult {
    /** Description de la condition */
    criterion: string;
    /** La condition est-elle satisfaite ? */
    passed: boolean;
    /** Message explicatif */
    message: string;
    /** Champ concerné */
    field: string;
    /** Valeur attendue */
    expected: ConditionValue;
    /** Valeur réelle du profil */
    actual: ConditionValue;
}
/**
 * Résultat d'éligibilité pour une aide
 */
export interface AidEligibilityResult {
    /** ID de l'aide */
    aidId: string;
    /** Informations de base de l'aide */
    aid: AidSummary;
    /** L'utilisateur est-il éligible ? */
    isEligible: boolean;
    /** Score de probabilité (0.0 à 1.0) */
    probabilityScore: number;
    /** Montant minimum estimé (en euros) */
    estimatedAmountMin: number | null;
    /** Montant maximum estimé (en euros) */
    estimatedAmountMax: number | null;
    /** Détail des critères évalués */
    criteriaResults: CriterionResult[];
    /** Message explicatif global */
    explanation: string;
}
/**
 * Résultat d'éligibilité stocké en base (avec métadonnées)
 */
export interface StoredEligibilityResult extends AidEligibilityResult {
    id: string;
    userProfileId: string;
    evaluatedAt: string;
}
/**
 * Requête d'évaluation d'éligibilité
 * Deux modes : anonyme (profileData) ou connecté (profileId ou implicite)
 */
export interface EvaluateEligibilityDto {
    /**
     * Données du profil pour évaluation directe (mode anonyme ou recalcul)
     * Si fourni, prend la priorité sur profileId
     */
    profileData?: ProfileData;
    /**
     * ID d'un profil existant en base (mode connecté)
     * Ignoré si profileData est fourni
     */
    profileId?: string;
    /**
     * Filtrer par catégorie d'aide (optionnel)
     */
    category?: string;
    /**
     * Filtrer par IDs d'aides spécifiques (optionnel)
     */
    aidIds?: string[];
    /**
     * Si true et utilisateur connecté avec profil, persiste les résultats
     * Défaut: true pour les utilisateurs connectés
     */
    persistResults?: boolean;
}
/**
 * Réponse de l'évaluation d'éligibilité
 */
export interface EligibilityEvaluationResponse {
    /** Résultats par aide */
    results: AidEligibilityResult[];
    /** Nombre total d'aides évaluées */
    totalAidsEvaluated: number;
    /** Nombre d'aides éligibles */
    eligibleCount: number;
    /** Date de l'évaluation */
    evaluatedAt: string;
    /** Les résultats ont-ils été persistés ? */
    persisted: boolean;
    /** ID du profil utilisé (si mode connecté) */
    profileId?: string;
}
//# sourceMappingURL=eligibility.d.ts.map