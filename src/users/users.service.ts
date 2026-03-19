import { Injectable, Logger } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserRepository } from "./users.repository";

@Injectable()
export class UsersService {
  private readonly log = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}
  async create(userDto: UserDto) {
    const user = await this.userRepository.create(userDto);
    return user;
  }

  async findAll(query: { page?: number; limit?: number; searchText?: string; filter?: Record<string, any> }) {
    const { page, limit, searchText } = query;
    let { filter = {} } = query;

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
            { "emails.address": new RegExp(escapedWord, "i") }
          ]
        };
      });

      filter = { $and: [filter, ...searchFilter] };
    }

    // Call the new pagination method in your repository
    return this.userRepository.findAndPaginate(filter, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sort: { createdAt: -1 } // Default sort newest first
    });
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ $or: [{ _id: id }, { "profile.email": id }] });
  }

  async update(id: string, userDto: UserDto) {
    return await this.userRepository.updateOne({ _id: id }, { $set: { ...userDto, updatedAt: new Date() } });
  }

  async remove(id: string) {
    return await this.userRepository.updateOne({ _id: id }, { $set: { isAccountActive: false, updatedAt: new Date() } });
  }

  // ---------------- Helper Methods -------------------
  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
