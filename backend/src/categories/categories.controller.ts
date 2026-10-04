import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminOnly } from "../auth/admin-only.decorator";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List all categories with product counts" })
  @ApiOkResponse({
    description: "All categories, sorted by sortOrder then name.",
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one category by id" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @AdminOnly()
  @Post()
  @ApiOperation({ summary: "Create a category" })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @AdminOnly()
  @Patch(":id")
  @ApiOperation({ summary: "Update a category" })
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @AdminOnly()
  @Delete(":id")
  @ApiOperation({
    summary: "Delete a category (fails while products are attached)",
  })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
