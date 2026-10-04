import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreatePackageDto {
  @ApiProperty({
    example: "6826b1c25f2a4c1e9d0a2222",
    description: "Product this package belongs to",
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    example: "Shared Profile · 1 Month",
    description: "Derived from profileType and duration when omitted.",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional({
    example: "Shared Profile",
    description:
      "e.g. Shared Profile, Private Profile, Personal, Lifetime License",
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  profileType?: string;

  @ApiPropertyOptional({
    example: "1 Month",
    description: "e.g. 1 Month, 3 Months, 12 Months, 7 Days, 2 Years",
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  duration?: string;

  @ApiProperty({ example: 350, description: "Price in BDT" })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    example: 450,
    description: "Strike-through price in BDT",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ example: 100, default: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 0, description: "Lower sorts first" })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}
