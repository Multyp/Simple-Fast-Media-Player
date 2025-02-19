export type Logger = {
  info: (message: string) => void;
  error: (message: string) => void;
};

export const Log = {
  info(message: string) {
    const logMessage = `[INFO] ${message}`;
    console.log('\x1b[34m%s\x1b[0m', `[INFO]`, message); // Blue color
  },
  error(message: string) {
    const logMessage = `[ERROR] ${message}`;
    console.log('\x1b[31m%s\x1b[0m', `[ERROR]`, message); // Red color
  },
};
