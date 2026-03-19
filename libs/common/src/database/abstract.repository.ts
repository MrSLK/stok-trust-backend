import { Logger } from "@nestjs/common";
import { Model, Document, UpdateQuery, QueryFilter, SortOrder } from "mongoose";

interface PaginateOptions {
  page?: number; // Added page
  limit?: number;
  sort?: Record<string, SortOrder>;
}

export abstract class AbstractRepository<TDocument extends Document<any>> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuery: QueryFilter<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).exec();
  }

  async findOne(filterQuery: QueryFilter<TDocument>): Promise<TDocument | null> {
    return this.model.findOne(filterQuery).exec();
  }

  async create(document: Partial<TDocument>): Promise<TDocument> {
    const createdDocument = new this.model(document);
    return createdDocument.save();
  }

  async insertMany(documents: Partial<TDocument>[]): Promise<TDocument[]> {
    return this.model.insertMany(documents) as unknown as Promise<TDocument[]>;
  }

  async updateOne(filterQuery: QueryFilter<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument | null> {
    return this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true
      })
      .exec();
  }

  async updateMany(filterQuery: QueryFilter<TDocument>, update: UpdateQuery<TDocument>): Promise<number> {
    const result = await this.model.updateMany(filterQuery, update).exec();
    return result.modifiedCount;
  }

  async deleteOne(filterQuery: QueryFilter<TDocument>): Promise<boolean> {
    const result = await this.model.deleteOne(filterQuery).exec();
    return result.deletedCount === 1;
  }

  async deleteMany(filterQuery: QueryFilter<TDocument>): Promise<number> {
    const result = await this.model.deleteMany(filterQuery).exec();
    return result.deletedCount ?? 0;
  }

  async countDocuments(filterQuery: QueryFilter<TDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  async findAndPaginate(
    filterQuery: QueryFilter<TDocument>,
    options: PaginateOptions
  ): Promise<{ data: TDocument[]; meta: { total: number; page: number; size: number; totalPages: number } }> {
    const page = options.page ?? 1;
    const size = options.limit ?? 10;
    const skip = (page - 1) * size;
    const sort = options.sort ?? { createdAt: -1 };

    const [data, total] = await Promise.all([
      Promise.resolve(this.model.find(filterQuery).sort(sort).skip(skip).limit(size).lean(true).exec()) as Promise<TDocument[]>,
      this.model.countDocuments(filterQuery).exec()
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data,
      meta: {
        total,
        page,
        size,
        totalPages
      }
    };
  }
}
