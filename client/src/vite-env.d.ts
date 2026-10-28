/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API in production, e.g. https://api.example.com (leave empty in dev). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
