
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下プロパティ   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//================================ 各種変数 ===============================================//
//１マップ大きさ
var mapTipLength = 32;
//表示キャンバス横
var viewCanvasWidth = 736;
//表示キャンバス縦
var viewCanvasHeight = 480;
//表示キャンバス横半径
var viewCanvasHalfWidth = (viewCanvasWidth - mapTipLength) / 2;
//表示キャンバス縦半径
var viewCanvasHalfHeight = (viewCanvasHeight - mapTipLength) / 2;
//マップ行数
var mapRowNum = viewCanvasWidth/mapTipLength;
//マップ列数
var mapColNum = viewCanvasHeight/mapTipLength;
//スクロール方向
var scrollDir;
//スクロールフラグ
var scrollState = false; 
//スクロール位置(1pxずつ増やしていく)
var scrollPos = 0;
//プロジェクトのマップオブジェクト用配列
var mapObj = [];
//プロジェクトのデータオブジェクト
var projectDataObj;
//現在選択中マップオブジェクト;
var currrentMapObj = null;
//現在選択中マップ名
var currrentMapName;
//現在選択中マップ画像
var currentMapImg;
//メインキャラ画像配列;
var mainCharaImgArray = [];
//メインキャラ画像;
var mainCharaImg;
//メインキャラ現在位置X
var mainCharaPosX;
//メインキャラ現在位置Y
var mainCharaPosY;
//メインキャラ向き
var mainCharaDir = 'down';
//現在選択中マップ横
var currentMapImgWidth;
//現在選択中マップ縦
var currentMapImgHeight;
//キャンバス描画用フラグ
var drawFlg = true;
//マップチップオブジェクト
var maptipObj;
//イベント配列
var events;
//イベントインデックス
var eventIndex = 0;
//会話用ウィンドウスタート位置X
var talkWinStartX = mapTipLength;
//会話用ウィンドウスタート位置Y
var talkWinStartY = viewCanvasHeight - (mapTipLength*5);
//会話用ウィンドウ横幅
var talkWinWidth = viewCanvasWidth - (mapTipLength*2);
//会話用ウィンドウ縦幅
var talkWinHeight = mapTipLength*4;
//会話用フォント
var talkFont = "32px monospace";
//トーク中フラグ
var talkFlg = false;
//会話一行長さ
var talkLineLength = 0;
//会話一行最大長さ
var talkLineMaxLength = talkWinWidth-20;
//会話行数
var talkLines = [];
//会話行インデックス
var talkLineIndex = 0;
//会話ページ
var talkPages = [];
//会話ページインデックス
var talkPageIndex = 0;
//会話ストップフラグ
var talkWaitFlg = false;
//会話ストップ中三角形表示フラグ
var showTriangleFlg = false;


//================================ 各種エレメント ===============================================//
//スクロールキャンバス
//表示キャンバス
var viewCanvas = document.getElementById('viewCanvas');
var viewContext = viewCanvas.getContext("2d");
//マップ名
var mapNames = document.getElementsByClassName('mapNames');


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下イベント   ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('load', setDefault, false);
document.body.addEventListener('keydown', function(evt) {keyDownHandler(evt);}, false);
document.body.addEventListener('keyup', function(evt) {keyUpHandler(evt);}, false);
// for (var i=0; i<maps.length; i++) {
// 	maps[i].addEventListener('click', function(evt) {setEditMap(evt);}, false);
// }
// currentMapCanvas.addEventListener('click', function(evt) {showMapTipData(evt);}, false);
// saveMap.addEventListener('click', saveMapToServer, false);

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////　　以下ファンクション   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//デフォルト値設定
function setDefault() {
    loadJsonToObj();
    loadProjectData();
    loadMainCharacter();
    setCanvas();
    showStartProject();
    draw();
}

