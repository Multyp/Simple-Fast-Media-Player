/**
 * API keys exposed to renderer process through contextBridge.
 */
export const enum ApiKeys {
  IPC = "ipc",
}

/**
 * IPC channels for Main / Renderer communication.
 */
export const enum Channels {
  MSG = "msg",
}
