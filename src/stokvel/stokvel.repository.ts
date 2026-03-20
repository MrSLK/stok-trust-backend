import { Stokvel, StokvelDocument } from "../../libs/common/src/database/schemas/stokvel.schema";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../../libs/common/src/database/abstract.repository";

@Injectable()
export class StokvelRepository extends AbstractRepository<StokvelDocument> {
  protected readonly logger = new Logger(StokvelRepository.name);

  constructor(
    @InjectModel(Stokvel.name)
    stokvelModel: Model<StokvelDocument>
  ) {
    super(stokvelModel);
  }
}
