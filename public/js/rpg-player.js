
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
//現在選択中マップ繰り返しマップチップ
var mapRepeat = [];
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
//var talkFont = "32px monospace";
var talkFont = "27px PixelMplus10Regular";
//質問中フラグ
var questionFlg = false;
//選択中の質問選択肢(0：はい、1：いいえ)
var targetAnswer = 0;
// 質問ウィンドウ幅
var questionWinWidth = mapTipLength*4;
// 質問ウィンドウ高さ
var questionWinHeight = mapTipLength*3;
//質問ウィンドウスタート位置X
var questionWinStartX = (talkWinStartX + talkWinWidth) - questionWinWidth; //会話ウィンドウの終わりXから4マス左
//質問ウィンドウスタート位置Y
var questionWinStartY = talkWinStartY - questionWinHeight - 2; //会話ウィンドウの始まりYから３マスと2px上
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
//バトル中フラグ
var battleFlg = false;
//バトルエンドフラグ　バトル中に、バトルを終了するための判断フラグ
battleEndFlg = false;
//オプション選択フラグ
var selectBattleOptionFlg = false;
//対戦オプションインデックス
var targetBattleOption = 0;
//対戦オプション
var battleOptions = [
    "たたかう",
    "にげる",
]

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
    loadMapRepaet();
}

function sound() {
    document.getElementById("overSound").currentTime = 0;
    document.getElementById("overSound").play();
}

//マップ描画イベント。会話中などでscrollStateがfalseの時以外、基本的に常に3ミリ秒毎に動き続ける。
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

    //1マップチップ分スクロールが進んだら、変数を初期化して終了
    if (scrollPos == mapTipLength) {
        //各種変数初期化
        scrollState = false;
        scrollPos = 0;
        //トリガー進入のチェック
        var res = checkTrigger('進入', scrollDir);
        if (res != false) {
            maptipObj = res;
            //トリガー進入があればイベント実行
            doEvents();
        }
    }

    //描画フラグがtrueならマップとメインキャラクターを描画
    if (drawFlg) {
        viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
        viewContext.drawImage(currentMapImg, viewCanvasHalfWidth-mainCharaPosX, viewCanvasHalfHeight-mainCharaPosY);　//ベースマップの描画
        drawMapRepeat(); //繰り返しマップの描画
        drawMainCharacter(); //メインキャラの描画

        //テスト
        //drawOnotherCharacter(); //とりあえずobjの単純表示はできそう
        //drawlmr();
        drawGoRight();


        setTimeout("draw()", 3); //1000分の3ミリ秒毎に毎回描画を繰り返す
    } else {
        //drawFlgがfalseの場合はdrawの繰り返しを止める。再会するにはtrueを代入し、draw()をコールする。
        var timerId = setTimeout("draw()", 3);
        clearTimeout(timerId);
    }
}

/////////////////////////////////////////////////////////テスト
var imgL = document.getElementById("l");
var imgM = document.getElementById("m");
var imgR = document.getElementById("r");
var imgDr = document.getElementById("dr");
var imgDrr = document.getElementById("drr");
var imgDrl = document.getElementById("drl");
var imgDl = document.getElementById("dl");
var imgDlr = document.getElementById("dlr");
var imgDll = document.getElementById("dll");

