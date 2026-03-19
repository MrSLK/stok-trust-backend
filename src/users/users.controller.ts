import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { UserQueryDto } from "./dto/user-query.dto";

@ApiTags("users") // Groups these endpoints in the UI
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully." })
  create(@Body() userDto: UserDto) {
    return this.usersService.create(userDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve all users with pagination and search" })
  @ApiResponse({ status: 200, description: "List of users with metadata." })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single user by ID or email" })
  @ApiParam({ name: "id", description: "The unique custom string ID or email of the user" })
  @ApiResponse({ status: 200, description: "User found." })
  @ApiResponse({ status: 404, description: "User not found." })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", description: "The ID of the user to update" })
  @ApiResponse({ status: 200, description: "User updated successfully." })
  update(@Param("id") id: string, @Body() userDto: UserDto) {
    return this.usersService.update(id, userDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deactivate a user account (Soft Delete)" })
  @ApiParam({ name: "id", description: "The ID of the user to deactivate" })
  @ApiResponse({ status: 200, description: "User account marked as inactive." })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
