import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AdminGuard } from "./auth.guard";

/** Restricts a route to the admin JWT and documents it in Swagger. */
export const AdminOnly = () =>
  applyDecorators(
    UseGuards(AdminGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Admin token required." }),
  );