//オーキド博士みたいな、オブジェクトのみ移動するファンクション
//将来的には、以下のインプットで自動で流せるようにしたい
//①キャラクターの種類
//②進む方向
//③どのほど進むか（0も含む。方向を変えるため）。
//④スピード（これは固定でいくつか決めておいたほうか良いかな）
var indexD = 0; //imgAryDのインデックス用
var posXD = 0;  //X方向の何マス目にいるかの数字
var wentPx = 0; //進んだピクセル
var count = 0   //進むスピードを変化させるための数字。
var imgAryD = [imgDr, '進む', '進む', '進む', '進む', imgDr, '進む', imgDr];
var imgAryDr = [imgDrr, imgDrl];
var leg = 0;
//var imgAryD = [imgDr, imgDrl, imgDrr, imgDrl, imgDrr, imgDrl, imgDrr, imgDrl, imgDr];
function drawGoRight() {
    // 
    if (count % 3 == 0) {
        //drawの３回毎に移動する（一回毎だと早すぎた。逆に言えば、スピードはここで変えられる。）
        if (imgAryD[indexD] == imgDr) {
            //静止。
            viewContext.drawImage(imgDr,320+(posXD*mapTipLength), 96);
            wentPx++;
        } else {
            //動く。wentPx分追加して描画する。
            viewContext.drawImage(imgAryDr[leg%2],320+(posXD*mapTipLength+wentPx), 96);
            wentPx++;
        }

        if (wentPx == mapTipLength) {
            //1チップ分wentPxが増えたら
            if (imgAryD[indexD] != imgDr) {
                //現在のアイコンが、右向きの静止「以外」だったら（つまり進行中のアイコンだった場合のみ）
                posXD++; //一マス進んだことにする。
            }
            indexD++;
            wentPx = 0;
            leg++; 
        }   
    } else {
        //count3の時以外も表示だけはしないと、点滅みたいになっちゃう（３回に１回しか表示しないから）
        if (imgAryD[indexD] == imgDr) {
            //静止
            viewContext.drawImage(imgAryD[indexD],320+(posXD*mapTipLength), 96);
            //wentPx++;
        } else {
            viewContext.drawImage(imgAryDr[leg%2],320+(posXD*mapTipLength+wentPx), 96);
            //wentPx++;
        }
    }
    count++;
}
var switchCount = 0;
var switchCountMax = 100;
var switched = 0;
//var imgAry = [imgL, imgM, imgR];
var imgAry = [imgL, imgR];
var vImg = imgAry[0];
var index = 0;
function drawlmr() {
    viewContext.drawImage(imgAry[index], 32, 32);
    switchCount++;
    if (switchCount == switchCountMax) {
        index++;
        if (index == imgAry.length) index = 0;
        switchCount = 0;
    }
}
function drawOnotherCharacter() {
    //他きゃらの場所は決まっているものとする

    //とりあえず固定で表示するだけならこれ
    //viewContext.drawImage(mainCharaImg, viewCanvasHalfWidth-mainCharaPosX + 32, viewCanvasHalfHeight-mainCharaPosY + 32);
    
    //何か決まった間隔の繰り返しで行いたい時はかきのコード
    // viewContext.drawImage(mainCharaImg, viewCanvasHalfWidth-mainCharaPosX + 32, viewCanvasHalfHeight-mainCharaPosY + 32 + (switched * 32));
    // switchCount++;
    // if (switchCount == switchCountMax) {
    //     switched++;
    //     switchCount = 0;
    // }

        //イメージの繰り返ししたい時はこれ（横流し）
        viewContext.drawImage(mainCharaImg, 0+shiftX, 0, 32-shiftX, 32, viewCanvasHalfWidth-mainCharaPosX + 32, viewCanvasHalfHeight-mainCharaPosY + 32, 32-shiftX, 32);//なんか最後の引数dxがよくわからんけどできた
        viewContext.drawImage(mainCharaImg, 0, 0, shiftX, 32, viewCanvasHalfWidth-mainCharaPosX + 32+32-shiftX, viewCanvasHalfHeight-mainCharaPosY + 32, shiftX, 32);   //なんか最後の引数dxがよくわからんけどできた
         if (doing == doNum) {
            shiftX++;
            if (shiftX == shiftCountMax) {
                shiftX = 0;
            }
            doing = 0;
        }
        doing++;
}
/////////////////////////////////////////////////////////テスト

