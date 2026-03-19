import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsEmail, ValidateNested, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";

class ServicesDto {
  @ApiProperty({ example: "StrongPassword123!" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

class ProfileDto {
  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+27123456789" })
  @IsString()
  @IsNotEmpty()
  cellNumber: string;

  @ApiProperty({ example: "9001015000081", required: false })
  @IsString()
  @IsOptional()
  idNumber: string;

  @ApiProperty({ example: "A01234567", required: false })
  @IsString()
  @IsOptional()
  passportNumber: string;
}

class VerificationsDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  email: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  cellNumber: boolean;
}

export class UserDto {
  @ApiProperty({ type: ServicesDto })
  @ValidateNested()
  @Type(() => ServicesDto)
  services: ServicesDto;

  @ApiProperty({ type: ProfileDto })
  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @ApiProperty({ type: VerificationsDto })
  @ValidateNested()
  @Type(() => VerificationsDto)
  verifications: VerificationsDto;

  @ApiProperty({ enum: ["admin", "user"], example: "user" })
  @IsEnum(["admin", "user"])
  role: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isAccountActive: boolean;
}
