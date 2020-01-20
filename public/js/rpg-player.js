
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




//================================ 各種エレメント ===============================================//
//スクロールキャンバス
var scrollCanvas = document.getElementById('scrollCanvas');
var scrollContext = scrollCanvas.getContext("2d");
//表示キャンバス
var viewCanvas = document.getElementById('viewCanvas');
var viewContext = viewCanvas.getContext("2d");
// //スタートプロジェクト設定コンテナ
// var setStartProjectContainer = document.getElementById('setStartProjectContainer');
// //スタートポジション編集コンテナ
// var editStartPositionContainer = document.getElementById('editStartPositionContainer');
// //スタートポジション表示
// var startPos = document.getElementById('startPos');
// //スタートポジション設定
// var saveStartPos = document.getElementById('saveStartPos');
// //スタートポジション設定ストップ
// var stopEditStartPos = document.getElementById('stopEditStartPos');
// //現在マップキャンバス
// var currentMapCanvas = document.getElementById('currentMapCanvas');
// var currentMapContext = currentMapCanvas.getContext('2d');
// //プロジェクト名
// var projectName = document.getElementById('projectName');
// //プロジェクトのマップ
// var maps = document.getElementsByClassName('maps');
//マップ名
var mapNames = document.getElementsByClassName('mapNames');
// //マップタイプ名
// var mapTypeName = document.getElementById('mapTypeName');
// //イベントトリガー
// var eventTrigger = document.getElementById('eventTrigger');
// //マップイベント
// var mapEvent = document.getElementById('mapEvent');
// //イベント編集コンテナ
// var editEventContainer = document.getElementById('editEventContainer');
// //イベントリスト
// var eventLists = document.getElementById('eventLists');
// //イベント編集
// var editEvent = document.getElementById('editEvent');
// //マップ保存
// var saveMap = document.getElementById('saveMap');

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
        xhr.send(null);
        mapObj[mapNames[i].innerText] = JSON.parse(xhr.responseText);
    }
    //プロジェクトデータをロードする
    var url = 'projects/' + projectName.innerText + '/projectData.json';
    var xhr = new XMLHttpRequest();
    //同期処理なので、ここで毎回取得
    xhr.open('GET', url, false);
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
                    doEvents(res);
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
function doEvents(maptipObj) {
    Object.keys(maptipObj).forEach(function (key) {
        //console.log("キー : " + key + ", 値 : " + maptipObj[key]);  
        //イベントネームを取得
        var evtName = key.substr(2);
        switch (evtName) {
            case 'talk':
                var talkContent =  maptipObj[key]['talkContent'];
                doTalk(talkContent);
                //viewContext.drawImage(currentMapImg, viewCanvasHalfWidth-mainCharaPosX, viewCanvasHalfHeight-mainCharaPosY);
                break;
        }
    });
}

function doTalk(talkContent) {
    //drawを止める
    drawFlg = false;
    // var timerId = setTimeout("draw()", 1);
    // clearTimeout(timerId);

    //会話用ウィンドウスタート位置X
    //var talkWinStartX = mapTipLength;
    //会話用ウィンドウスタート位置Y
    //var talkWinStartY = viewCanvasHeight - (mapTipLength*5);
    //会話用ウィンドウ横幅
    //var talkWinWidth = viewCanvasWidth - (mapTipLength*2);
    //会話用ウィンドウ縦幅
    //var talkWinHeight = mapTipLength*4;
    //会話用フォント
    //var talkFont = "14px monospace";

    //会話ウィンドウを白でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
    //会話表示
    viewContext.fillStyle = 'white';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    var lineLength = 0;
    var lineMaxLength = talkWinWidth-20;
    var lines = [];
    var lineIndex = 0;
    lines[lineIndex] = '';

    talkContent = 'aaaaaaaauuuuuuuuuiiiiiiiiieeeeeeeehhhhhhhhhhbfjsbajbdjfbajdbfjabdjfbadfbjsbdfjsbfjabbdfajdbfjakdlfkjbakdjbflajbdklfabdklbflajdbfkajdbfkajdbfklbdajkfbdaklb';

    for (var i=0; i<talkContent.length; i++) {
        lines[lineIndex] += talkContent[i];
        lineLength = viewContext.measureText(lines[lineIndex]);
        if (lineLength.width > lineMaxLength-mapTipLength) {
            lineIndex++;
            lines[lineIndex] = '';
        }
    }

    var pages = [];
    var pageIndex = 0;
    pages[pageIndex] = [];
    for (var i=0; i<lines.length; i++) {
        if (i != 0 && i%3 == 0) {
            pageIndex++;
            pages[pageIndex] = [];
        }
        pages[pageIndex].push(lines[i]);
    }
    for (var i=0; i<pages.length; i++) {
        viewContext.fillStyle = 'white';
        for (var j=0; j<pages[i].length; j++) {
            viewContext.fillText(pages[i][j], talkWinStartX+2+10, talkWinStartY+2+10+(j*mapTipLength));
        }
        var test =0;
        viewContext.fillStyle = 'black';
        viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
        //会話表示、ページ分割まで完了、ページ毎にウエイト実装未
    }
}

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


