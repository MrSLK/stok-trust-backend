import { PipelineStage } from "mongoose";
import { StokvelMembershipDto } from "./dto/stokvel-membership.dto";
import { StokvelMembershipRepository } from "./stokvel-membership.repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class StokvelMembershipService {
  private readonly log = new Logger(StokvelMembershipService.name);
  constructor(private readonly stokvelMembershipRepository: StokvelMembershipRepository) {}

  async create(stokvelMembershipDto: StokvelMembershipDto) {
    return this.stokvelMembershipRepository.create(stokvelMembershipDto);
  }

  async findOne(values: { userId: string; stokvelId: string }) {
    return this.stokvelMembershipRepository.findOne(values);
  }

  async findByUserId(userId: string) {
    return this.stokvelMembershipRepository.find({
      userId,
      isActive: true
    });
  }

  async findAll(values: { page: number; size: number; searchText?: string; filter: Record<any, any> }) {
    const { page, size, searchText } = values;
    let { filter = {} } = values; // default for non-system-admins should have a stokvel ID inside

    if (searchText) {
      const words = searchText.trim().split(/\s+/);

      const searchFilter = words.map(word => {
        const escapedWord = this.escapeRegex(word);

        return {
          $or: [
            { _id: new RegExp(escapedWord, "i") },
            { "profile.firstName": new RegExp(escapedWord, "i") },
            { "profile.lastName": new RegExp(escapedWord, "i") },
            { "profile.cellNumber": new RegExp(escapedWord, "i") },
            { "profile.email": new RegExp(escapedWord, "i") }
          ]
        };
      });

      filter = { $and: [filter, ...searchFilter] };
    }

    const aggregatePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $match: filter
      },
      { $sort: { createdAt: -1 } },
      { $skip: Number(size) * Number(page) - Number(size) },
      { $limit: Number(size) },
      {
        $project: {
          stokvelId: 1,
          userId: 1,
          role: 1,
          "userDetails.profile": 1
        }
      }
    ];

    const users = await this.stokvelMembershipRepository.aggregate(aggregatePipeline);
    const count = await this.stokvelMembershipRepository.countDocuments(filter);

    return {
      users,
      meta: {
        totalCount: count,
        page,
        size
      }
    };
  }

  // ================ Helpers ================

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
