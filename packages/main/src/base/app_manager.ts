/* General imports */
import { join } from "path";
import { format } from "url";
import { BrowserWindow, app, ipcMain } from "electron";
/* Scoped imports */
/* Local imports */
import { Emitter } from "utils/emitter";
import { Channels } from "ipc/api";
import { Log } from "../types/logger"

export class AppManager extends Emitter {
  private main_window: BrowserWindow | undefined;

  public constructor() {
    super("APP_MGR");

    ipcMain.on(Channels.MSG, (evt, args) => {
      Log.info(args)
    });
  }

  public init() {
    /**
     * Prevent electron from running multiple instances.
     */
    const isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      app.quit();
      process.exit(0);
    }
    app.on("second-instance", this.restoreOrCreateWindow);

    /**
     * Disable Hardware Acceleration to save more system resources.
     */
    app.disableHardwareAcceleration();

    /**
     * Shout down background process if all windows was closed
     */
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    /**
     * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
     */
    app.on("activate", this.restoreOrCreateWindow.bind(this));

    /**
     * Create the application window when the background process is ready.
     */
    app
      .whenReady()
      .then(this.restoreOrCreateWindow.bind(this))
      .catch(e => console.error("Failed create window:", e));

    /**
     * Check for new version of the application - production mode only.
     */
    if (import.meta.env.PROD) {
      app
        .whenReady()
        .then(() => import("electron-updater"))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch(e => console.error("Failed check updates:", e));
    }
  }

  private async createWindow() {
    this.main_window = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: join(app.getAppPath(), "packages/preload/dist/index.cjs"),
      },
    });

    /**
     * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
     * it then defaults to 'true'. This can cause flickering as the window loads the html content,
     * and it also has show problematic behaviour with the closing of the window.
     * Use `show: false` and listen to the  `ready-to-show` event to show the window.
     *
     * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
     */
    this.main_window.once("ready-to-show", async () => {
      this.main_window?.show();

      if (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE == 1) {
        this.main_window?.webContents.openDevTools();
      }
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test.
     */
    const url =
      import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_DEV_SERVER_URL
        : format({
            protocol: "file",
            slashes: true,
            pathname: join(__dirname, "../../renderer/dist/index.html"),
          });
    await this.main_window.loadURL(url);
    return this.main_window;
  }

  /**
   * Restore an existing BrowserWindow or Create a new BrowserWindow.
   */
  private async restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (window === undefined) {
      window = await this.createWindow();
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window.focus();
  }
}
