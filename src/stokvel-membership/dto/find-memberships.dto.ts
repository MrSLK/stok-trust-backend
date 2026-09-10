import { ApiPropertyOptional } from "@nestjs/swagger";

export class FindMembershipsDto {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  size?: number;

  @ApiPropertyOptional({
    example: "John Doe",
    description: "Search by name, email, phone or ID"
  })
  searchText?: string;

  @ApiPropertyOptional({
    example: { stokvelId: "stk_123" },
    description: "Filter object"
  })
  filter?: Record<string, any>;
}
