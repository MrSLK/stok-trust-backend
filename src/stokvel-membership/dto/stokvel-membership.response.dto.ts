import { ApiProperty } from "@nestjs/swagger";

class UserProfileDto {
  @ApiProperty({ example: "John" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  lastName: string;

  @ApiProperty({ example: "0812345678" })
  cellNumber: string;

  @ApiProperty({ example: "john@example.com" })
  email: string;
}

export class StokvelMembershipResponseDto {
  @ApiProperty({ example: "stk_123" })
  stokvelId: string;

  @ApiProperty({ example: "user_123" })
  userId: string;

  @ApiProperty({ example: "ADMIN" })
  role: string;

  @ApiProperty({ type: UserProfileDto })
  userDetails: {
    profile: UserProfileDto;
  };
}
