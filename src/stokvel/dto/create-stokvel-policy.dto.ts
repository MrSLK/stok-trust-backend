import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStokvelPolicyDto {
  @ApiProperty()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsString()
  membershipRules: string;

  @ApiProperty()
  @IsString()
  contributionRules: string;

  @ApiProperty()
  @IsString()
  payoutRules: string;

  @ApiProperty()
  @IsString()
  meetingRules: string;

  @ApiProperty()
  @IsString()
  disputeRules: string;

  @ApiProperty()
  @IsString()
  constitutionAmendmentRules: string;

  @ApiProperty()
  @IsString()
  stokvelId: string;
}