//プロジェクトのjsonをすべてオブジェクトにロードする
function loadJsonToObj() {
    //マップのオブジェクトをロードする
    for (var i=0; i<mapNames.length; i++) {
        //なんでホスト名は要らないのか不明!謎！
        var url = 'projects/' + projectName.innerText + '/' + mapNames[i].innerText + '.json';
        var xhr = new XMLHttpRequest();
        //同期処理なので、ここで毎回取得
        xhr.open('GET', url, false);
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
        xhr.send(null);
        mapObj[mapNames[i].innerText] = JSON.parse(xhr.responseText);
    }
    //プロジェクトデータをロードする
    var url = 'projects/' + projectName.innerText + '/projectData.json';
    var xhr = new XMLHttpRequest();
    //同期処理なので、ここで毎回取得
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    xhr.send(null);
    projectDataObj = JSON.parse(xhr.responseText);
}

//プロジェクトデータをロードする
function loadProjectData() {
    //スタートポジションをロード
    mainCharaPosX = projectDataObj['startPosX'] * mapTipLength;
    mainCharaPosY = projectDataObj['startPosY'] * mapTipLength;
}

//メインキャラクターをロードする
function loadMainCharacter() {
    var mainCharaArray = [
        '/rpg-player/public/image/mainCharacterLeft.png',
        '/rpg-player/public/image/mainCharacterUp.png',
        '/rpg-player/public/image/mainCharacterRight.png',
        '/rpg-player/public/image/mainCharacterDown.png',
    ]
    for (i=0; i<mainCharaArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = mainCharaArray[i];
        mainCharaImgArray.push(imgObj);
    }
    //ロード時は下向きで表示
    mainCharaImg = mainCharaImgArray[3];
}

//キャンバスセッティング
function setCanvas() {
    viewCanvas.setAttribute('width', viewCanvasWidth);
    viewCanvas.setAttribute('height', viewCanvasHeight);
}

//スタートプロジェクトを開く
function showStartProject() {
    //スタートプロジェクトの読み込み
    var startMap = projectDataObj['startMap'];
    currentMapImg = document.getElementById(startMap);
    currrentMapObj =  mapObj[startMap];

    //表示キャンバスに描画
    currentMapImgWidth = currentMapImg.naturalWidth;
    currentMapImgHeight = currentMapImg.naturalHeight;
    viewContext.drawImage(currentMapImg,0,0);

}

//メインキャラクターを表示する
function drawMainCharacter() {
    viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);
}

function keyUpHandler(evt) {
    console.log(evt.keyCode);
}

function keyDownHandler(evt) { 
    //スクロールフラグがfalseの間(止まっている時)のみ、キーダウンイベント受け付け
    if (!scrollState) {
        //会話中の時
        if (talkFlg) {
            switch (evt.keyCode) {
                case 65: //Aボタン
                    //次の会話を表示
                    nextTalk();
                    break;
                default:
                    //上記以外のキーは受け付けない
                    return;
                    break;
            }
        } else {
            switch (evt.keyCode) {
                case 37: //左
                    scrollDir = 'left';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[0];
                    break;
        
                case 38: //上
                    scrollDir = 'up';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[1];
                    break;
        
                case 39: //右
                    scrollDir = 'right';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[2];
                    break;
        
                case 40: //下
                    scrollDir = 'down';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[3];
                    break;
                
                case 65: //Aボタン
                    //トリガーAボタンのチェック
                    var res = checkTrigger('Aボタン', scrollDir);
                    if (res != false) {
                        maptipObj = res;
                        doEvents();
                    }
                    return;
                    break;
    
                default:
                    //上記以外のキーは受け付けない
                    return;
                    break;
            }
            if(checkStartMoveEvent()) {
                scrollState = true;
            }
        }
    }   
}

//動き始めのイベントチェック
//戻り値:bool（false→動かない、true→動く）
function checkStartMoveEvent() {
    //スクロール方向がマップ外でないかチェック
    switch (scrollDir) {
        case 'left':
            //マップ外でないかチェック
            if (mainCharaPosX == 0) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength;
            var nextCellX = mainCharaPosX/mapTipLength-1;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if ( maptiptype != 3) return false;
            break;
        case 'up':  
            //マップ外でないかチェック 
            if (mainCharaPosY == 0) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength-1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (maptiptype != 3) return false;
            break;
        case 'right':  
            //マップ外でないかチェック 
            if (mainCharaPosX+mapTipLength == currentMapImgWidth) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength;
            var nextCellX = mainCharaPosX/mapTipLength+1;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (maptiptype != 3) return false;
            break;
        case 'down':
            //マップ外でないかチェック 
            if (mainCharaPosY+mapTipLength == currentMapImgHeight) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength+1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (maptiptype != 3) return false;
            break;
    }
    return true;
}

