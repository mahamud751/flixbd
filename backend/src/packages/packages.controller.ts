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
import { PackagesService } from "./packages.service";
import { CreatePackageDto, UpdatePackageDto } from "./dto/package.dto";

@ApiTags("packages")
@Controller("packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: "List packages, optionally filtered by product" })
  @ApiQuery({
    name: "productId",
    required: false,
    description: "Only packages of this product",
  })
  @ApiQuery({ name: "available", required: false, example: "true" })
  @ApiOkResponse({
    description: "Packages, sorted by product name then sortOrder.",
  })
  findAll(
    @Query("productId") productId?: string,
    @Query("available") available?: string,
  ) {
    return this.packagesService.findAll({
      productId: productId || undefined,
      available:
        available === undefined || available === ""
          ? undefined
          : available === "true",
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one package by id" })
  findOne(@Param("id") id: string) {
    return this.packagesService.findOne(id);
  }

  @AdminOnly()
  @Post()
  @ApiOperation({ summary: "Create a package under a product" })
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @AdminOnly()
  @Patch(":id")
  @ApiOperation({
    summary: "Update a package (name rebuilds from profileType / duration)",
  })
  update(@Param("id") id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @AdminOnly()
  @Delete(":id")
  @ApiOperation({ summary: "Delete a package" })
  remove(@Param("id") id: string) {
    return this.packagesService.remove(id);
  }
}
