import { MemberRole } from "./../../../libs/common/src/enums/member-role.enum";
import { IsString, IsEnum, IsOptional, IsBoolean, IsDate } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StokvelMembershipDto {
  @ApiProperty({
    example: "user_123",
    description: "Unique identifier of the user being added to the stokvel"
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: "stokvel_123",
    description: "Unique identifier of the stokvel"
  })
  @IsString()
  stokvelId: string;

  @ApiPropertyOptional({
    enum: MemberRole,
    example: MemberRole.MEMBER,
    description: "Role of the user within the stokvel"
  })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @ApiPropertyOptional({
    example: true,
    description: "Indicates whether the membership is active",
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: "2026-04-11T10:00:00.000Z",
    description: "ISO date string representing when the user joined the stokvel"
  })
  @IsOptional()
  @IsDate()
  joinedAt?: Date;
}
