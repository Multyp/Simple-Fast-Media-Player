/**
 * API keys exposed to renderer process through contextBridge.
 */
export const enum ApiKeys {
  IPC = "ipc",
  MEDIA = "media",
}

/**
 * IPC channels for Main / Renderer communication.
 */
export const enum Channels {
  MSG = "msg",
  SELECT_FOLDER = "folder:select",
  GET_VIDEOS = "videos:get",
  STREAM_VIDEO = "video:play",
}
