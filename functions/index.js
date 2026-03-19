const functions = require("firebase-functions");
const express = require("express");

const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const { AppModule } = require("../dist/app.module");

const server = express();

async function createNestServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();
}

createNestServer();

exports.api = functions.https.onRequest(server);