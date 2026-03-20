import { Module } from "@nestjs/common";
import { ClaimResponsesService } from "./claim-responses.service";
import { ClaimResponsesController } from "./claim-responses.controller";

@Module({
  controllers: [ClaimResponsesController],
  providers: [ClaimResponsesService]
})
export class ClaimResponsesModule {}
