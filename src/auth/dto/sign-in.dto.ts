// auth-dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { UserDto } from "src/users/dto/user.dto";

export class SignInDto {
  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "StrongPass123!" })
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: () => UserDto })
  user: any;

  @ApiProperty({ example: "eyJhbGci..." })
  accessToken: string;

  @ApiProperty({ example: "eyJhbGci..." })
  refreshToken: string;
}
