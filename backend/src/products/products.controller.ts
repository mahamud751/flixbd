import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AdminOnly } from "../auth/admin-only.decorator";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "List products with their category and packages" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Matches name or slug",
  })
  @ApiQuery({ name: "category", required: false, description: "Category slug" })
  @ApiQuery({ name: "active", required: false, example: "true" })
  @ApiQuery({ name: "featured", required: false, example: "false" })
  @ApiOkResponse({ description: "Products, sorted by sortOrder then name." })
  findAll(
    @Query("search") search?: string,
    @Query("category") category?: string,
    @Query("active") active?: string,
    @Query("featured") featured?: string,
  ) {
    return this.productsService.findAll({
      search: search || undefined,
      category: category || undefined,
      active:
        active === undefined || active === "" ? undefined : active === "true",
      featured:
        featured === undefined || featured === ""
          ? undefined
          : featured === "true",
    });
  }

  @Get(":idOrSlug")
  @ApiOperation({ summary: "Get one product by id or slug" })
  findOne(@Param("idOrSlug") idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  @AdminOnly()
  @Post()
  @ApiOperation({ summary: "Create a product" })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @AdminOnly()
  @Patch(":id")
  @ApiOperation({ summary: "Update a product" })
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @AdminOnly()
  @Delete(":id")
  @ApiOperation({ summary: "Delete a product (its packages are deleted too)" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
