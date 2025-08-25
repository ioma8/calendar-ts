declare module 'fontkit' {
  interface FontkitExports {
    logErrors: boolean;
    registerFormat: (...args: unknown[]) => void;
    create: (...args: unknown[]) => unknown;
    defaultLanguage: string;
    setDefaultLanguage: (lang: string) => void;
    openSync: (...args: unknown[]) => unknown;
    open: (...args: unknown[]) => unknown;
  }
  const fontkit: FontkitExports;
  export = fontkit;
}
