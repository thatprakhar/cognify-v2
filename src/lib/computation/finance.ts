/**
 * Financial Computation Engine
 * Contains deterministic math logic for capability modules.
 * Can be used server-side (pipeline orchestration) or client-side (interactive modules).
 */

export function computeCompoundGrowth(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number,
): { year: number; contributions: number; interest: number; total: number }[] {
    const data = [];
    let total = principal;
    let totalContributions = principal;

    for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) {
            total = total * (1 + annualRate / 12) + monthlyContribution;
            totalContributions += monthlyContribution;
        }
        data.push({
            year: y,
            contributions: Math.round(totalContributions),
            interest: Math.round(total - totalContributions),
            total: Math.round(total),
        });
    }
    return data;
}

export function computeSavingsProjection(
    monthlySavings: number,
    annualRate: number,
    years: number,
): { year: number; saved: number; withInterest: number }[] {
    const data = [];
    let withInterest = 0;

    for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) {
            withInterest = (withInterest + monthlySavings) * (1 + annualRate / 12);
        }
        data.push({
            year: y,
            saved: monthlySavings * 12 * y,
            withInterest: Math.round(withInterest),
        });
    }
    return data;
}
