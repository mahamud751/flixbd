import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { mapPrismaError } from "../common/prisma-errors";
import { CreatePackageDto, UpdatePackageDto } from "./dto/package.dto";

const packageInclude = {
  product: { select: { id: true, name: true, slug: true } },
} as const;

/** Derives the display name from profile type and duration, e.g. "Shared Profile · 1 Month". */
function packageName(dto: {
  name?: string;
  profileType?: string;
  duration?: string;
}): string {
  if (dto.name) return dto.name;
  return (
    [dto.profileType, dto.duration].filter(Boolean).join(" · ") || "Standard"
  );
}

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: { productId?: string; available?: boolean }) {
    return this.prisma.package.findMany({
      where: {
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.available !== undefined && {
          isAvailable: filters.available,
        }),
      },
      include: packageInclude,
      orderBy: [{ product: { name: "asc" } }, { sortOrder: "asc" }],
    });
  }

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: packageInclude,
    });
    if (!pkg) throw new NotFoundException(`Package ${id} not found.`);
    return pkg;
  }

  async create(dto: CreatePackageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product)
      throw new NotFoundException(`Product ${dto.productId} not found.`);

    try {
      return await this.prisma.package.create({
        data: {
          productId: dto.productId,
          name: packageName(dto),
          profileType: dto.profileType,
          duration: dto.duration,
          price: dto.price,
          compareAtPrice: dto.compareAtPrice,
          stock: dto.stock ?? 100,
          isAvailable: dto.isAvailable ?? true,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: packageInclude,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOne(id);

    try {
      return await this.prisma.package.update({
        where: { id },
        data: {
          ...(this.wantsNameChange(dto) && { name: packageName(dto) }),
          ...(dto.profileType !== undefined && {
            profileType: dto.profileType,
          }),
          ...(dto.duration !== undefined && { duration: dto.duration }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.compareAtPrice !== undefined && {
            compareAtPrice: dto.compareAtPrice,
          }),
          ...(dto.stock !== undefined && { stock: dto.stock }),
          ...(dto.isAvailable !== undefined && {
            isAvailable: dto.isAvailable,
          }),
          ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        },
        include: packageInclude,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.package.delete({ where: { id } });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  /** Rebuild the display name when any of its parts (or the name itself) changes. */
  private wantsNameChange(dto: UpdatePackageDto): boolean {
    return (
      dto.name !== undefined ||
      dto.profileType !== undefined ||
      dto.duration !== undefined
    );
  }
}
