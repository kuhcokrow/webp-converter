declare module "bwip-js" {
  const bwipjs: {
    toBuffer: (
      options: Record<string, unknown>,
      callback: (error: Error | null, png: Buffer) => void
    ) => void
  }

  export default bwipjs
}