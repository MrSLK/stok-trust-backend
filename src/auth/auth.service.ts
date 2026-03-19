import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findOne(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException("Email already in use");
    }
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(signUpDto.password, salt);
    const userPayload = {
      profile: {
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        email: signUpDto.email,
        cellNumber: signUpDto.cellNumber,
        idNumber: null,
        passportNumber: null
      },
      services: {
        password: hashedPassword
      },
      verifications: {
        email: false,
        cellNumber: false
      },
      isAccountActive: true,
      role: signUpDto.role
    };
    const user = await this.usersService.create(userPayload);
    const { accessToken, refreshToken } = await this.generateTokens(user.profile);
    return { user, accessToken, refreshToken };
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.services.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials");
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.profile);
    return { user, accessToken, refreshToken };
  }

  // -------- Helpers ---------
  private async generateTokens(user: {
    firstName: string;
    lastName: string;
    email: string;
    cellNumber: string;
    idNumber?: string | null;
    passportNumber?: string | null;
  }) {
    const accessToken = await this.jwtService.signAsync(
      { user },
      {
        expiresIn: "48h",
        secret: this.configService.get("jwt.jwtSecret")
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      { user },
      {
        expiresIn: "24h",
        secret: this.configService.get("jwt.jwtSecret")
      }
    );

    return { accessToken, refreshToken };
  }
}