//トリガーをチェックする
function checkTrigger(trigger, direction) {
    switch (trigger) {
        case 'Aボタン':
            switch (direction) {
                case 'left':
                    //マップ外でないかチェック
                    if (mainCharaPosX == 0) return false;
                    //通りぬけかどうかチェック
                    var nextCellY = mainCharaPosY/mapTipLength;
                    var nextCellX = mainCharaPosX/mapTipLength-1;
                    var nextCell = currrentMapObj[nextCellY][nextCellX];
                    if(nextCell.hasOwnProperty('trigger')) {
                        if(nextCell['trigger'] == 'Aボタン') {
                            return nextCell['events'];
                        }
                    } else {
                        return false;
                    }
                    break;
                case 'up':  
                    //マップ外でないかチェック 
                    if (mainCharaPosY == 0) return false;
                    //通りぬけかどうかチェック
                    var nextCellY = mainCharaPosY/mapTipLength-1;
                    var nextCellX = mainCharaPosX/mapTipLength;
                    var nextCell = currrentMapObj[nextCellY][nextCellX];
                    if(nextCell.hasOwnProperty('trigger')) {
                        if(nextCell['trigger'] == 'Aボタン') {
                            return nextCell['events'];
                        }
                    } else {
                        return false;
                    }
                    break;
                case 'right':  
                    //マップ外でないかチェック 
                    if (mainCharaPosX+mapTipLength == currentMapImgWidth) return false;
                    //通りぬけかどうかチェック
                    var nextCellY = mainCharaPosY/mapTipLength;
                    var nextCellX = mainCharaPosX/mapTipLength+1;
                    var nextCell = currrentMapObj[nextCellY][nextCellX];
                    if(nextCell.hasOwnProperty('trigger')) {
                        if(nextCell['trigger'] == 'Aボタン') {
                            return nextCell['events'];
                        }
                    } else {
                        return false;
                    }
                    break;
                case 'down':
                    //マップ外でないかチェック 
                    if (mainCharaPosY+mapTipLength == currentMapImgHeight) return false;
                    //通りぬけかどうかチェック
                    var nextCellY = mainCharaPosY/mapTipLength+1;
                    var nextCellX = mainCharaPosX/mapTipLength;
                    var nextCell = currrentMapObj[nextCellY][nextCellX];
                    if(nextCell.hasOwnProperty('trigger')) {
                        if(nextCell['trigger'] == 'Aボタン') {
                            return nextCell['events'];
                        }
                    } else {
                        return false;
                    }
                    break;
                default:
                    return false;
                    break;
            }
            break;
    }
}

//マップチップに設定されたイベントを実行する
function doEvents() {
    //イベントのキーとキーインデックスの取得
    events = Object.keys(maptipObj);
    //イベントネームを取得
    var evtFullName = events[eventIndex];
    var evtName = evtFullName.substr(2);
    switch (evtName) {
        case 'talk':
            var talkContent =  maptipObj[evtFullName]['talkContent'];
            doTalk(talkContent);
            break;
    }
}

function doTalk(talkContent) {
    //drawを止める
    drawFlg = false;
    //会話中にする
    talkFlg = true;
    //会話ウィンドウを白でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
    //会話表示メタデータセット
    viewContext.fillStyle = 'white';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    talkLines[talkLineIndex] = '';
    //引数の会話内容を、一行ずつに分割
    for (var i=0; i<talkContent.length; i++) {
        talkLines[talkLineIndex] += talkContent[i];
        talkLineLength = viewContext.measureText(talkLines[talkLineIndex]);
        if (talkLineLength.width > talkLineMaxLength-mapTipLength-mapTipLength) {
            talkLineIndex++;
            talkLines[talkLineIndex] = '';
        }
    }
    //会話行を会話ページ単位に分割
    talkPages[talkPageIndex] = [];
    for (var i=0; i<talkLines.length; i++) {
        if (i != 0 && i%3 == 0) {
            talkPageIndex++;
            talkPages[talkPageIndex] = [];
        }
        talkPages[talkPageIndex].push(talkLines[i]);
    }
    //会話インデックスを初期化
    talkPageIndex = 0;
    //会話内容を表示する
    showTalkContens();
}

