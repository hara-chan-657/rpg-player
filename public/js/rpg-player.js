
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////　　以下プロパティ   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//================================ 各種変数 ===============================================//
//dummy
var dummy;
//１マップ大きさ
var mapTipLength = 32;
//マップ行数
var mapRowNum;
//マップ列数
var mapColNum;
//プロジェクトのマップオブジェクト用配列
var mapObj = [];
//プロジェクトのデータオブジェクト
var projectDataObj;
//現在選択中マップオブジェクト;
var currrentMapObj = null;
//現在選択中マップ名
var currrentMapName;
//描画開始位置X
var startViewX = 0;
//描画開始位置Y
var startViewY = 0;


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
    showStartProject();
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

//スタートプロジェクトを開く
function showStartProject() {
    //スタートプロジェクトの読み込み
    var startMap = projectDataObj['startMap'];
    var startMapImg = document.getElementById(startMap);

    //表示キャンバスに描画
    scrollCanvas.width = startMapImg.naturalWidth;
    scrollCanvas.height = startMapImg.naturalHeight;
    scrollContext.drawImage(startMapImg,0,0);
    viewContext.drawImage(scrollCanvas,0,0);

}

function keyDownHandler(evt) {
    console.log(evt.keyCode);
}

function keyUpHandler(evt) {
    //スクロールキャンバスから、表示枠の分だけ、1pxずつ表示していく
    //1マップ分スライドしたら、終わり
    
    var scrollDir;

    switch (evt.keyCode) {
        case 37: //左

            break;

        case 38: //上

            break;

        case 39: //右
            scrollDir = 'right';
            break;

        case 40: //下

            break;
    }

    var scrollState = false; 

    draw();

    function draw () {
        switch (scrollState) {
            case false:
                switch (scrollDir) {
                    case 'right':
    
                        break;
                }
                break;
            
            case true:

                break;
        }
    

        

        for (i=0; i<)
    }
}
