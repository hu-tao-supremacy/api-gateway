declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: string;
    GRPC_HOST: string;
    GRPC_PORT: string;
    HTS_SVC_ACCOUNT: string;
    HTS_SVC_FACILITY: string;
    GCP_CREDENTIALS: string;
    GCP_BUCKET_NAME: string;
  }
}