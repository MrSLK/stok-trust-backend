import { register } from "tsconfig-paths";
import * as tsConfig from "../tsconfig.json";

// 1. Define the structure to satisfy the linter
interface TsConfig {
  compilerOptions: {
    baseUrl: string;
    paths: Record<string, string[]>;
  };
}

// 2. Cast the imported JSON to your interface
const config = tsConfig as unknown as TsConfig;

register({
  baseUrl: config.compilerOptions.baseUrl || "./",
  paths: config.compilerOptions.paths
});
import { INestApplication, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000", "https://stok-trust.netlify.app"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
  });

  initializeSwagger(app);

  app.enableVersioning({
    type: VersioningType.URI
  });
  await initializeApp(app);
}

const initializeSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addSecurityRequirements("bearer")
    .setTitle("Preferental Lease Management Service")
    .setDescription("This is the API specs for preferental lease management service")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Use CDN for Swagger UI assets to fix Vercel loading issues
  const CSS_URL = "https://cdnjs.cloudflare.com";
  const JS_URLS = ["https://cdnjs.cloudflare.com", "https://cdnjs.cloudflare.com"];

  SwaggerModule.setup("docs", app, document, {
    customCssUrl: CSS_URL,
    customJs: JS_URLS
  });
};

const initializeApp = async (app: INestApplication): Promise<void> => {
  const configService = app.get(ConfigService);
  const port = configService.get<number>("port");

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    const logger = new Logger();

    logger.log(`Success!! App listening on PORT - ${port}`);
  });
};
bootstrap();
