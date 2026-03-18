import { ConfigProps } from "./config.interface";

export default (): ConfigProps => ({
  port: Number(process.env.PORT) || 8080,
  env: process.env.ENV || "development",
  mongodb: {
    database: {
      MONGODB_URI: process.env.DB_URL || "mongodb://localhost:27017"
    }
  },
  systemLinks: {
    backendBaseUrl: process.env.BASE_URL || "",
    frontendBaseUrl: process.env.BASE_WEB_API || ""
  },
  jwt: {
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "24h",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    jwtSecret: process.env.JWT_SECRET || ""
  },
  google: {
    userEmail: process.env.USER_EMAIL || "",
    apiKey: process.env.EMAIL_API_KEY || ""
  }
});

export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;
