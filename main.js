const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow(){
  //メインウインドウを作成
  const mainWindow = new BrowserWindow({
    width:900,
    height:700,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false
    },

    //アイコンファイル
    //icon:path.join(__dirname, 'icon.png'),
    tiitleBarStyle:'default',
    resizable:true,
    minWidth:600,
    minWidth:600,
    minHeight:500,
    show:false
  });

  //HTMLファイルを読み込み
  mainWindow.loadFile('index.html');

  //ウインドウの準備ができたら表示
  mainWindow.once('ready-to-show',()=>{
    mainWindow.show();
  });

  //開発時のみDevToolsを開く(必要に応じてコメントアウト)
  
}

//アプリが準備完了したらウインドウを作成
//古いElectronバージョン対応
if(app.whenReady){
  app.whenReady().then(()=>{
    createWindow();
  });
} else{
  app.on('ready',createWindow);
}

//すべてのウインドwが閉じられたらアプリを終了(macOS以外)
app.on('window-all-closed', ()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

//macOSでアプリがアクティブになった時にウインドウを作成
app.on('activate',()=>{
  if(BrowserWindow.getAllWindows().length!==0){
    createWindow();
  }
});

//セキリュティ：新しいウインドウの作成を制限
app.on('web-content-created',(event,contents)=>{
  contents.on('new-window', (event,navigationUrl)=>{
    event.preventDefault();
  });
});

//アプリの終了処理
app.on('before-quit',(event)=>{
  console.log('アプリを終了します...');
});