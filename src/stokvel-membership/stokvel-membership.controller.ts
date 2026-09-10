import { Controller, Post, Get, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { MemberRole } from "./../../libs/common/src/enums/member-role.enum";
import { Roles } from "./../../libs/common/src/decorators/users.decorator";
import { RolesGuard } from "../../libs/common/src/jwt-auth/guards/roles.guard";
import { JwtAuthGuard } from "../../libs/common/src/jwt-auth/guards/jwt-auth.guard";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { StokvelMembershipService } from "./stokvel-membership.service";
import { StokvelMembershipDto } from "./dto/stokvel-membership.dto";
import { StokvelMembershipResponseDto } from "./dto/stokvel-membership.response.dto";
import { FindMembershipsDto } from "./dto/find-memberships.dto";

@ApiTags("Stokvel Membership")
@Controller("stokvel-membership")
export class StokvelMembershipController {
  constructor(private readonly service: StokvelMembershipService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMINISTRATOR)
  @Post()
  @ApiOperation({
    summary: "Create stokvel membership",
    description: "Creates a new stokvel membership for a user"
  })
  @ApiBody({
    type: StokvelMembershipDto,
    description: "Payload to create a stokvel membership"
  })
  @ApiResponse({
    status: 201,
    description: "Membership created successfully"
  })
  @ApiResponse({
    status: 400,
    description: "Validation error"
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized"
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - requires administrator role"
  })
  async create(@Body() dto: StokvelMembershipDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.USER, SystemRole.ADMIN, MemberRole.ADMINISTRATOR)
  @Get(":stokvelId/user/:userId")
  @ApiOperation({
    summary: "Get membership by user and stokvel"
  })
  @ApiParam({ name: "stokvelId", example: "stk_123" })
  @ApiParam({ name: "userId", example: "user_123" })
  @ApiResponse({
    status: 200,
    description: "Membership found"
  })
  @ApiResponse({
    status: 404,
    description: "Membership not found"
  })
  async findOne(@Param("stokvelId") stokvelId: string, @Param("userId") userId: string) {
    return this.service.findOne({ stokvelId, userId });
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Get all active stokvel memberships for a user"
  })
  @ApiParam({
    name: "userId",
    example: "user_123"
  })
  @ApiResponse({
    status: 200,
    description: "List of memberships",
    type: [StokvelMembershipResponseDto]
  })
  async findByUserId(@Param("userId") userId: string) {
    return this.service.findByUserId(userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get stokvel members (paginated + search)",
    description: "Returns paginated stokvel members with optional search and filtering"
  })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "size", required: false, example: 10 })
  @ApiQuery({
    name: "searchText",
    required: false,
    example: "John"
  })
  @ApiQuery({
    name: "filter",
    required: false,
    example: '{"stokvelId":"stk_123"}',
    description: "JSON string filter"
  })
  @ApiResponse({
    status: 200,
    description: "Paginated list of members"
  })
  async findAll(@Query() query: FindMembershipsDto) {
    const { page = 1, size = 10, searchText, filter } = query;

    return this.service.findAll({
      page,
      size,
      searchText,
      filter
    });
  }
}
