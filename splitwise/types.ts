export enum SplitType {
    EQUAL = 'EQUAL',
    EXACT = 'EXACT',
    PERCENTAGE = 'PERCENTAGE'
}

export function roundUp(amount: number): number {
    return parseFloat(amount.toFixed(2));
}