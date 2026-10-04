import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminGuard, type AuthedRequest, CustomerGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AdminLoginDto, LoginDto, RegisterDto } from "./dto/auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Create a customer account; returns a JWT" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Customer login with email + password; returns a JWT" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(CustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "The signed-in customer" })
  me(@Req() request: AuthedRequest) {
    return this.authService.me(request.auth.sub);
  }

  @Post("admin/login")
  @HttpCode(200)
  @ApiOperation({
    summary: "Admin login with the static ADMIN_EMAIL / ADMIN_PASSWORD; returns a JWT",
  })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Get("admin/me")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "The signed-in admin" })
  adminMe(@Req() request: AuthedRequest) {
    return { email: request.auth.email, role: request.auth.role };
  }
}
