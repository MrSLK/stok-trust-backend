import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, Matches, MaxLength } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: "John", description: "The first name of the user" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe", description: "The last name of the user" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "john.doe@example.com", description: "Unique email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+27123456789", description: "Mobile contact number" })
  @IsString()
  @IsNotEmpty()
  cellNumber: string;

  @ApiProperty({
    example: "StrongP@ss123",
    description: "8-12 chars, min 1 number, 1 special char, no spaces",
    minLength: 8,
    maxLength: 12
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(12, { message: "Password cannot exceed 12 characters" })
  @Matches(/^\S*$/, {
    message: "Password must not contain spaces"
  })
  @Matches(/(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: "Password must contain at least 1 number and 1 special character"
  })
  password: string;

  @ApiProperty({
    enum: ["admin", "user"],
    default: "user",
    description: "The role assigned to the user"
  })
  @IsEnum(["admin", "user"])
  role: string;
}
