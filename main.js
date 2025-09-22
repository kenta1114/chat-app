const { app, BrowserWindow } = require('electron');

// GPUアクセラレーション関連の設定
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

const path = require('path');

function createWindow(){
  //メインウインドウを作成
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // 開発モードとして扱い、Viteの開発サーバーに接続
  win.loadURL("http://localhost:5173");
}

const { ipcMain } = require('electron');

ipcMain.on("message", (event,data)=>{
  console.log("Reactから:"+data);

  event.sender.send("reply", "受け取りました！");
});

//アプリが準備完了したらウインドウを作成
//古いElectronバージョン対応
if(app.whenReady){
  app.whenReady().then(()=>{
    createWindow();
  });
} else{
  app.on('ready',createWindow);
}

//すべてのウインドウが閉じられたらアプリを終了(macOS以外)
app.on('window-all-closed', ()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

//macOSでアプリがアクティブになった時にウインドウを作成
app.on('activate',()=>{
  if(BrowserWindow.getAllWindows().length === 0){
    createWindow();
  }
});

//セキュリティ：新しいウインドウの作成を制限
app.on('web-contents-created', (event, contents) => {
  // window.open を全て禁止
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  // 想定外のナビゲーションもブロック
  contents.on('will-navigate', (e) => {
    e.preventDefault();
  });
});

//アプリの終了処理
app.on('before-quit',(event)=>{
  console.log('アプリを終了します...');
});

