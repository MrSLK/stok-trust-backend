import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto, AuthResponseDto } from "./dto/sign-in.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User successfully registered.",
    type: AuthResponseDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Email already in use." })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate user and return tokens" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login successful.",
    type: AuthResponseDto
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid credentials." })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
