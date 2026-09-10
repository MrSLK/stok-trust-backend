import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { CredScoreService } from "./cred-score.service";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Roles } from "./../../libs/common/src/decorators/users.decorator";
import { RolesGuard } from "../../libs/common/src/jwt-auth/guards/roles.guard";
import { JwtAuthGuard } from "../../libs/common/src/jwt-auth/guards/jwt-auth.guard";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { CredScoreResponseDto } from "./dto/cred-score.response.dto";

@ApiTags("Credit Score")
@Controller("cred-score")
export class CredScoreController {
  constructor(private readonly credScoreService: CredScoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.USER)
  @Get(":userId")
  @ApiOperation({
    summary: "Get user CredScore",
    description: "Fetches the CredScore record for a specific user, including payment behavior, claims, streaks, and final score."
  })
  @ApiParam({
    name: "userId",
    type: String,
    example: "user_123",
    description: "The unique identifier of the user"
  })
  @ApiResponse({
    status: 200,
    description: "CredScore retrieved successfully",
    type: CredScoreResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "CredScore not found for the given user",
    schema: {
      example: {
        statusCode: 404,
        message: "CredScore not found",
        error: "Not Found"
      }
    }
  })
  getUserScore(@Param("userId") userId: string) {
    return this.credScoreService.getUserScore(userId);
  }
}
