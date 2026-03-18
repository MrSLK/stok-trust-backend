import { INestApplication, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000"],
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
  SwaggerModule.setup("docs", app, document);
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
