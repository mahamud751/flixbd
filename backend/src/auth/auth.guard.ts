import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { JwtPayload, Role } from "./auth.types";

export type AuthedRequest = Request & { auth: JwtPayload };

/** Verifies the Bearer JWT and checks its role. */
@Injectable()
abstract class RoleGuard implements CanActivate {
  protected abstract readonly role: Role;

  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const [scheme, token] = (request.headers.authorization ?? "").split(" ");
    if (scheme !== "Bearer" || !token)
      throw new UnauthorizedException("Missing bearer token.");

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired token.");
    }
    if (payload.role !== this.role)
      throw new ForbiddenException("This route needs a different account.");

    request.auth = payload;
    return true;
  }
}

@Injectable()
export class AdminGuard extends RoleGuard {
  protected readonly role = "admin";
}

@Injectable()
export class CustomerGuard extends RoleGuard {
  protected readonly role = "customer";
}
