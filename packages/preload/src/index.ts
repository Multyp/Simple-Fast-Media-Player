import type { IpcRendererEvent } from "electron";
import { contextBridge, ipcRenderer } from "electron";
import { ApiKeys, Channels } from "../../main/src/ipc/api";

interface MediaAPI {
  selectFolder: () => Promise<string>;
  getVideos: (folderPath: string) => Promise<VideoFile[]>;
}

interface VideoFile {
  name: string;
  path: string;
}
const ipcAPI = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },

    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },

    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },

    removeAllListeners(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

const mediaAPI: MediaAPI = {
  selectFolder: () => ipcRenderer.invoke(Channels.SELECT_FOLDER),
  getVideos: (folderPath: string) => ipcRenderer.invoke(Channels.GET_VIDEOS, folderPath),
};

contextBridge.exposeInMainWorld(ApiKeys.IPC, ipcAPI);
contextBridge.exposeInMainWorld(ApiKeys.MEDIA, mediaAPI);
