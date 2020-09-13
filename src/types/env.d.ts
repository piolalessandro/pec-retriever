declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_CONNECTION_STRING: string
    SERVER_PORT: string
    CAPTCHA_API_KEY: string
    CORS_ORIGIN: string
  }
}
