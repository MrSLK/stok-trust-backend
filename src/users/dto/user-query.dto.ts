import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class UserQueryDto {
  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Items per page", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  limit?: number;

  @ApiPropertyOptional({ description: "Search across ID, name, cell, and emails" })
  @IsOptional()
  @IsString()
  searchText?: string;

  // Note: Complex objects like 'filter' are best handled via JSON strings
  // or specific key-value pairs in Swagger.
}
