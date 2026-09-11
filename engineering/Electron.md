# Electron

- `nodeIntegration: false`. *(electron.1 — error)*
- `contextIsolation: true`. *(electron.2 — error)*
- Use preload scripts + `contextBridge` to expose a narrow, typed API.
- **Request-response:** `ipcMain.handle` / `ipcRenderer.invoke`.
- **Fire-and-forget:** `ipcMain.on` / `webContents.send`. Both patterns are valid — choose by need. *(electron.3)*
- `shell.openExternal` must validate URL against an allowlist. *(electron.4 — error)*
- Enable `sandbox: true` where possible. *(electron.5 — prefer)*
- The `@electron/remote` module is deprecated — use IPC.
- Enforce `app.requestSingleInstanceLock()`.
