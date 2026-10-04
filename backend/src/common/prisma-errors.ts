import { ConflictException, NotFoundException } from "@nestjs/common";

/** Maps known Prisma error codes to NestJS HTTP exceptions. */
export function mapPrismaError(error: unknown): never {
  const prismaError = error as {
    code?: string;
    meta?: { modelName?: string; cause?: string };
  };
  switch (prismaError?.code) {
    case "P2002":
      throw new ConflictException(
        `A record with this unique value already exists (${prismaError.meta?.modelName ?? "record"}).`,
      );
    case "P2025":
      throw new NotFoundException("Record not found.");
    case "P2003":
      throw new ConflictException(
        "This record is still referenced by other records and cannot be deleted.",
      );
    default:
      throw error;
  }
}
