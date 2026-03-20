import { MemberRole } from "./../../../libs/common/src/enums/member-role.enum";
import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from "class-validator";

export class StokvelMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  stokvelId: string;

  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  joinedAt?: Date;
}
