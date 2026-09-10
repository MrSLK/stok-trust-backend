import { CurrentUser } from "./../../libs/common/src/auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "./../../libs/common/src/interfaces/authenticated-user.interface";
import { RolesGuard } from "../../libs/common/src/jwt-auth/guards/roles.guard";
import { JwtAuthGuard } from "../../libs/common/src/jwt-auth/guards/jwt-auth.guard";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { Response } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiProduces, ApiBody } from "@nestjs/swagger";
import { MemberRole } from "@common/enums/member-role.enum";
import { StokvelService } from "./stokvel.service";
import { StokvelDto } from "./dto/stokvel.dto";
import { Roles } from "./../../libs/common/src/decorators/users.decorator";
import { CreateStokvelPolicyDto } from "./dto/create-stokvel-policy.dto";
import { DownloadConstitutionDto } from "./dto/download-constitution.dto";
import { CreateStokvelInviteDto } from "./dto/create-stokvel-invite.dto";

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.USER, SystemRole.ADMIN)
  @Get(":stokvelId/generate-constitution-pdf")
  @ApiOperation({
    summary: "Download a stokvel constitution as PDF",
    description:
      "Generates and downloads the constitution document for a stokvel. " +
      "Returns the active version by default, or a specific version when the `version` query param is provided."
  })
  @ApiParam({
    name: "stokvelId",
    description: "ID of the stokvel whose constitution should be downloaded",
    example: "STV-2026-0001"
  })
  @ApiProduces("application/pdf")
  @ApiResponse({
    status: 200,
    description: "Constitution PDF file stream",
    content: {
      "application/pdf": {
        schema: { type: "string", format: "binary" }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "No constitution (or requested version) found for this stokvel"
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async downloadConstitution(@Param("stokvelId") stokvelId: string, @Query() query: DownloadConstitutionDto, @Res() res: Response) {
    return this.stokvelService.generateConstitutionPdf(stokvelId, query.version, res);
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

  @Post("/create-constitution")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMINISTRATOR)
  @ApiOperation({
    summary: "Create stokvel policy",
    description:
      "Creates a new stokvel policy version for a stokvel. If an active policy already exists, it becomes inactive and a new version is created."
  })
  @ApiParam({
    name: "stokvelId",
    type: String,
    example: "stokvel_123",
    description: "Unique identifier of the stokvel"
  })
  @ApiBody({
    type: CreateStokvelPolicyDto,
    description: "Payload used to create a stokvel constitution/policy"
  })
  @ApiResponse({
    status: 201,
    description: "Stokvel policy created successfully",
    schema: {
      example: {
        _id: "policy_123",
        stokvelId: "stokvel_123",
        purpose: "To encourage disciplined saving among members",
        membershipRules: "1. Members must respect each other. 2. Members must attend meetings.",
        contributionRules: "1. Monthly payment is R500. 2. Late payments incur penalties.",
        payoutRules: "1. Payouts are processed monthly after contributions are confirmed.",
        meetingRules: "1. Meetings occur every first Saturday of the month.",
        disputeRules: "1. Disputes must be submitted formally within 7 days.",
        constitutionAmendmentRules: "1. Amendments require 75% member approval.",
        createdBy: "user_123",
        version: 1,
        isActive: true,
        createdAt: "2026-04-11T10:00:00.000Z",
        updatedAt: "2026-04-11T10:00:00.000Z"
      }
    }
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
  async createpolicy(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStokvelPolicyDto) {
    return this.stokvelService.createpolicy(user._id, dto);
  }

  @Get("/constitution/:stokvelId/active")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get active stokvel policy",
    description: "Returns the currently active policy/constitution for a stokvel"
  })
  @ApiParam({
    name: "stokvelId",
    type: String,
    example: "stokvel_123",
    description: "Unique identifier of the stokvel"
  })
  @ApiResponse({
    status: 200,
    description: "Active stokvel policy retrieved successfully",
    schema: {
      example: {
        _id: "policy_123",
        stokvelId: "stokvel_123",
        purpose: "To encourage disciplined saving among members",
        membershipRules: "1. Members must respect each other.",
        contributionRules: "1. Monthly contribution is R500.",
        payoutRules: "1. Payouts are processed at month-end.",
        meetingRules: "1. Meetings occur monthly.",
        disputeRules: "1. Disputes must be raised formally.",
        constitutionAmendmentRules: "1. Amendments require voting approval.",
        version: 2,
        isActive: true
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "Active stokvel policy not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Active stokvel policy not found",
        error: "Not Found"
      }
    }
  })
  async findActivePolicy(@Param("stokvelId") stokvelId: string) {
    return this.stokvelService.findActivePolicy(stokvelId);
  }

  @Get("/constitution/:stokvelId/history")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get stokvel policy history",
    description: "Returns all historical versions of a stokvel's policies/constitution"
  })
  @ApiParam({
    name: "stokvelId",
    type: String,
    example: "stokvel_123",
    description: "Unique identifier of the stokvel"
  })
  @ApiResponse({
    status: 200,
    description: "Policy history retrieved successfully",
    schema: {
      example: [
        {
          _id: "policy_002",
          version: 2,
          isActive: true
        },
        {
          _id: "policy_001",
          version: 1,
          isActive: false
        }
      ]
    }
  })
  async findPolicyHistory(@Param("stokvelId") stokvelId: string) {
    return this.stokvelService.findPolicyHistory(stokvelId);
  }

  @Get("/constitution/:stokvelId/version/:version")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get specific policy version",
    description: "Returns a specific version of a stokvel policy"
  })
  @ApiParam({
    name: "stokvelId",
    type: String,
    example: "stokvel_123",
    description: "Unique identifier of the stokvel"
  })
  @ApiParam({
    name: "version",
    type: Number,
    example: 2,
    description: "Policy version number"
  })
  @ApiResponse({
    status: 200,
    description: "Policy version retrieved successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Policy version not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Policy version not found",
        error: "Not Found"
      }
    }
  })
  async findPolicyVersion(@Param("stokvelId") stokvelId: string, @Param("version", ParseIntPipe) version: number) {
    return this.stokvelService.findPolicyVersion(stokvelId, version);
  }

  @Post("/:stokvelId/invites")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Invite someone to join a stokvel",
    description: "Creates a stokvel-invite record and emails the invitee a link + invite code."
  })
  @ApiParam({ name: "stokvelId", example: "STV-2026-0001" })
  @ApiResponse({ status: 201, description: "Invite created and email sent" })
  @ApiResponse({ status: 400, description: "Invite already pending for this email" })
  @ApiResponse({ status: 404, description: "Stokvel not found" })
  // @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createInvite(@Param("stokvelId") stokvelId: string, @Body() dto: CreateStokvelInviteDto, @Req() req: any) {
    const invitedBy = req.user?.userId ?? req.user?._id ?? req.user?.sub;
    return this.stokvelService.createInvite(stokvelId, dto, invitedBy);
  }
}
