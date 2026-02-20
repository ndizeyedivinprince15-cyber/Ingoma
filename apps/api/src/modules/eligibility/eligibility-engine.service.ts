import { Injectable, Logger } from '@nestjs/common';
import {
  ProfileData,
  Aid,
  AidSummary,
  AidEligibilityResult,
  CriterionResult,
  EligibilityRules,
  EligibilityRuleGroup,
  EligibilityCondition,
  EstimationRules,
  ConditionOperator,
  ConditionValue,
} from '@aidesmax/shared';

@Injectable()
export class EligibilityEngineService {
  private readonly logger = new Logger(EligibilityEngineService.name);

  evaluateAidForProfile(profile: ProfileData, aid: Aid): AidEligibilityResult {
    // 1. Parsing sécurisé des règles
    let rules: EligibilityRuleGroup;
    try {
      rules = typeof aid.eligibilityRules === 'string' 
        ? JSON.parse(aid.eligibilityRules) 
        : aid.eligibilityRules;
    } catch (e) {
      rules = { logic: 'AND', conditions: [] };
    }

    // 2. Parsing estimation
    let estimationRules: EstimationRules | null = null;
    try {
      if (aid.estimationRules) {
        estimationRules = typeof aid.estimationRules === 'string'
          ? JSON.parse(aid.estimationRules)
          : aid.estimationRules;
      }
    } catch (e) {
      // Ignorer erreur
    }

    const criteriaResults: CriterionResult[] = [];

    // 3. Évaluation
    let isEligible = true;
    
    // Vérification défensive : rules doit être un objet valide avec conditions
    if (rules && typeof rules === 'object' && Array.isArray(rules.conditions) && rules.conditions.length > 0) {
      isEligible = this.evaluateRuleGroup(rules, profile, criteriaResults);
    }

    const probabilityScore = isEligible ? 1.0 : 0.0;

    const { estimatedAmountMin, estimatedAmountMax } = this.calculateEstimation(
      estimationRules,
      profile,
      isEligible,
    );

    const explanation = this.generateExplanation(
      isEligible,
      criteriaResults,
      aid.name,
    );

    const aidSummary: AidSummary = {
      id: aid.id,
      name: aid.name,
      slug: aid.slug,
      category: aid.category as any,
      shortDescription: aid.shortDescription,
      authority: aid.authority,
      geographicScope: aid.geographicScope as any,
      isActive: aid.isActive,
    };

    return {
      aidId: aid.id,
      aid: aidSummary,
      isEligible,
      probabilityScore,
      estimatedAmountMin,
      estimatedAmountMax,
      criteriaResults,
      explanation,
    };
  }

  private evaluateRuleGroup(
    group: EligibilityRuleGroup,
    profile: ProfileData,
    collectedCriteria: CriterionResult[],
  ): boolean {
    if (!group || !Array.isArray(group.conditions)) {
      return true;
    }

    const results: boolean[] = [];

    for (const item of group.conditions) {
      if (this.isRuleGroup(item)) {
        const subResult = this.evaluateRuleGroup(
          item,
          profile,
          collectedCriteria,
        );
        results.push(subResult);
      } else {
        const conditionResult = this.evaluateCondition(item, profile);
        collectedCriteria.push(conditionResult);
        results.push(conditionResult.passed);
      }
    }

    if (group.logic === 'AND') {
      return results.every((r) => r === true);
    } else {
      return results.some((r) => r === true);
    }
  }

  private isRuleGroup(item: any): item is EligibilityRuleGroup {
    return item && typeof item === 'object' && 'logic' in item && 'conditions' in item;
  }

  private evaluateCondition(
    condition: EligibilityCondition,
    profile: ProfileData,
  ): CriterionResult {
    const { field, operator, value, successMessage, failureMessage } = condition;
    const actualValue = this.getProfileValue(profile, field as string);
    const passed = this.evaluateOperator(operator, actualValue, value);

    const message = passed 
      ? (successMessage || `Critère ${field} validé`)
      : (failureMessage || `Critère ${field} non rempli`);

    return {
      criterion: `${field} ${operator} ${value}`,
      passed,
      message,
      field: field as string,
      expected: value,
      actual: actualValue,
    };
  }

  private getProfileValue(profile: ProfileData, field: string): ConditionValue {
    const value = (profile as any)[field];
    return value === undefined || value === null ? null : value;
  }

  private evaluateOperator(
    operator: string,
    actual: any,
    expected: any,
  ): boolean {
    if (actual === null) {
        return operator === 'notExists';
    }

    // Comparaisons souples (==) pour gérer string vs number venant du JSON
    switch (operator) {
      case '==': return actual == expected;
      case '!=': return actual != expected;
      case '>': return Number(actual) > Number(expected);
      case '>=': return Number(actual) >= Number(expected);
      case '<': return Number(actual) < Number(expected);
      case '<=': return Number(actual) <= Number(expected);
      case 'in': return Array.isArray(expected) && expected.includes(actual);
      case 'notIn': return Array.isArray(expected) && !expected.includes(actual);
      case 'exists': return actual !== null;
      case 'notExists': return actual === null;
      default: return false;
    }
  }

  private calculateEstimation(
    rules: any,
    profile: ProfileData,
    isEligible: boolean,
  ): { estimatedAmountMin: number | null; estimatedAmountMax: number | null } {
    if (!rules || !isEligible) {
      return { estimatedAmountMin: null, estimatedAmountMax: null };
    }

    if (rules.type === 'fixed') {
      return { estimatedAmountMin: rules.amount, estimatedAmountMax: rules.amount };
    }
    
    if (rules.type === 'range') {
        return { estimatedAmountMin: rules.min, estimatedAmountMax: rules.max };
    }

    if (rules.type === 'formula') {
        let amount = rules.baseAmount || 0;
        return { estimatedAmountMin: amount, estimatedAmountMax: amount };
    }

    return { estimatedAmountMin: null, estimatedAmountMax: null };
  }

  private generateExplanation(
    isEligible: boolean,
    criteriaResults: CriterionResult[],
    aidName: string,
  ): string {
    if (isEligible) return `Vous êtes éligible à ${aidName}.`;
    return `Vous n'êtes pas éligible à ${aidName}.`;
  }
}
