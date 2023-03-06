declare namespace NodeJS {
  interface ProcessEnv {
    readonly APP_URL: string;
    readonly DATABASE_URL: string;
    readonly NEXT_PUBLIC_APP_KEY: string;
  }
}
