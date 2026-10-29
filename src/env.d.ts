interface ImportMetaEnv {
  readonly DATABASE_URL?: string
  readonly PUBLIC_WHATSAPP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
