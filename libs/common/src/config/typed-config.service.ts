import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LeafTypes, Leaves } from "./env.config";
import { ConfigProps } from "./config.interface";

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get<T extends Leaves<ConfigProps>>(propertyPath: T, ...args: [defaultValue?: LeafTypes<ConfigProps, T>]): LeafTypes<ConfigProps, T> {
    return this.configService.get(propertyPath, ...args);
  }
}
