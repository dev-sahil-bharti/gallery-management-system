const { contextBridge, ipcRenderer } = require('electron');

// Secure contextBridge exposure to client window
contextBridge.exposeInMainWorld('electronAPI', {
  // Expose version details and environment variables securely
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
  
  // Custom IPC channels for future features (e.g. folder picker, direct fs resizing)
  send: (channel, data) => {
    // Whitelisted send-only channels
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    // Whitelisted receive-only channels
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes sender details
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
