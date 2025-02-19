import type { ApiKeys, Channels } from "main/src/ipc/api";

declare global {
  interface Window {
    [ApiKeys.IPC]: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;

        on(
          channel: Channels,
          func: (...args: unknown[]) => void,
        ): () => Electron.IpcRenderer;

        once(channel: Channels, func: (...args: unknown[]) => void): void;

        removeAllListeners(channel: Channels): void;
      };
    };
  }
}
