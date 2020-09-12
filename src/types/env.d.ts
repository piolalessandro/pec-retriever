declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_PASSWORD: string;
    SERVER_PORT: string;
    CAPTCHA_API_KEY: string;
  }
}
