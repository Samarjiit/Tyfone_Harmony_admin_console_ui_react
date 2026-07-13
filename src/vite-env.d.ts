/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTEXT_PATH?: string;
  readonly VITE_BACKEND_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
