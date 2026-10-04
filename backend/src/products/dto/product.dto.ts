import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Netflix Premium" })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional({
    example: "netflix-premium",
    description: "Derived from the name when omitted.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  slug?: string;

  @ApiProperty({
    example: "6826b1c25f2a4c1e9d0a1111",
    description: "Category id",
  })
  @IsString()
  categoryId!: string;

  @ApiPropertyOptional({
    example: "Streaming",
    description: "Short type label",
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  typeLabel?: string;

  @ApiPropertyOptional({
    example: "Netflix premium profiles for phone, tablet, laptop, PC, and TV.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  blurb?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ["Private profile on any device", "Delivered on WhatsApp"],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  features?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: "Long description paragraphs",
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  paragraphs?: string[];

  @ApiPropertyOptional({ example: "/shop/netflix-subscription-bangladesh.png" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional({ example: 4.8, default: 4.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 591, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  reviewCount?: number;

  @ApiPropertyOptional({
    example: "picks",
    description: "Home section: picks | combos | popular | ai | productivity",
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  homeSection?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0, description: "Lower sorts first" })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    example:
      "Profile access arranged by StreamNest BD, not an official gift card.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caution?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
