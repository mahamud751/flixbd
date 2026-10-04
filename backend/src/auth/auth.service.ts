import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AdminLoginDto, LoginDto, RegisterDto } from "./dto/auth.dto";
import { JwtPayload, publicUserSelect } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing)
      throw new ConflictException("An account with this email already exists.");

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash: await bcrypt.hash(dto.password, 10),
        lastLoginAt: new Date(),
      },
      select: publicUserSelect,
    });
    return { token: await this.sign(user.id, user.email, "customer"), user };
  }

  async login(dto: LoginDto) {
    const found = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!found || !(await bcrypt.compare(dto.password, found.passwordHash)))
      throw new UnauthorizedException("Wrong email or password.");
    if (!found.isActive)
      throw new UnauthorizedException("This account has been disabled.");

    const user = await this.prisma.user.update({
      where: { id: found.id },
      data: { lastLoginAt: new Date() },
      select: publicUserSelect,
    });
    return { token: await this.sign(user.id, user.email, "customer"), user };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException("Account not found or disabled.");
    return user;
  }

  /** Static admin: credentials come from ADMIN_EMAIL / ADMIN_PASSWORD. */
  async adminLogin(dto: AdminLoginDto) {
    const email = this.config
      .getOrThrow<string>("ADMIN_EMAIL")
      .trim()
      .toLowerCase();
    const password = this.config.getOrThrow<string>("ADMIN_PASSWORD");
    if (!(safeEqual(dto.email, email) && safeEqual(dto.password, password)))
      throw new UnauthorizedException("Wrong admin email or password.");

    return {
      token: await this.sign("admin", email, "admin"),
      admin: { email, role: "admin" as const },
    };
  }

  private sign(sub: string, email: string, role: JwtPayload["role"]) {
    return this.jwt.signAsync({ sub, email, role } satisfies JwtPayload);
  }
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
