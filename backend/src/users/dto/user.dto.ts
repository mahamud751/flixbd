import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Rahim Uddin" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: "01712345678" })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/[\s-]/g, "") : value,
  )
  @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, {
    message: "phone must be a Bangladesh mobile number",
  })
  phone?: string;

  @ApiPropertyOptional({ example: true, description: "false blocks login" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