//会話内容表示メソッド
function showTalkContens() {
    //現在のページの会話内容を表示
    viewContext.fillStyle = 'white';
    for (var i=0; i<talkPages[talkPageIndex].length; i++) {
        viewContext.fillText(talkPages[talkPageIndex][i], talkWinStartX+2+10, talkWinStartY+2+10+(i*mapTipLength));
    }
    //次のページがあれば会話待ち状態に
    if (talkPageIndex+1 != talkPages.length) {
        if (!talkWaitFlg) {
            talkWaitFlg = true;
            talkWait();
        }
    } else {
        //次のページがなければ、会話待ち状態を解除
        talkWaitFlg = false;
    }
}

//会話待ち状態
function talkWait() {
    if (talkWaitFlg) {
        if (showTriangleFlg) {
            viewContext.fillStyle = 'white';
            viewContext.fillText('▼', talkWinStartX+talkWinWidth-mapTipLength-10, talkWinStartY+talkWinHeight-mapTipLength-10);
            showTriangleFlg = false;
        } else {
            viewContext.fillStyle = 'black';
            viewContext.fillText('▼', talkWinStartX+talkWinWidth-mapTipLength-10, talkWinStartY+talkWinHeight-mapTipLength-10);
            showTriangleFlg = true;
        }
        setTimeout("talkWait()", 500);
    } else {
        var timerId = setTimeout("talkWait()", 1);
        clearTimeout(timerId);
    }
}

//次の会話ページの表示
function nextTalk() {
    //次のページがあれば
    if (talkPageIndex+1 != talkPages.length) {
        //会話ページインデックスを増
        talkPageIndex++;
        //会話エリアクリア
        viewContext.fillStyle = 'black';
        viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
        //会話内容を表示
        showTalkContens();
    } else {
        //なかったら
        //会話イベント終了、次のイベントへ(フラグ等戻す)
        //トーク中フラグ
        talkFlg = false;
        //会話一行長さ
        talkLineLength = 0;
        //会話行数
        talkLines = [];
        //会話行インデックス
        talkLineIndex = 0;
        //会話ページ
        talkPages = [];
        //会話ページインデックス
        talkPageIndex = 0;
        //次のイベントがあったら
        if (eventIndex+1 != events.length) {
            //次のイベント呼び出し
            eventIndex++;
            doEvents();
        } else {
            eventIndex = 0;
            //再描画開始
            drawFlg = true;
            draw();
        }
    }
}

//マップ描画イベント
function draw() {
    switch (scrollState) {
        //非スクロール中
        case false:

            break;
        
        //スクロール中
        case true:
            //スクロールポジションを更新
            scrollPos++;

            switch (scrollDir) {
                case 'left':   
                    mainCharaPosX--;
                    break;
                case 'up':   
                    mainCharaPosY--;
                    break;
                case 'right':   
                    mainCharaPosX++;
                    break;
                case 'down':   
                    mainCharaPosY++;
                    break;
            }
            //テスト用コード
            console.log(mainCharaPosX + ':' + mainCharaPosY);
            break;
    }

    //1マップチップ分進んだら、変数を初期化して終了
    if (scrollPos == mapTipLength) {
        //各種変数初期化
        scrollState = false;
        scrollPos = 0;
    }

    //描画フラグがtrueならマップとメインキャラクターを描画
    if (drawFlg) {
        viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
        viewContext.drawImage(currentMapImg, viewCanvasHalfWidth-mainCharaPosX, viewCanvasHalfHeight-mainCharaPosY);
        drawMainCharacter();
        setTimeout("draw()", 3);
    } else {
        var timerId = setTimeout("draw()", 3);
        clearTimeout(timerId);
    }
}


