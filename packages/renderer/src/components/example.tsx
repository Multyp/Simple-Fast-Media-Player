/* Global imports */
import { useEffect } from "react";
/* Scoped imports */
/* Local imports */
import { ApiKeys, Channels } from "main/src/ipc/api";

export default function ExampleComponent() {
  function onClickBtn() {
    console.log("button clicked");
    window[ApiKeys.IPC].ipcRenderer.sendMessage(Channels.MSG, ["btn-click"]);
  }

  function onLoaded() {
    console.log("button loaded");
    window[ApiKeys.IPC].ipcRenderer.sendMessage(Channels.MSG, ["btn-loaded"]);
  }

  useEffect(onLoaded);

  return <button onClick={onClickBtn}>Click me</button>;
}
