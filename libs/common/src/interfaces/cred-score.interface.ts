export interface CredScoreStats {
  onTimePayments: number;
  latePayments: number;
  missedPayments: number;

  activeClaims: number;
  resolvedClaims: number;
  withdrawnClaims: number;

  consistentPeriods: number;
  currentStreak: number;
}
