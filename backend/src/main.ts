import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  const corsOrigins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("StreamNest BD API")
    .setDescription(
      "Packages catalog API for StreamNest BD — categories, products, packages, and customer accounts. Write routes need an admin token from POST /api/auth/admin/login (use the Authorize button). " +
        "The admin panel and the storefront consume this API.",
    )
    .setVersion("1.0")
    .addTag(
      "categories",
      "Product categories, e.g. OTT & Entertainment, AI & Productivity",
    )
    .addTag("products", "Catalog products, e.g. Netflix Premium, ChatGPT Plus")
    .addTag(
      "packages",
      "Purchasable plans of a product, e.g. Shared Profile · 1 Month",
    )
    .addTag("auth", "Customer register/login and the static admin login")
    .addTag("users", "Customer accounts (admin only)")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, document, {
    jsonDocumentUrl: "api-docs-json",
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);

  console.log(`StreamNest BD API  →  http://localhost:${port}/api`);
  console.log(`Swagger docs      →  http://localhost:${port}/api-docs`);
}

void bootstrap();
