"use strict";
// packages/shared/src/constants/enums.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DossierStatus = exports.GeographicScope = exports.AidCategory = exports.HousingStatus = exports.HousingType = exports.FamilyStatus = exports.ProfessionalStatus = exports.UserRole = void 0;
/**
 * Rôles utilisateur
 */
exports.UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN',
};
/**
 * Statut professionnel
 */
exports.ProfessionalStatus = {
    ETUDIANT: 'ETUDIANT',
    SALARIE: 'SALARIE',
    INDEPENDANT: 'INDEPENDANT',
    CHOMEUR: 'CHOMEUR',
    RETRAITE: 'RETRAITE',
    INACTIF: 'INACTIF',
};
/**
 * Situation familiale
 */
exports.FamilyStatus = {
    CELIBATAIRE: 'CELIBATAIRE',
    EN_COUPLE: 'EN_COUPLE',
    VEUF: 'VEUF',
    DIVORCE: 'DIVORCE',
};
/**
 * Type de logement
 */
exports.HousingType = {
    APPARTEMENT: 'APPARTEMENT',
    MAISON: 'MAISON',
    AUTRE: 'AUTRE',
};
/**
 * Statut d'occupation du logement
 */
exports.HousingStatus = {
    LOCATAIRE: 'LOCATAIRE',
    PROPRIETAIRE: 'PROPRIETAIRE',
    HEBERGE_GRATUIT: 'HEBERGE_GRATUIT',
    SANS_DOMICILE: 'SANS_DOMICILE',
};
/**
 * Catégorie d'aide
 */
exports.AidCategory = {
    LOGEMENT: 'LOGEMENT',
    ENERGIE: 'ENERGIE',
    ETUDES: 'ETUDES',
    BUSINESS: 'BUSINESS',
    SANTE: 'SANTE',
    TRANSPORT: 'TRANSPORT',
    FAMILLE: 'FAMILLE',
};
/**
 * Portée géographique
 */
exports.GeographicScope = {
    NATIONAL: 'NATIONAL',
    REGIONAL: 'REGIONAL',
    DEPARTEMENTAL: 'DEPARTEMENTAL',
    COMMUNAL: 'COMMUNAL',
};
/**
 * Statut de dossier
 */
exports.DossierStatus = {
    BROUILLON: 'BROUILLON',
    PRET: 'PRET',
    SOUMIS: 'SOUMIS',
    EN_COURS: 'EN_COURS',
    ACCEPTE: 'ACCEPTE',
    REFUSE: 'REFUSE',
    ANNULE: 'ANNULE',
};
//# sourceMappingURL=enums.js.map