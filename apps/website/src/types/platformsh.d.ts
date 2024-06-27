declare module 'platformsh-config' {
  export const config: () => {
    isValidPlatform: () => boolean;
    get port(): number;
  };
}
