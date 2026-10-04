import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AdminGuard } from "../auth/auth.guard";
import { UpdateUserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "List customer accounts (admin)" })
  @ApiQuery({ name: "search", required: false, description: "Name, email or phone" })
  findAll(@Query("search") search?: string) {
    return this.usersService.findAll(search);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one customer (admin)" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a customer, e.g. disable login (admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a customer account (admin)" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
