import { ApiProperty } from "@nestjs/swagger";

export class CredScoreResponseDto {
  @ApiProperty({
    example: "cs_abc123xyz",
    description: "Unique identifier for the CredScore record"
  })
  _id: string;

  @ApiProperty({
    example: "user_123",
    description: "User ID associated with this CredScore"
  })
  userId: string;

  // 📊 Payments
  @ApiProperty({ example: 12 })
  onTimePayments: number;

  @ApiProperty({ example: 2 })
  latePayments: number;

  @ApiProperty({ example: 1 })
  missedPayments: number;

  // ⚖️ Claims
  @ApiProperty({ example: 0 })
  activeClaims: number;

  @ApiProperty({ example: 1 })
  resolvedClaims: number;

  @ApiProperty({ example: 1 })
  withdrawnClaims: number;

  // 📅 Consistency
  @ApiProperty({ example: 10 })
  consistentPeriods: number;

  // 🔥 Streak
  @ApiProperty({ example: 5 })
  currentStreak: number;

  @ApiProperty({ example: 12 })
  longestStreak: number;

  // ⭐ Score
  @ApiProperty({
    example: 87,
    description: "Final calculated CredScore (0–100)"
  })
  credScore: number;

  @ApiProperty({
    example: "2026-04-01T10:00:00.000Z"
  })
  createdAt: Date;

  @ApiProperty({
    example: "2026-04-10T12:00:00.000Z"
  })
  updatedAt: Date;
}
