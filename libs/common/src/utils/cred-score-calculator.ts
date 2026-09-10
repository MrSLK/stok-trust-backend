import { CredScoreStats } from "../interfaces/cred-score.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CredScoreCalculator {
  calculateCredScore(stats: CredScoreStats): number {
    let score = 100;

    // 📊 Payment behavior
    score += stats.onTimePayments * 2;
    score -= stats.latePayments * 4;
    score -= stats.missedPayments * 12;

    // ⚖️ Claims
    score -= stats.activeClaims * 7;
    score -= stats.resolvedClaims * 5;
    score += stats.withdrawnClaims * 5;

    // 📅 Consistency
    score += stats.consistentPeriods * 3;

    // 🔥 Streak bonus
    score += stats.currentStreak * 1;

    return Math.max(0, Math.min(100, score));
  }
}
