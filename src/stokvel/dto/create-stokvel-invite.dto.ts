import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateStokvelInviteDto {
  @ApiProperty({ example: "Thabo" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Mokoena" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "thabo@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+27821234567" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[+]?[\d\s()-]{7,17}$/, {
    message: "cellNumber must be a valid phone number"
  })
  cellNumber: string;
}
