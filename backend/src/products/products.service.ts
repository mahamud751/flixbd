import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "../common/slug";
import { mapPrismaError } from "../common/prisma-errors";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

const productInclude = {
  category: true,
  packages: { orderBy: { sortOrder: "asc" } },
} as const;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: {
    search?: string;
    category?: string;
    active?: boolean;
    featured?: boolean;
  }) {
    return this.prisma.product.findMany({
      where: {
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { slug: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
        ...(filters.category && { category: { slug: filters.category } }),
        ...(filters.active !== undefined && { isActive: filters.active }),
        ...(filters.featured !== undefined && { isFeatured: filters.featured }),
      },
      include: productInclude,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  /** Lookup by id or slug — handy for admin deep links and storefront pages. */
  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: productInclude,
    });
    if (!product) throw new NotFoundException(`Product ${idOrSlug} not found.`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category)
      throw new NotFoundException(`Category ${dto.categoryId} not found.`);

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          slug: slugify(dto.slug ?? dto.name),
          categoryId: dto.categoryId,
          typeLabel: dto.typeLabel,
          blurb: dto.blurb,
          features: dto.features ?? [],
          paragraphs: dto.paragraphs ?? [],
          image: dto.image,
          rating: dto.rating ?? 4.7,
          reviewCount: dto.reviewCount ?? 0,
          homeSection: dto.homeSection,
          isFeatured: dto.isFeatured ?? false,
          isActive: dto.isActive ?? true,
          sortOrder: dto.sortOrder ?? 0,
          caution: dto.caution,
        },
        include: productInclude,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category)
        throw new NotFoundException(`Category ${dto.categoryId} not found.`);
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.slug !== undefined && { slug: slugify(dto.slug) }),
          ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
          ...(dto.typeLabel !== undefined && { typeLabel: dto.typeLabel }),
          ...(dto.blurb !== undefined && { blurb: dto.blurb }),
          ...(dto.features !== undefined && { features: dto.features }),
          ...(dto.paragraphs !== undefined && { paragraphs: dto.paragraphs }),
          ...(dto.image !== undefined && { image: dto.image }),
          ...(dto.rating !== undefined && { rating: dto.rating }),
          ...(dto.reviewCount !== undefined && {
            reviewCount: dto.reviewCount,
          }),
          ...(dto.homeSection !== undefined && {
            homeSection: dto.homeSection,
          }),
          ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
          ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
          ...(dto.caution !== undefined && { caution: dto.caution }),
        },
        include: productInclude,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      mapPrismaError(error);
    }
  }
}
