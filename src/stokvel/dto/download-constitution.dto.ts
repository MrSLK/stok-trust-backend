import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class DownloadConstitutionDto {
  @ApiPropertyOptional({
    description: "Constitution version to download. Omit to get the active (latest) version.",
    example: 1,
    minimum: 1,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  version?: number;
}
