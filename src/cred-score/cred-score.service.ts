import { Injectable, NotFoundException } from "@nestjs/common";
import { CredScoreRepository } from "./cred-score.repository";
import { CredScoreCalculator } from "./../../libs/common/src/utils/cred-score-calculator";
import { CredScoreDocument } from "./../../libs/common/src/database/schemas/cred-score.schema";

@Injectable()
export class CredScoreService {
  constructor(
    private readonly credScoreRepository: CredScoreRepository,
    private readonly credScoreCalculator: CredScoreCalculator
  ) {}

  // 🔹 Ensure record exists
  async getOrCreate(userId: string) {
    let record = await this.credScoreRepository.findOne({ userId });

    if (!record) {
      record = await this.credScoreRepository.create({ userId });
    }

    return record;
  }

  private async recalculate(record: CredScoreDocument) {
    record.credScore = this.credScoreCalculator.calculateCredScore(record);
    await record.save();
  }

  async handleOnTimePayment(userId: string) {
    const r = await this.getOrCreate(userId);

    r.onTimePayments++;
    r.currentStreak++;
    r.longestStreak = Math.max(r.longestStreak, r.currentStreak);

    await this.recalculate(r);
  }

  async handleLatePayment(userId: string) {
    const r = await this.getOrCreate(userId);

    r.latePayments++;
    r.currentStreak = 0;

    await this.recalculate(r);
  }

  async handleMissedPayment(userId: string) {
    const r = await this.getOrCreate(userId);

    r.missedPayments++;
    r.currentStreak = 0;

    await this.recalculate(r);
  }

  async handlePeriodEvaluated(userId: string, wasConsistent: boolean) {
    const r = await this.getOrCreate(userId);

    if (wasConsistent) {
      r.consistentPeriods++;
    }

    await this.recalculate(r);
  }

  async handleClaimCreated(userId: string) {
    const r = await this.getOrCreate(userId);

    r.activeClaims++;
    await this.recalculate(r);
  }

  async handleClaimResolved(userId: string) {
    const r = await this.getOrCreate(userId);

    if (r.activeClaims > 0) r.activeClaims--;
    r.resolvedClaims++;

    await this.recalculate(r);
  }

  async handleClaimWithdrawn(userId: string) {
    const r = await this.getOrCreate(userId);

    if (r.activeClaims > 0) r.activeClaims--;
    r.withdrawnClaims++;

    await this.recalculate(r);
  }

  async getUserScore(userId: string) {
    const record = await this.credScoreRepository.findOne({ userId });

    if (!record) throw new NotFoundException("CredScore not found");

    return record;
  }
}
