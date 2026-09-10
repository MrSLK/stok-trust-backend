import { Injectable } from "@nestjs/common";

@Injectable()
export class MonthlyContributionService {
  // When handling payments, if a payment is marked as overdue, remember to call the "await this.credScoreService.handleMissedPayment(userId);"
}
