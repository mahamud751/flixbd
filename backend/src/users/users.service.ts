import { Injectable } from "@nestjs/common";
import { publicUserSelect } from "../auth/auth.types";
import { mapPrismaError } from "../common/prisma-errors";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string) {
    const term = search?.trim();
    return this.prisma.user.findMany({
      where: term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { email: { contains: term, mode: "insensitive" } },
              { phone: { contains: term } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: publicUserSelect,
    });
  }

  findOne(id: string) {
    return this.prisma.user
      .findUniqueOrThrow({ where: { id }, select: publicUserSelect })
      .catch(mapPrismaError);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.prisma.user
      .update({ where: { id }, data: dto, select: publicUserSelect })
      .catch(mapPrismaError);
  }

  remove(id: string) {
    return this.prisma.user
      .delete({ where: { id }, select: publicUserSelect })
      .catch(mapPrismaError);
  }
}
