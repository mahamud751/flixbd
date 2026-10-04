import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

const lowerTrim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

export class RegisterDto {
  @ApiProperty({ example: "Rahim Uddin" })
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: "rahim@example.com" })
  @Transform(lowerTrim)
  @IsEmail()
  @MaxLength(200)
  email!: string;

  @ApiPropertyOptional({
    example: "01712345678",
    description: "Bangladesh mobile number",
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/[\s-]/g, "") : value,
  )
  @Matches(/^(?:\+?88)?01[3-9]\d{8}$/, {
    message: "phone must be a Bangladesh mobile number",
  })
  phone?: string;

  @ApiProperty({ example: "secret123", minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: "rahim@example.com" })
  @Transform(lowerTrim)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  @MinLength(1)
  password!: string;
}

export class AdminLoginDto {
  @ApiProperty({ example: "admin@streamnestbd.com" })
  @Transform(lowerTrim)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Admin@12345" })
  @IsString()
  @MinLength(1)
  password!: string;
}
