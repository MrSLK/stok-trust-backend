import { CurrentUser } from "./../../libs/common/src/auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "./../../libs/common/src/interfaces/authenticated-user.interface";
import { RolesGuard } from "../../libs/common/src/jwt-auth/guards/roles.guard";
import { JwtAuthGuard } from "../../libs/common/src/jwt-auth/guards/jwt-auth.guard";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger";
import { StokvelService } from "./stokvel.service";
import { StokvelDto } from "./dto/stokvel.dto";
import { Roles } from "./../../libs/common/src/decorators/users.decorator";

@ApiTags("Stokvels")
@Controller("stokvels")
export class StokvelController {
  constructor(private readonly stokvelService: StokvelService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.USER)
  @Post()
  @ApiOperation({ summary: "Create a new stokvel" })
  @ApiBody({ type: StokvelDto })
  @ApiResponse({ status: 201, description: "Stokvel created successfully" })
  async create(@Body() dto: StokvelDto, @Req() req: { user?: { _id: string } }) {
    return this.stokvelService.create(dto, req?.user?._id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.USER, SystemRole.ADMIN)
  @Get()
  @ApiOperation({ summary: "Get all stokvels with pagination and search" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: "size",
    required: false,
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: "searchText",
    required: false,
    type: String,
    example: "community"
  })
  @ApiResponse({
    status: 200,
    description: "Paginated list of stokvels"
  })
  async findAll(
    @Query("page") page = 1,
    @Query("size") size = 10,
    @Query("searchText") searchText = "",
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.stokvelService.findAll(Number(page), Number(size), searchText, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a stokvel by ID" })
  @ApiParam({
    name: "id",
    type: String,
    description: "Stokvel ID",
    example: "stk123456"
  })
  @ApiResponse({ status: 200, description: "Stokvel found" })
  @ApiResponse({ status: 404, description: "Stokvel not found" })
  async findOne(@Param("id") id: string) {
    return this.stokvelService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a stokvel" })
  @ApiParam({
    name: "id",
    type: String,
    description: "Stokvel ID"
  })
  @ApiBody({
    type: StokvelDto,
    description: "Fields to update (partial allowed)"
  })
  @ApiResponse({ status: 200, description: "Stokvel updated successfully" })
  async update(@Param("id") id: string, @Body() dto: Partial<StokvelDto>) {
    return this.stokvelService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a stokvel" })
  @ApiParam({
    name: "id",
    type: String,
    description: "Stokvel ID"
  })
  @ApiResponse({ status: 200, description: "Stokvel deleted successfully" })
  async remove(@Param("id") id: string) {
    return this.stokvelService.remove(id);
  }
}
