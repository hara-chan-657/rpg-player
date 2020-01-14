
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
//メインキャラ画像;
var mainCharaImg;
//メインキャラ現在位置X
var mainCharaPosX;
//メインキャラ現在位置Y
var mainCharaPosY;
//メインキャラ向き
var mainCharaDir;
//現在選択中マップ横
var currentMapImgWidth;
//現在選択中マップ縦
var currentMapImgHeight;


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
    mainCharaImg = new Image();
    mainCharaImg.src = '/rpg-player/public/image/mainCharacter.png';
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

    //表示キャンバスに描画
    currentMapImgWidth = currentMapImg.naturalWidth;
    //scrollCanvas.width = currentMapImgWidth;
    currentMapImgHeight = currentMapImg.naturalHeight;
    //scrollCanvas.height = currentMapImgHeight;
    //scrollContext.drawImage(currentMapImg,0,0);
    viewContext.drawImage(currentMapImg,0,0);

}

//メインキャラクターを表示する
function drawMainCharacter() {
    viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);
}

function keyDownHandler(evt) {
    console.log(evt.keyCode);
}

function keyUpHandler(evt) {    
    switch (evt.keyCode) {
        case 37: //左
            scrollDir = 'left';
            scrollState = true;
            break;

        case 38: //上
            scrollDir = 'up';
            scrollState = true;
            break;

        case 39: //右
            scrollDir = 'right';
            scrollState = true;
            break;

        case 40: //下
            scrollDir = 'down';
            scrollState = true;
            break;
    }
}

function draw() {
    switch (scrollState) {
        //非スクロール中
        case false:
            switch (scrollDir) {
                case 'right':

                    break;
            }
            break;
        
        //スクロール中
        case true:
            //スクロールポジションを更新
            scrollPos++;

            switch (scrollDir) {
                case 'left':   
                    mainCharaPosX++;
                    break;
                case 'up':   
                    mainCharaPosY++;
                    break;
                case 'right':   
                    mainCharaPosX--;
                    break;
                case 'down':   
                    mainCharaPosY--;
                    break;
            }
            break;
    }

    //1マップチップ分進んだら、変数を初期化して終了
    if (scrollPos == mapTipLength) {
        //各種変数初期化
        scrollState = false;
        scrollPos = 0;
    }

    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
    viewContext.drawImage(currentMapImg, mainCharaPosX-viewCanvasHalfWidth, mainCharaPosY-viewCanvasHalfHeight);
    drawMainCharacter();
    setTimeout("draw()", 3);
        
}