//海のような、繰り返して動いているマップチップを描画する
//マップチップタイプ6（マップ繰り返し）のマップチップを繰り返し描画する
//マップイメージから、該当の座標部分のみ描画する。
var shiftX = 0;                     //横に動くpx
var shiftCountMax = mapTipLength;   //横に動くpxのMax。まあ１マップ分なので、マップチップレングスでもいいんだけど。
var doing = 0;                      //doNumと合わせて使用する。duNumは横流しの早さを決める数字。小さくすると、速くなる。
var doNum = 30;                     //横流しの早さを決める。
function drawMapRepeat() {
    //var aryX = [1,3,5,7,9];
    //var aryY = [1,4,7,10,13];
    //var dummy = document.getElementById("dummy");
    // mapRepeat = [[1,3],[3,5],[6,9],[8,10],[13,15],]
    //for (var i=0; i<aryX.length; i++) {
    for (var i=0; i<mapRepeat.length; i++) {
        //イメージの繰り返ししたい時はこれ（横流し）テストコード
        //viewContext.drawImage(dummy, 0+shiftX, 0, 32-shiftX, 32, viewCanvasHalfWidth-mainCharaPosX + (32*aryX[i]),        viewCanvasHalfHeight-mainCharaPosY + (32*aryY[i]), 32-shiftX, 32);//なんか最後の引数dxがよくわからんけどできた
        //viewContext.drawImage(dummy, 0,        0, shiftX,    32, viewCanvasHalfWidth-mainCharaPosX + (32*aryX[i]+mapTipLength)-shiftX, viewCanvasHalfHeight-mainCharaPosY + (32*aryY[i]), shiftX,    32);   //なんか最後の引数dxがよくわからんけどできた
        viewContext.drawImage(currentMapImg, mapRepeat[i][0]*mapTipLength+shiftX, mapRepeat[i][1]*mapTipLength, 32-shiftX, 32, viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength),                     viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), 32-shiftX, 32);//なんか最後の引数dxがよくわからんけどできた
        viewContext.drawImage(currentMapImg, mapRepeat[i][0]*mapTipLength,        mapRepeat[i][1]*mapTipLength, shiftX,    32, viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength+mapTipLength)-shiftX, viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), shiftX,    32);   //なんか最後の引数dxがよくわからんけどできた
        if (doing == doNum) {
            shiftX++;
            if (shiftX == shiftCountMax) {
                shiftX = 0;
            }
            doing = 0;
        }
    }
    if (mapRepeat.length != 0) doing++; //マップリピートが0の場合、無限に増えていくのを防ぐためにこういう風に書いている。
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
        //質問の時
        } else if (questionFlg) {
            switch (evt.keyCode) {
                case 38: //上
                    //カーソルを上に
                    targetAnswer = 0; //はいを選択
                    showYesNo(targetAnswer);
                break;
                case 40: //下
                    //カーソルを下に
                    targetAnswer = 1; //いいえを選択
                    showYesNo(targetAnswer);
                break;
                case 65: //Aボタン
                    //はいいいえを選んだ処理、質問イベントを終了する
                    questionFlg = false; //質問フラグを戻す
                    //描画を元に戻す（会話ウィンドウ、質問ウィンドウをクリア）
                    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
                    viewContext.drawImage(currentMapImg, viewCanvasHalfWidth-mainCharaPosX, viewCanvasHalfHeight-mainCharaPosY);
                    drawMainCharacter();
                    if (eventIndex+1 != events.length) {
                        //次のイベントがあったら次のイベント呼び出し
                        //はいいいえの結果は引数に与えない、呼び出し先で変数targetAnswerを参照する
                        eventIndex++;
                        doEvents();
                    } else {
                        eventIndex = 0;
                        drawFlg = true;
                        draw(); //再描画開始
                    }
                    break;
                default:
                    //上記以外のキーは受け付けない
                    return;
                    break;
            }

        //バトルの時
        } else if (battleFlg) {
            //バトルオプション選択時
            if (selectBattleOptionFlg) {
                switch (evt.keyCode) {
                    case 38: //上
                        //カーソルを上に
                        if (targetBattleOption != 0) {
                            targetBattleOption--;
                            showBattleOptions();
                        }
                    break;
                    case 40: //下
                        //カーソルを下に
                        if (targetBattleOption != battleOptions.length-1) {
                            targetBattleOption++;
                            showBattleOptions();
                        }
                    break;
                    case 65: //Aボタン
                        switch (targetBattleOption) {
                            case 0: //たたかう
                                
                            break;
                            case 1: //逃げる
                                //battleFlg = false;
                                selectBattleOptionFlg = false;
                                battleEndFlg = true;
                                doTalk("逃げる〜〜〜〜！！");
                            break;
                            default:
                            break;
                        }
                        break;
                    default:
                        //上記以外のキーは受け付けない
                        return;
                        break;
                }
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
            if (currrentMapObj[nextCellY][nextCellX].hasOwnProperty('pass') == false) {
                if ( maptiptype != 3) return false;
            }
            break;
        case 'up':  
            //マップ外でないかチェック 
            if (mainCharaPosY == 0) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength-1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (currrentMapObj[nextCellY][nextCellX].hasOwnProperty('pass') == false) {
                if ( maptiptype != 3) return false;
            }
            break;
        case 'right':  
            //マップ外でないかチェック 
            if (mainCharaPosX+mapTipLength == currentMapImgWidth) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength;
            var nextCellX = mainCharaPosX/mapTipLength+1;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (currrentMapObj[nextCellY][nextCellX].hasOwnProperty('pass') == false) {
                if ( maptiptype != 3) return false;
            }
            break;
        case 'down':
            //マップ外でないかチェック 
            if (mainCharaPosY+mapTipLength == currentMapImgHeight) return false;
            //通りぬけかどうかチェック
            var nextCellY = mainCharaPosY/mapTipLength+1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var maptiptype = currrentMapObj[nextCellY][nextCellX]['maptipType'];
            if (currrentMapObj[nextCellY][nextCellX].hasOwnProperty('pass') == false) {
                if ( maptiptype != 3) return false;
            }
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
                    //トリガーAボタンどうかチェック
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
                    //トリガーAボタンどうかチェック
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
                    //トリガーAボタンどうかチェック
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
                    //トリガーAボタンどうかチェック
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

        case '進入':
                //トリガー進入かどうかチェック
                var nextCellY = mainCharaPosY/mapTipLength;
                var nextCellX = mainCharaPosX/mapTipLength;
                var nextCell = currrentMapObj[nextCellY][nextCellX];
                if(nextCell.hasOwnProperty('trigger')) {
                    if(nextCell['trigger'] == '進入') {
                        return nextCell['events'];
                    } else {
                        return false;
                    }
                } else {
                    return false;
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
    var index = evtFullName.indexOf('_');
    var evtName = evtFullName.substr(index+1);
    switch (evtName) {
        case 'talk':
            var talkContent =  maptipObj[evtFullName]['talkContent'];
            doTalk(talkContent);
        break;
        case 'question':
            var questionContent =  maptipObj[evtFullName]['questionContent'];
            doQuestion(questionContent);
        break;
        case 'transition':
            var trasitionDataObj =  maptipObj[evtFullName];
            doTransition(trasitionDataObj);
        break;
        case 'battle':
            var battleData =  maptipObj[evtFullName];
            doBattle(battleData);
        break;
    }
}

//バトル
function doBattle(battleData) {
    //drawを止める
    drawFlg = false;
    //バトル中にする
    battleFlg = true;
    //バトル画面を表示する
    showBattleScreen(battleData);
}

//バトル画面を表示する
function showBattleScreen(battleData) {
    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
    var chara1 =  battleData['chara1'];
    var chara2 =  battleData['chara2'];
    var chara3 =  battleData['chara3'];
    var charaGroup =  battleData['charaGroup'];
    var chara1Data = projectDataObj['characters'][chara1];
    var chara2Data = projectDataObj['characters'][chara2];
    var chara3Data = projectDataObj['characters'][chara3];

    //画面上部：敵キャラ情報表示（96）
    viewContext.fillStyle = 'white';
    viewContext.fillRect(0, 0, viewCanvasWidth, 96);
    viewContext.fillStyle = 'black';
    viewContext.fillRect(0, 0, 224, 96);
    viewContext.fillStyle = 'white';
    viewContext.fillRect(2, 2, 220, 92);
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    viewContext.fillText(chara1Data["chrName"], 10, 15); //キャラ名
    viewContext.fillText(chara1Data["HP"], 10, 55); //HP

    viewContext.fillStyle = 'black';
    viewContext.fillRect(256, 0, 224, 96);
    viewContext.fillStyle = 'white';
    viewContext.fillRect(258, 2, 220, 92);
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    viewContext.fillText(chara2Data["chrName"], 256+10, 15); //キャラ名
    viewContext.fillText(chara2Data["HP"], 256+10, 55); //HP

    viewContext.fillStyle = 'black';
    viewContext.fillRect(512, 0, 224, 96);
    viewContext.fillStyle = 'white';
    viewContext.fillRect(514, 2, 220, 92);
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    viewContext.fillText(chara3Data["chrName"], 512+10, 15); //キャラ名
    viewContext.fillText(chara3Data["HP"], 512+10, 55); //HP

    //画面真ん中：敵キャラ描画（224）
    viewContext.fillStyle = 'white';
    viewContext.fillRect(0, 96, viewCanvasWidth, 224);
    var charaGroup =  battleData['charaGroup'];
    var isBoss =  battleData['isBoss'];
    var chara1Img =  document.getElementById(chara1Data['chrImgName']);
    var chara2Img =  document.getElementById(chara2Data['chrImgName']);
    var chara3Img =  document.getElementById(chara3Data['chrImgName']);
    viewContext.drawImage(chara1Img, 0, 96);
    viewContext.drawImage(chara2Img, 256, 96);
    viewContext.drawImage(chara3Img, 512, 96);

    doTalk(charaGroup + "が現れた！！");
}

//画面遷移
function doTransition(trasitionDataObj) {
    //現在マップをクリア    
    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);

    //遷移先のマップ画像とマップオブジェクトを取得
    var trasitionMap = trasitionDataObj['transitionMap'];
    currentMapImg = document.getElementById(trasitionMap);
    currrentMapObj =  mapObj[trasitionMap];

    //遷移先マップを表示キャンバスに描画
    currentMapImgWidth = currentMapImg.naturalWidth;
    currentMapImgHeight = currentMapImg.naturalHeight;
    //viewContext.drawImage(currentMapImg,0,0);

    //スタートポジションをロード
    mainCharaPosX = trasitionDataObj['transitionX'] * mapTipLength;
    mainCharaPosY = trasitionDataObj['transitionY'] * mapTipLength;

    //メインキャラのディレクションをロード
    var transitionDirection = trasitionDataObj['transitionDirection'];
    switch (transitionDirection) {
        case 'left':
            mainCharaImg = mainCharaImgArray[0];
            break;
        case 'up':
            mainCharaImg = mainCharaImgArray[1];
            break;
        case 'right':
            mainCharaImg = mainCharaImgArray[2];
            break;
        case 'down':
            mainCharaImg = mainCharaImgArray[3];
            break;
    }

    // マップ繰り返しのロード
    loadMapRepaet();

    //遷移先で再描画開始
    //遷移前に描画を止めていない場合（進入での遷移）は、drawを呼ばない（呼ぶと二重に呼ばれてキャラの動きは倍速になる）
    if (!drawFlg) { //ここが重要
        eventIndex = 0; //イベントインデックスは、遷移するたびに0に戻す（次のマップチップに移るため）
        drawFlg = true;
        draw();
    }
}

function loadMapRepaet() {
    mapRepeat = [];
    for(let k in currrentMapObj) {
        //console.log(currrentMapObj[k]);
        for(let l in currrentMapObj[k]) {
            if (currrentMapObj[k][l]['maptipType'] == 6) {
                var aryXY = [l, k];
                mapRepeat.push(aryXY);
            }
        }
    }
    doing = 0; //初期化。重要。
}

// param1 : 会話内容
// param2 : イベントで設定されている場合true、質問などで会話を表示するために流用する場合はfalseを指定する
function doTalk(talkContent) {    
    //drawを止める
    drawFlg = false;
    //会話中にする
    talkFlg = true;
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
    //会話表示メタデータセット
    viewContext.fillStyle = 'black';
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
    showTalkContents();
}

function doQuestion(questionContent) {
    questionFlg = true;
    doTalk(questionContent);
}

function showYesNo(targetAnswerIndex) {
    //doTalk参考に背景表示実装
    //drawを止める
    drawFlg = false;
    //会話ウィンドウを白でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(questionWinStartX, questionWinStartY, questionWinWidth, questionWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(questionWinStartX+2, questionWinStartY+2, questionWinWidth-4, questionWinHeight-4);
    //会話表示メタデータセット
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    //はい、いいえ
    var yesNo = [
        "はい",
        "いいえ",
    ]
    // はいといいえを表示
    for (var i=0; i<2; i++) {
        //ページが持っている行の分会話を表示（行の折り返しの高さは最後の(i*mapTipLength)の部分）
        viewContext.fillText(yesNo[i], questionWinStartX+40, questionWinStartY+10+(i*mapTipLength));
    }
    //カーソル描画、上下とAボタンではいいいえを選択し、結果を返す
    targetAnswer = targetAnswerIndex; //1：はい、2：いいえ
    viewContext.fillStyle = 'black';
    viewContext.fillText('▶︎', questionWinStartX+5, questionWinStartY+10+(targetAnswerIndex*mapTipLength));
}

function showBattleOptions() {
    selectBattleOptionFlg = true;
    //doTalk参考に背景表示実装
    //drawを止める
    //drawFlg = false;
    //会話ウィンドウを白でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
    //会話表示メタデータセット
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    // オプションを表示
    for (var i=0; i<battleOptions.length; i++) {
        //ページが持っている行の分会話を表示（行の折り返しの高さは最後の(i*mapTipLength)の部分）
        viewContext.fillText(battleOptions[i], questionWinStartX, talkWinStartY+10+(i*mapTipLength));
    }
    //カーソル描画、上下とAボタンではいいいえを選択し、結果を返す
    //targetBattleOption = targetBattleOptionIndex; //1：はい、2：いいえ
    viewContext.fillStyle = 'black';
    viewContext.fillText('▶︎', questionWinStartX-30, talkWinStartY+10+(targetBattleOption*mapTipLength));   
}

//会話内容表示メソッド
function showTalkContents() {
    //現在のページの会話内容を表示（ページ毎に１〜複数行の会話内容を持っている）
    viewContext.fillStyle = 'black';
    var lineSpace = 0; //行間調整ようの変数
    //ページが持っている行の分会話を表示（行の折り返しの高さは最後の(i*mapTipLength)の部分）
    //行の分ループ（行は最高３ページで格納してある）
    for (var i=0; i<talkPages[talkPageIndex].length; i++) {
        if (i != 0) {
            lineSpace = 8;
        }
        //１文字ずつ描画（ちょっと遅らせる）。その時に音も出す。
        var slideX = ''; //１文字を描画するために、横にずらす分を加算していく変数
        for (var j=0; j<talkPages[talkPageIndex][i].length; j++) {
            var mSlideX = viewContext.measureText(slideX);
            viewContext.fillText(talkPages[talkPageIndex][i][j], talkWinStartX+mSlideX.width+2+10, talkWinStartY+2+10+(i*mapTipLength)+(i*lineSpace));
            //描画した文字の長さ分、スライド値を増やす
            slideX += talkPages[talkPageIndex][i][j];
            //一瞬待つ（いったん挫折！！時間ある時にしっかり取り組むとする、、）
            //sleep(100);
            //stop();
            // 5秒後にメッセージを表示
            //console.log('5秒経過しました！');

        }
        //行間リセット
        lineSpace = 0;
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

    // ビジーwaitを使う方法
    // function sleep(waitMsec) {
    //     var startMsec = new Date();
    //     // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    //     while (new Date() - startMsec < waitMsec);
    // }
}

async function stop() {
    //const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(20000);
}

// async function wait () {
//     let wait_promise = new Promise( resolve => { setTimeout( resolve, 5000 ) } );
//     await wait_promise;
// }

//会話待ち状態
function talkWait() {
    if (talkWaitFlg) {
        if (showTriangleFlg) {
            viewContext.fillStyle = 'black';
            viewContext.fillText('▼', talkWinStartX+talkWinWidth-mapTipLength-10, talkWinStartY+talkWinHeight-mapTipLength-10);
            showTriangleFlg = false;
        } else {
            viewContext.fillStyle = 'white';
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
        viewContext.fillStyle = 'white';
        viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
        //会話内容を表示
        showTalkContents();
    } else {
        //なかったら
        //会話イベント終了、次のイベントへ(フラグ等戻す)
        talkFlg = false; //トーク中フラグ
        talkLineLength = 0; //会話一行長さ
        talkLines = []; //会話行数
        talkLineIndex = 0; //会話行インデックス
        talkPages = []; //会話ページ
        talkPageIndex = 0; //会話ページインデックス
        if (battleFlg) {
            if (battleEndFlg) {
                targetBattleOption = 0;
                battleEndFlg = false;
                battleFlg = false;
                drawFlg = true;
                draw();
                if (eventIndex+1 != events.length) {
                    eventIndex++;
                    doEvents();
                } else {
                    eventIndex = 0;
                    //drawFlg = true;
                    //draw(); //再描画開始
                }
            } else {
                showBattleOptions(); //敵が現れた後にAボタン受付で開始
            }
        } else if (questionFlg) {
            var ret = showYesNo(0);
            return ret;

        } else if (eventIndex+1 != events.length) {
            //次のイベントがあったら
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