import { IsString, IsNumber, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StokvelDto {
  @ApiProperty({
    example: "Benoni Savings Group",
    description: "Name of the stokvel"
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Savings",
    description: "Type of stokvel (e.g. Savings, Burial, Investment)"
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: "A community-based savings group",
    description: "Description of the stokvel"
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: "Benoni, Gauteng",
    description: "Location of the stokvel"
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 500,
    description: "Monthly contribution amount per member"
  })
  @IsNumber()
  monthlyContribution: number;

  @ApiPropertyOptional({
    example: "NASASA-123456",
    description: "NASASA registration number (if registered)",
    nullable: true
  })
  @IsOptional()
  @IsString()
  nasasaRegistrationNumber?: string | null;
}
