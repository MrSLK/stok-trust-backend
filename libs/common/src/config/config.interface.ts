interface MongodbConfigProps {
  MONGODB_URI: string;
}

export interface ConfigProps {
  port: number;
  env: string;
  mongodb: {
    database: MongodbConfigProps;
  };
  systemLinks: {
    backendBaseUrl: string;
    frontendBaseUrl: string;
  };
  jwt: {
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
    jwtSecret: string;
  };
  google: {
    userEmail: string;
    apiKey: string;
  };
}
