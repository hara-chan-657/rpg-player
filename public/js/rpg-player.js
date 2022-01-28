
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
//現在選択中マップキャラクターオブジェクト
var mapCharaObjects = [];
//現在選択中マップツールオブジェクト
var mapToolObjects = [];
//現在選択中マップ繰り返しマップチップ
var mapRepeat = [];
//現在選択中マップ交互マップチップ
var mapTurn = [];
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
//実行中イベントタイプ（マップイベントorオブジェクトイベント）
var doingEvtType = '';
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
//プロジェクトツール
var prjTools = new Object();
//ツールフラグ
var toolFlg = false;
//手持ちツール
var haveTools = [];
//リアクション画像配列
var reactionImgArray = [];
//道具ゲット時サウンドフラグ
var soundToolFlg = false;

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
//window.addEventListener('load', setDefault, false);
document.body.addEventListener('keydown', function(evt) {keyDownHandler(evt);}, false);
document.body.addEventListener('keyup', function(evt) {keyUpHandler(evt);}, false);
// for (var i=0; i<maps.length; i++) {
//  maps[i].addEventListener('click', function(evt) {setEditMap(evt);}, false);
// }
// currentMapCanvas.addEventListener('click', function(evt) {showMapTipData(evt);}, false);
// saveMap.addEventListener('click', saveMapToServer, false);

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////　　以下ファンクション   //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function playRpg() {
    setDefault();
}

//デフォルト値設定
function setDefault() {
    loadJsonToObj();
    loadProjectData();
    loadImages();
    loadPrjTools();
    setCanvas();
    showStartProject();
    draw();
    loadSpecialMapChips();
    //playBgm('map'); //マップのBGMを再生するにはコメントアウト
}


//マップ描画イベント。会話中などでscrollStateがfalseの時以外、基本的に常に5ミリ秒毎に動き続ける。
var drawSpeed = 5; //描画スピード
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
        enterFlg = false; //前回trueになっている可能性があるので、ここで初期化
        goBackFlg = false; //前回trueになっている可能性があるので、ここで初期化
        var res = checkTrigger('進入', scrollDir);
        if (res != false) {
            enterFlg = true; //進入チェックがOKなら、進入フラグをtrueにする
            maptipObj = res;
            //トリガー進入があればイベント実行
            doingEvtType = 'map';
            doEvents();
        }
    }

    if (finishDrawMoveFlg) {

        drawSpeed = 5;

        //次のイベントがあれば次のイベント
        finishDrawMoveFlg = false;
        drawMoveObjFlg = false;

        if (eventIndex+1 != events.length) {
            eventIndex++;
            doEvents();
        } else {
        //なければ通常通りのdraw()
            // drawFlg = true;
            eventIndex = 0; 
        }

    }

    //描画フラグがtrueならマップとオブジェクトとメインキャラクターを描画
    if (drawFlg) {
        drawCanvas() //キャンバスに描画する部分の関数をこの関数にまとめる（単に画面をリセットしたい場合など、この関数を呼べるようにするため）
        setTimeout("draw()", drawSpeed); //1000分の5ミリ秒毎に毎回描画を繰り返す
    } else {
        //drawFlgがfalseの場合はdrawの繰り返しを止める。再会するにはtrueを代入し、draw()をコールする。
        var timerId = setTimeout("draw()", drawSpeed);
        clearTimeout(timerId);
    }
}

//キャンバスに描画する
function drawCanvas() {
    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);
    viewContext.drawImage(currentMapImg, viewCanvasHalfWidth-mainCharaPosX, viewCanvasHalfHeight-mainCharaPosY);　//ベースマップの描画
    drawMapRepeat(); //繰り返しマップの描画
    drawTurnChip(); //マップ交互の描画
    drawMoveObjFlg ? drawObjectsWithMove() : drawObjects();//オブジェクトの描画（キャラクター/ツール）
    drawMainCharacter(); //メインキャラの描画
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
                    //カーソルを上に (はいを選択)
                    showYesNo(0);
                break;
                case 40: //下
                    //カーソルを下に (いいえを選択)
                    showYesNo(1);
                break;
                case 65: //Aボタン
                    //はいいいえを選んだ処理、質問イベントを終了する
                    questionFlg = false; //質問フラグを戻す
                    //画面クリア
                    drawCanvas();
                    if (eventIndex+1 != events.length) {
                        //次のイベントがあったら次のイベント呼び出し
                        //はいいいえの結果は引数に与えない、呼び出し先で変数targetAnswerを参照する
                        eventIndex++;
                        if(doingEvtType == 'map') {
                            doEvents();
                        } else {
                            doObjectEvents();
                        }
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
                                //

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

        //道具の時
        } else if (toolFlg) {
            //ツールウィンドウオープン時
            var lineSpace = 32;
            switch (evt.keyCode) {
                case 38: //上
                    //上を押した時点で、▼カーソルは100%削除
                    viewContext.fillStyle = 'white';
                    viewContext.fillRect(200+2+10+450, (50+2)+((maxToolDispNum)*lineSpace), 35, 35);

                    //手持ちの最初になった場合
                    if (currrentToolIndex == 0) {
                        //前回カーソル表示部分クリア
                        viewContext.fillStyle = 'white';
                        viewContext.fillRect(200+2+10+450, (50+2)+(0*lineSpace), 35, 35);
                        //手持ちの最初なのでreturn
                        return;
                    }

                    //ツールのインデックスをずらす
                    currrentToolIndex--;

                    //手持ちの最初でない（上記条件） && カーソルが画面表示数の最初を指している && ずらした後のインデックスが、画面表示の最初の場合（＝も含む）
                    if (screenToolIndex == 0 && currrentToolIndex >= 0) {
                        var res = showHaveTools(currrentToolIndex);
                        viewContext.fillStyle = 'black';
                        if (currrentToolIndex != 0) {
                            //ずらした後のインデックスが手持ちの最初になった場合のみ、▼を表示しない（最初より大きい場合は、ここで▲を表示する）
                            viewContext.fillText('▲', 200+2+10+450, (50+2)+(0*lineSpace)); //450は適当な横ずらし用の数字
                        }
                        //最初の行にカーソルを当てる
                        viewContext.fillText('▶︎', 200+2+10, (50+2+5)+(0*lineSpace));

                    } else {
                    //カーソルを上に表示
                        viewContext.fillStyle = 'white';
                        viewContext.fillRect(200+2, 50+2, 50, 250-4);//前回カーソル表示部分クリア
                        //カーソルを一行上に表示
                        screenToolIndex--; //画面内▶︎indexを上にずらす
                        viewContext.fillStyle = 'black';
                        if (screenToolIndex == 0 && currrentToolIndex > 0) {
                            //ずらした後のインデックスが手持ちの最初になった場合のみ、▼を表示しない（最初より大きい場合は、ここで▲を表示する）
                            viewContext.fillText('▲', 200+2+10+450, (50+2)+(0*lineSpace)); //450は適当な横ずらし用の数字
                        }
                        viewContext.fillText('▶︎', 200+2+10, (50+2+5)+(screenToolIndex*lineSpace)); //表示位置を一行下げる（currrentToolIndexを使う）
                    }
                    //説明を表示
                    viewContext.fillStyle = 'white';
                    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4); //前回表示クリア
                    toolDescription(prjTools[haveTools[currrentToolIndex]]['description']);
                    //音を出す
                    sound('bgm/分類無し効果音/決定、ボタン押下3.mp3');

                break;
                case 40: //下
                    //下を押した時点で、▼カーソルは100%削除
                    viewContext.fillStyle = 'white';
                    viewContext.fillRect(200+2+10+450, (50+2)+(0*lineSpace), 35, 35);

                    //現在のインデックスをずらす前に、インデックスが手持ちの最大だったらreturn（画面表示数に関係なく）
                    if (currrentToolIndex == haveTools.length-1) return;
                    
                    //インデックスをずらす
                    currrentToolIndex++;

                    if (screenToolIndex == maxToolDispNum-1 && currrentToolIndex >= maxToolDispNum-1) {
                    //手持ちの最大でない && カーソルが画面表示数の最大を指している && ずらした後のインデックスが、画面表示上限数「以上」の場合（＝も含む）

                        var res = showHaveTools(currrentToolIndex - (maxToolDispNum-1));
                        viewContext.fillStyle = 'black';
                        if (currrentToolIndex != haveTools.length-1) {
                            //ずらした後のインデックスが手持ちの最大になった場合のみ、▼を表示しない（最大より大きい場合は、ここで▼を表示する）
                            viewContext.fillText('▼', 200+2+10+450, (50+2)+((maxToolDispNum)*lineSpace)); //450は適当な横ずらし用の数字
                        }
                        //最下行にカーソルを当てる
                        viewContext.fillText('▶︎', 200+2+10, (50+2+5)+((maxToolDispNum-1)*lineSpace));

                    } else {
                    //カーソルを下に表示
                        viewContext.fillStyle = 'white';
                        viewContext.fillRect(200+2, 50+2, 50, 250-4);//前回カーソル表示部分クリア
                        //カーソルを一行下に表示
                        screenToolIndex++; //画面内▶︎indexを下にずらす
                        viewContext.fillStyle = 'black';
                        if (screenToolIndex == maxToolDispNum-1 && currrentToolIndex < haveTools.length-1) {
                            //ずらした後のインデックスが手持ちの最大になった場合のみ、▼を表示しない（最大より大きい場合は、ここで▼を表示する）
                            viewContext.fillText('▼', 200+2+10+450, (50+2)+((maxToolDispNum)*lineSpace)); //450は適当な横ずらし用の数字
                        }
                        viewContext.fillText('▶︎', 200+2+10, (50+2+5)+(screenToolIndex*lineSpace)); //表示位置を一行下げる（currrentToolIndexを使う）
                    }
                    //説明を表示
                    viewContext.fillStyle = 'white';
                    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4); //前回表示クリア
                    toolDescription(prjTools[haveTools[currrentToolIndex]]['description']);
                    if (currrentToolIndex == haveTools.length-1) {
                        //手持ちの最後になった場合、▼を消す
                        viewContext.fillStyle = 'white';
                        viewContext.fillRect(200+2+10+450, (50+2)+((maxToolDispNum)*lineSpace), 35, 35);//前回カーソル表示部分クリア
                    }
                    //音を出す
                    sound('bgm/分類無し効果音/決定、ボタン押下3.mp3');
                break;
                case 84: //tキー
                    sound('bgm/分類無し効果音/キャンセル2.mp3');
                    toolFlg = false;
                    currrentToolIndex = 0; // ツールインデックスを0に戻す
                    eventIndex = 0;
                    drawFlg = true;
                    draw(); //再描画開始
                break;
                default:
                    //上記以外のキーは受け付けない
                return;
                break;
            }

        } else if(effectFlg) {
            switch (evt.keyCode) {
                case 65: //Aボタン
                    effectFlg = false;
                    //次のイベントorイベント終了
                    if (eventIndex+1 != events.length) {
                       //画面をクリア
                        drawCanvas();
                        eventIndex++;
                        if(doingEvtType == 'map') {
                            doEvents();
                        } else {
                            doObjectEvents();
                        }
                    } else {
                        eventIndex = 0;
                        drawFlg = true;
                        draw(); //再描画開始
                    }
                    break;
            }

        } else if(sceneFlg) {
            switch (evt.keyCode) {
                case 65: //Aボタン

                    var talk = sceneEvts[sceneEvtsIndex]['talkContent'];
                    if (sceneEvts[sceneEvtsIndex].hasOwnProperty('wipeSrc')) var wipe = sceneEvts[sceneEvtsIndex]['wipeSrc'];
                    doTalk(talk, wipe);

                    //揺れ（あったら）
                    if (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType")) {
                        //ゆらす
                        shake(sceneEvts[sceneEvtsIndex]['shakeType']);
                    }

                    //サウンド（あったら）
                    if (sceneEvts[sceneEvtsIndex].hasOwnProperty("sound")) {
                        sound(sceneEvts[sceneEvtsIndex]['sound']);
                    }

                    break;
            }

        } else {
            switch (evt.keyCode) {
                case 37: //左
                    scrollDir = 'left';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[8];
                    break;
        
                case 38: //上
                    scrollDir = 'up';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[3];
                    break;
        
                case 39: //右
                    scrollDir = 'right';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[6];
                    break;
        
                case 40: //下
                    scrollDir = 'down';
                    mainCharaDir = scrollDir;
                    mainCharaImg =  mainCharaImgArray[0];
                    break;
                
                case 65: //Aボタン
                    //オブジェクトのチェック（イベントより優先度高）
                    var res = checkObject(scrollDir);
                    if (res != false) {
                        maptipObj = res;
                        doingEvtType = 'obj';
                        doObjectEvents();
                    }                    

                    //トリガーAボタンのチェック
                    var res = checkTrigger('Aボタン', scrollDir);
                    if (res != false) {
                        maptipObj = res;
                        doingEvtType = 'evt';
                        doEvents();
                    }
                    return;
                    break;

                case 84: //Tボタン
                    //道具モード
                    drawFlg = false;
                    toolFlg = true;
                    var res = showHaveTools();
                    sound('bgm/分類無し効果音/キャンセル1.mp3');
                    if (res) viewContext.fillText('▶︎', 200+2+10, 50+2+5);
                    return;
                    break;

                case 69: //Eボタン

                    viewContext.fillStyle = 'red';
                    viewContext.fillRect(128, 25, 480, 320-32); //★これで（dot-editorの方は、480×288で画像を作成）
                    //会話ウィンドウを黒でクリア
                    viewContext.fillStyle = 'white';
                    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);


                    doTalk("test", "20210321121928_H96_W96_Nppp.png");
    
                default:
                    //上記以外のキーは受け付けない
                    return;
                    break;
            }
            if(checkStartMoveEvent()) {
                scrollState = true;
            } else {
                //一マス進めなかった場合
                //進入フラグを初期化する。
                enterFlg = false;
            }
        }
    }   
}

function sound(soundPath='') {
    if (soundPath == '') {
        //document.getElementById("overSound").currentTime = 0;
        //document.getElementById("overSound").play();
    } else {
        soundPath = '/sounds/' + soundPath;
        document.getElementById(soundPath).currentTime = 0;
        document.getElementById(soundPath).play();
    }
}

//BGMを流す
function playBgm(type) {

    switch(type) {
        case 'map':
            if (projectDataObj['mapBGM'].hasOwnProperty(currentMapImg.alt))
            sound(projectDataObj['mapBGM'][currentMapImg.alt]);
        break;
    }

}


//海のような、繰り返して動いているマップチップを描画する
//マップチップタイプ6（マップ繰り返し）のマップチップを繰り返し描画する
//マップイメージから、該当の座標部分のみ描画する。
var shiftX = 0;                     //横に動くpx
var shiftCountMax = mapTipLength;   //横に動くpxのMax。まあ１マップ分なので、マップチップレングスでもいいんだけど。
var doing = 0;                      //doNumと合わせて使用する。duNumは横流しの早さを決める数字。小さくすると、速くなる。
var doNum = 30;                     //横流しの早さを決める。
function drawMapRepeat() {
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

//ターンチップを描画する
var doing2 = 0;
var loopTime = 500;
function drawTurnChip() {
    // mapTurn => x, y, time, name
    for (var i=0; i<mapTurn.length; i++) {

        if (doing2 == loopTime-10) { // 999 / 333 = 3 (ほんとはマックスのインデックスは2であるべきなのに)のケースを防ぐため、-1
            doing2 = 0;
        }

        //画像インデックス
        var index = Math.floor(doing2/mapTurn[i][2]);

        var tmp = document.getElementById(mapTurn[i][3]+"_"+index);
        if (!tmp) {
            console.log(tmp);
        }

        viewContext.drawImage(tmp, (mapTurn[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapTurn[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));

    }
    if (mapTurn.length != 0) doing2++; //マップターンが0の場合、無限に増えていくのを防ぐためにこういう風に書いている。
}

//オブジェクトを描画する
var switchCountOfObj = 0;
function drawObjects() {
    //歩くアニメーションはここで実装する
    //scrollPos（32pxのカウント）のどっかのタイミングで、表示する画像を切り替える(方向ごとにケース分け)
    var index = 0;

    for (var i=0; i<mapCharaObjects.length; i++) {
        // XYODではsatoshiの名前を取得(2,objName)
        // ここでは、mapTurn[i][3]+"_"+indexで描画（indexの切り替えはメインキャラを参考（ただ、メインキャラと違って必ず画像があるとは限らない））

        switch (mapCharaObjects[i][3]) { //ディレクション（ランダム）
            case 3: //left  
                // 
                if(document.getElementById(mapCharaObjects[i][2]+"_9")!=null && document.getElementById(mapCharaObjects[i][2]+"_8")!=null) switchCountOfObj < 64 ? index = 9: index = 8;
                break;
            case 1: //up
                if(document.getElementById(mapCharaObjects[i][2]+"_5")!=null && document.getElementById(mapCharaObjects[i][2]+"_4")!=null) switchCountOfObj < 64 ? index = 5: index = 4;
                break;
            case 2: //right
                if(document.getElementById(mapCharaObjects[i][2]+"_7")!=null && document.getElementById(mapCharaObjects[i][2]+"_6")!=null) switchCountOfObj < 64 ? index = 7: index = 6;
                break;
            case 0: //down
                if(document.getElementById(mapCharaObjects[i][2]+"_2")!=null && document.getElementById(mapCharaObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                break;
            default :
               //if(document.getElementById(mapCharaObjects[i][2]+"_2")!=null && document.getElementById(mapCharaObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
            break;
        }

        //ディレクションはランダムで定期的に変える
        var tmp = Math.random();
        if (switchCountOfObj == 127 && tmp < 0.4) mapCharaObjects[i][3] = Math.floor(tmp*10);

        viewContext.drawImage(document.getElementById(mapCharaObjects[i][2]+"_"+index), (mapCharaObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapCharaObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
    }
    switchCountOfObj++;
    if (switchCountOfObj == 128) switchCountOfObj = 0;

    for (var i=0; i<mapToolObjects.length; i++) {
        //とりあえず固定で表示するだけならこれ
        viewContext.drawImage(document.getElementById(mapToolObjects[i][2]), (mapToolObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapToolObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
    }
}


var drawMoveObjFlg = false;
var mapCharaObjectsMove = [];
var maxOrderNUm = 0;
var targetChips = [];
var tmpCount = 1;
function doMove(moveData) {

    //ここで情報を受け取っておく
    //イベントキー
    //　チップn（チップ分）
    //　　　x
    //     y
    //     orders
    //　　　削除フラグ
    //　　　追加オブジェクト（ないかもしれない）
    //　移動スピード

    // drawSpeed = 9 遅い;　drawSpeed = ６　中くらい　;drawSpeed = ３　速い;
    drawSpeed = Number(moveData['drawSpeed']);

    // チップごとに情報を取り出して、配列に詰め直す
    var tmpIndex = 1;
    var moveChipNameKey = "chip_"+tmpIndex;
    if (moveData.hasOwnProperty(moveChipNameKey)) {
        do {
            var chipData = moveData[moveChipNameKey];
            var target = [];

            //fromX,Y
            target.push(Number(chipData['fromX']));
            target.push(Number(chipData['fromY']));
            
            //orders
            var charas = chipData['orders'].split('');
            var orders = [];
            for (var i=0; i<charas.length; i++) {
                orders.push(Number(charas[i]));
            }
            target.push(orders);

            //finishDelFlg
            var finishDelFlg = chipData['finishDelFlg'] == "true" ? true : false ;
            target.push(finishDelFlg);

            //newMoveObj
            if (chipData.hasOwnProperty('newMoveObj')) {
                target.push(chipData['newMoveObj']);
            }

            targetChips.push(target);

            tmpIndex++;
            moveChipNameKey = "chip_"+tmpIndex;

        } while(moveData.hasOwnProperty(moveChipNameKey));
    } 

    //フラグを変える
    //他のフラグとかは大丈夫か、、
    drawMoveObjFlg = true;

    //ターゲットチップでループ
    //①　一番多い命令の数を取得
    //②　追加オブジェクトを追加（次の既存のキャラオブジェクトでループで既存のように扱うため、このタイミングで事前に追加しておく）
    for (var j=0; j<targetChips.length; j++) {
        //一番多い命令の数を取得
        if (targetChips[j][2].length > maxOrderNUm) {
            maxOrderNUm = targetChips[j][2].length;
        }

        //追加オブジェクトがある場合、ここで追加
        //マップにオブジェクトが設定されていない場合
        if (!currrentMapObj[targetChips[j][1]][targetChips[j][0]].hasOwnProperty('object')) {
            //ムーブ対象チップが、追加オブジェクトを持っている場合
            if (targetChips[j][4] != null) {
                //追加オブジェクトを召喚
                currrentMapObj[targetChips[j][1]][targetChips[j][0]]['object'] = targetChips[j][4];
                var aryXYODMFI = [Number(targetChips[j][0]), Number(targetChips[j][1]), currrentMapObj[targetChips[j][1]][targetChips[j][0]]['object']['charaName'], 0, j, targetChips[j][3], targetChips[j][4]]; // x y キャラネーム ディレクション（0123:上下左右) ムーブフラグ デリートフラグ マップオブジェクト格納用
                mapCharaObjectsMove.push(aryXYODMFI.concat());
                var aryXYODMFI = [Number(targetChips[j][0]), Number(targetChips[j][1]), currrentMapObj[targetChips[j][1]][targetChips[j][0]]['object']['charaName'], 0, null, false, null]; // x y キャラネーム ディレクション（0123:上下左右) ムーブフラグ デリートフラグ マップオブジェクト格納用
                mapCharaObjects.push(aryXYODMFI.concat());
            } else {
                alert('追加オブジェクトがないよ　' + targetChips[j][0] + '：' + targetChips[j][1]);
            }
        }
    }

    //既存のキャラオブジェクトでループ
    //ターゲットチップとかぶる場合、移動対象とみなし、
    for (var i=0; i<mapCharaObjects.length; i++) {
        
        var incldFlg = false;
        var targetIndex = 0;
        var delFlg = false;
        var objInfo;
        //まずは無条件で、mapCharaObjectsMoveにデータコピー
        mapCharaObjectsMove[i] = mapCharaObjects[i].concat(); //concatで空の配列を繋げて新しい配列にしないと参照渡しになる。
        //ターゲットチップとかぶるキャラオブジェクトだった場合、移動対象のキャラオブジェクトなので
        //もとのマップ上のオブジェクトデータの削除、待避を行う必要がある
        for (var j=0; j<targetChips.length; j++) {
            if (mapCharaObjects[i][0] == targetChips[j][0] && mapCharaObjects[i][1] == targetChips[j][1]) {
                incldFlg = true; //既存のオブジェクトと判断
                targetIndex = j;
                delFlg = targetChips[j][3]; //移動し切った後に削除するかのフラグを取得
                //マップ情報のオブジェクトデータも移行する
                objInfo = currrentMapObj[mapCharaObjects[i][1]][mapCharaObjects[i][0]]['object']; //オブジェクト情報を避難、、どうするか
                //オブジェクト情報はこの時点で削除する
                delete currrentMapObj[mapCharaObjects[i][1]][mapCharaObjects[i][0]]['object'];
                break;
            }
        }
        if (incldFlg) {
            mapCharaObjectsMove[i][4] = targetIndex; //ターゲットチップ配列でのインデックス
            mapCharaObjectsMove[i][5] = delFlg; //移動した後削除するかのフラグ
            mapCharaObjectsMove[i][6] = objInfo; //もとのマップ上のオブジェクトデータ（待避）
        } else {
            //mapCharaObjectsMove[i][4] = false;
        }
    }

    if (!drawFlg) {
        //描画開始
        drawFlg = true;
        draw();
    }
}

//シーンを表示する
//まずは無条件で、カットシーン表示
//Aボタン押したら、sceneEvtの分だけ設定内容のイベント（トーク、シェイク、サウンド）を実行する。
//sceneEvtがなければ、Aボタンで即終了
var sceneFlg = false;
var sceneEvts = [];
var sceneEvtsIndex = 0;
var sceneImg = null;
function doScene(sceneData) {
    //console.log(sceneData);
    //drawを止める
    drawFlg = false;
    //シーン中にする
    sceneFlg = true;
    //バトル画面を表示する
    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);  
    sceneImg =  document.getElementById(sceneData['cutSceneSrc']);
    viewContext.drawImage(sceneImg, 128, 29);
    //シーンイベントを詰める
    var index = 1
    while(sceneData.hasOwnProperty('sceneEvt_'+index)) {
        sceneEvts.push(sceneData['sceneEvt_'+index]);
        index++;
    }
    //必要なら表示のタイミングで音を出す
    //sound();

    //あとはシーンイベントをAボタンで実行していく。
    //なくなったら、次のイベント

}


//キャラ移動の実態はこれ
//グローバルに格納済みのオブジェクト移動情報（mapCharaObjectsMove）をもとに描画する
//  基本はほとんど同じ（全部のイメージは揃っているものとする。ランダム描画はこの時だけは停止（歩きながら反対向いたりしたらきもいから）
//  対象のオブジェクトだった場合、1pxずつ、現在のorderIndexの方向にずらして描画する。
//  32px毎に、orderのindexをずらす（右とか左とか）
//  32px毎に、次のorderがあるか判定。なかったら、対象のオブジェクトから削除、削除フラグがあった場合画面からこのタイミングで削除する。
//  描画し切ったら、オブジェクトの位置を整えて、変数を初期化して、drawを止めて、フラグを戻して、次のイベント
var finishDrawMoveFlg = false;
var moveCounter = 0; // if moveCounter == mapTipLength みたいに使う
var orderIndex = 0; //命令の番号 [左　右　下]　みたいな
var movePxX = []; //X方向にずらす距離。キャラオブジェクト毎に保持する（movePxY[i]みたいに）
var movePxY = []; //同上
function drawObjectsWithMove() {
    for (var i=0; i<mapCharaObjectsMove.length; i++) {

        var targetIndex = 0;

        if (mapCharaObjectsMove[i][4] != null) {
            targetIndex = mapCharaObjectsMove[i][4];
            if (movePxX[i] == undefined) movePxX[i] = 0;
            if (movePxY[i] == undefined) movePxY[i] = 0;
            if (targetChips[targetIndex][2][orderIndex] == 0)  movePxY[i] += 1; //down
            if (targetChips[targetIndex][2][orderIndex] == 1)  movePxY[i] -= 1; //up
            if (targetChips[targetIndex][2][orderIndex] == 2)  movePxX[i] += 1; //right
            if (targetChips[targetIndex][2][orderIndex] == 3)  movePxX[i] -= 1; //left

        }

        var index = 0; //足踏みの左右のインデックス

        // 通常チップだった場合　　：通常のディレクションを使用（イベント発生直前の向きで固定される）
        // ムーブのチップだった場合：現在のorderIndexのディレクションを使用（歩く方向に向けたいから）
        //switch (mapCharaObjectsMove[i][4]==null ? mapCharaObjectsMove[i][3] : targetChips[targetIndex][2][orderIndex]) {
        var tmp = mapCharaObjectsMove[i][4]==null ? mapCharaObjectsMove[i][3] : targetChips[targetIndex][2][orderIndex];
        var tmp2 = 999;
        if (orderIndex != 0) tmp2 = tmp; //これはただの待避用
        if (tmp == 4) {//停止orderだったら
            tmp = targetChips[targetIndex][2][orderIndex-1];
            //31px進んだ時で
            if (moveCounter == mapTipLength-1) {
                //一個前のオーダーを、現時点のオーダーに引き継ぐ
                targetChips[targetIndex][2][orderIndex] = targetChips[targetIndex][2][orderIndex-1];
            }
        }

        switch (tmp) {
            case 3: //left  
                if(document.getElementById(mapCharaObjectsMove[i][2]+"_9")!=null && document.getElementById(mapCharaObjectsMove[i][2]+"_8")!=null) switchCountOfObj < 64 ? index = 9: index = 8;
                break;
            case 1: //up
                if(document.getElementById(mapCharaObjectsMove[i][2]+"_5")!=null && document.getElementById(mapCharaObjectsMove[i][2]+"_4")!=null) switchCountOfObj < 64 ? index = 5: index = 4;
                break;
            case 2: //right
                if(document.getElementById(mapCharaObjectsMove[i][2]+"_7")!=null && document.getElementById(mapCharaObjectsMove[i][2]+"_6")!=null) switchCountOfObj < 64 ? index = 7: index = 6;
                break;
            case 0: //down
                if(document.getElementById(mapCharaObjectsMove[i][2]+"_2")!=null && document.getElementById(mapCharaObjectsMove[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                break;
            default :
                // if(document.getElementById(mapCharaObjects[i][2]+"_2")!=null && document.getElementById(mapCharaObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                break;
        }

        if (mapCharaObjectsMove[i][4] != null) {
            viewContext.drawImage(document.getElementById(mapCharaObjectsMove[i][2]+"_"+index), (mapCharaObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX)+movePxX[i], (mapCharaObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)+movePxY[i]);
        } else {
            viewContext.drawImage(document.getElementById(mapCharaObjectsMove[i][2]+"_"+index), (mapCharaObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX),         (mapCharaObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)        );
        }

        //31px進んだ時で
        if ((moveCounter == mapTipLength-1) && (tmp2 != 4)){
            //ムーブチップだった場合
            if (mapCharaObjectsMove[i][4] != null) { //null or targetIndex
                // 次のインデックスのオーダーがなくて、かつ削除フラグがあった場合
                if (targetChips[targetIndex][2][orderIndex+1] == undefined && mapCharaObjectsMove[i][5] == true){

                    //mapCharaObjects（Move）から削除する
                    mapCharaObjectsMove.splice(i,1);
                    mapCharaObjects.splice(i,1);
                    i--;//インデックスをずらしてループを調整

                //次のインデックスのオーダーがある場合
                } else {

                    // 位置情報を整える
                    if (targetChips[targetIndex][2][orderIndex] == 0)  mapCharaObjectsMove[i][1] = mapCharaObjectsMove[i][1]+1; //down
                    if (targetChips[targetIndex][2][orderIndex] == 1)  mapCharaObjectsMove[i][1] = mapCharaObjectsMove[i][1]-1; //up
                    if (targetChips[targetIndex][2][orderIndex] == 2)  mapCharaObjectsMove[i][0] = mapCharaObjectsMove[i][0]+1; //right
                    if (targetChips[targetIndex][2][orderIndex] == 3)  mapCharaObjectsMove[i][0] = mapCharaObjectsMove[i][0]-1; //left

                    // 元の方もこのタイミングでやっちゃう
                    mapCharaObjects[i][0] = mapCharaObjectsMove[i][0]; //x
                    mapCharaObjects[i][1] = mapCharaObjectsMove[i][1]; //y

                }
            }
            movePxX[i] = 0; //31 ⇨ 0に戻す
            movePxY[i] = 0; //31 ⇨ 0に戻す
        }
    }

    for (var i=0; i<mapToolObjects.length; i++) {
        //とりあえず固定で表示するだけならこれ
        viewContext.drawImage(document.getElementById(mapToolObjects[i][2]), (mapToolObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapToolObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
    }

    switchCountOfObj++;
    if (switchCountOfObj == 128) switchCountOfObj = 0;

    moveCounter++;
    if (moveCounter == mapTipLength) {//32px進んだら
        moveCounter = 0;
        orderIndex++; //次のオーダーに切り替える
    }

    //命令が全部終わったら
    if (maxOrderNUm == orderIndex) {
        //mapCharaObjectsMove
        for (var i=0; i<mapCharaObjectsMove.length; i++) {
            //事前に保持しておいたオブジェクト情報[6]をマップに移行（ダメならここでアラートを出す。）
            // mapCharaObjectsMoveのインデックス6（待避用オブジェクト）が空でないとき（つまり、既存のオブジェクトを動かした場合） && 　mapCharaObjectsMoveの終着点にオブジェクトがある場合はエラー
            if (mapCharaObjectsMove[i][6] != null && currrentMapObj[mapCharaObjectsMove[i][1]][mapCharaObjectsMove[i][0]].hasOwnProperty('object')) { 
                alert("ダメでーす");
            } else {
            //既存のオブジェクトを動かした場合で、移動先にオブジェクトが存在しなければ置いてもよし。
                currrentMapObj[mapCharaObjectsMove[i][1]][mapCharaObjectsMove[i][0]]['object'] = mapCharaObjectsMove[i][6];
            }
        }

        //完了フラグを立てる
        finishDrawMoveFlg = true;
        //変数初期化
        maxOrderNUm = 0;
        orderIndex = 0;
        mapCharaObjectsMove = [];
        targetChips = [];
        movePxX = [];
        movePxY = [];

        //完了フラグはdraw()の途中で使われているよ
        //そこで次のイベントがあれば呼び出し
    }
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

//プロジェクトのツールをロードする
function loadPrjTools() {
    var toolsElement = document.getElementsByClassName('prjTools');
    var tools = Array.from(toolsElement);
    tools.forEach(function(tool) {
        prjTools[tool.id] = new Object();
        prjTools[tool.id]['name'] = tool.name;
        prjTools[tool.id]['description'] = tool.value;
    });
}

//画像をロードする
function loadImages() {
    //まずは主人公画像（デフォルト→参画パンツ、登録画像があれば上書きする）
    var mainCharaArray = [];
    mainCharaArray = [
        //三角パンツ
        '/rpg-player/public/image/mainCharacterDown.png',
        '/rpg-player/public/image/mainCharacterDown.png',
        '/rpg-player/public/image/mainCharacterDown.png',
        '/rpg-player/public/image/mainCharacterUp.png',
        '/rpg-player/public/image/mainCharacterUp.png',
        '/rpg-player/public/image/mainCharacterUp.png',
        '/rpg-player/public/image/mainCharacterRight.png',
        '/rpg-player/public/image/mainCharacterRight.png',
        '/rpg-player/public/image/mainCharacterLeft.png',
        '/rpg-player/public/image/mainCharacterLeft.png',
    ]
    for (i=0; i<mainCharaArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = mainCharaArray[i];
        mainCharaImgArray.push(imgObj);
    }
    //ここでprojectData.jsonの、mainCharaプロパティを取得、あれば三角パンツを上書きする
    //なければ、三角パンツをそのまま使う。
    if (projectDataObj.hasOwnProperty('mainChara')) {
            if (projectDataObj['mainChara']['f'] != "") mainCharaImgArray[0] = document.getElementById(projectDataObj['mainChara']['name']+"_0"); //f
            if (projectDataObj['mainChara']['fr'] != "") mainCharaImgArray[1] = document.getElementById(projectDataObj['mainChara']['name']+"_1"); //★ 前1 fr
            if (projectDataObj['mainChara']['fl'] != "") mainCharaImgArray[2] = document.getElementById(projectDataObj['mainChara']['name']+"_2"); //★ 前2 fl
            if (projectDataObj['mainChara']['b'] != "") mainCharaImgArray[3] = document.getElementById(projectDataObj['mainChara']['name']+"_3"); //b
            if (projectDataObj['mainChara']['br'] != "") mainCharaImgArray[4] = document.getElementById(projectDataObj['mainChara']['name']+"_4"); //★ 後ろ4 br
            if (projectDataObj['mainChara']['bl'] != "") mainCharaImgArray[5] = document.getElementById(projectDataObj['mainChara']['name']+"_5"); //★ 後ろ5 bl
            if (projectDataObj['mainChara']['r'] != "") mainCharaImgArray[6] = document.getElementById(projectDataObj['mainChara']['name']+"_6");   //★ 右6 r
            if (projectDataObj['mainChara']['rr'] != "") mainCharaImgArray[7] = document.getElementById(projectDataObj['mainChara']['name']+"_7"); //★ 右7 rr
            if (projectDataObj['mainChara']['l'] != "") mainCharaImgArray[8] = document.getElementById(projectDataObj['mainChara']['name']+"_8");   //★ 左8 l
            if (projectDataObj['mainChara']['ll'] != "") mainCharaImgArray[9] = document.getElementById(projectDataObj['mainChara']['name']+"_9"); //★ 左9 ll

    }
    //ロード時は下向きで表示
    mainCharaImg = mainCharaImgArray[0];


    //リアクション表示用画像
    reactionArray = [
        '/rpg-player/public/image/bikkuri.png',
        '/rpg-player/public/image/heart.png',
        '/rpg-player/public/image/ikari.png',
        '/rpg-player/public/image/ase.png',
    ]
    for (i=0; i<reactionArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = reactionArray[i];
        reactionImgArray.push(imgObj);
    }
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
var switchCountOfMain = 0;
function drawMainCharacter() {
    //歩くアニメーションはここで実装する
    //scrollPos（32pxのカウント）のどっかのタイミングで、表示する画像を切り替える(方向ごとにケース分け)
    switch (scrollDir) {
        case 'left': 
            switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[9]:mainCharaImg = mainCharaImgArray[8];
            break;
        case 'up':
            switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[5]:mainCharaImg = mainCharaImgArray[4];
            break;
        case 'right':
            switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[7]:mainCharaImg = mainCharaImgArray[6];
            break;
        case 'down':
            switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[2]:mainCharaImg = mainCharaImgArray[1];
            break;
        default :
            switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[2]:mainCharaImg = mainCharaImgArray[1];
         break;
    }
    //メインキャラを描画
    viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);
    switchCountOfMain++;
    if (switchCountOfMain == 128) switchCountOfMain = 0;

}

//上下の場合の左右切り替えフラグ
//var sideSwitchFlg = true;

//メインキャラクターを表示する
// function drawMainCharacter() {
//     //歩くアニメーションはここで実装する
//     //scrollPos（32pxのカウント）のどっかのタイミングで、表示する画像を切り替える(方向ごとにケース分け)
//     switch (scrollDir) {
//         case 'left': 
//             if (scrollPos == 3) mainCharaImg = mainCharaImgArray[9];
//             if (scrollPos == 25) mainCharaImg = mainCharaImgArray[8];
//             break;
//         case 'up':
//             //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
//             if (sideSwitchFlg) {
//                 if (scrollPos == 3) mainCharaImg = mainCharaImgArray[4];
//                 if (scrollPos == 25) mainCharaImg = mainCharaImgArray[3];   
//             } else {
//                 if (scrollPos == 3) mainCharaImg = mainCharaImgArray[5];
//                 if (scrollPos == 25) mainCharaImg = mainCharaImgArray[3];   
//             } 
//             break;
//         case 'right':
//             if (scrollPos == 3) mainCharaImg = mainCharaImgArray[7];
//             if (scrollPos == 25) mainCharaImg = mainCharaImgArray[6];
//             break;
//         case 'down':
//             //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
//             if (sideSwitchFlg) {
//                 if (scrollPos == 3) mainCharaImg = mainCharaImgArray[1];
//                 if (scrollPos == 25) mainCharaImg = mainCharaImgArray[0];   
//             } else {
//                 if (scrollPos == 3) mainCharaImg = mainCharaImgArray[2];
//                 if (scrollPos == 25) mainCharaImg = mainCharaImgArray[0];   
//             }  
//             break;
//     }
//     //上下の場合の左右切り替え
//     if (scrollPos == 31) sideSwitchFlg = sideSwitchFlg ? false : true;
//     //メインキャラを描画
//     viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);
// }


var currrentToolIndex = 0; //現在選択中のツールインデックス用の変数、ここでは使わず、キーイベント受付のタイミングで使用
var screenToolIndex = 0; //画面上の▶︎ののインデックス、ここでは使わず、キーイベント受付のタイミングで使用
var maxToolDispNum = 7; //画面に表示する道具のmaxの数
 
//道具画面を表示する
function showHaveTools(index = -1) { //index：画面に表示する道具のインデックス
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'black';
    viewContext.fillRect(200, 50, 500, 270);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(200+2, 50+2, 500-4, 270-4);

    viewContext.fillStyle = 'black';
    viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
    //会話ウィンドウを黒でクリア
    viewContext.fillStyle = 'white';
    viewContext.fillRect(talkWinStartX+2, talkWinStartY+2, talkWinWidth-4, talkWinHeight-4);
    //ここで手持ちの道具を表示するロジック
    //会話表示メタデータセット
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    var lineSpace = 32;
    if (haveTools.length == 0) {
        viewContext.fillText('道具はありません', 200+2+10, (50+2+3)+(0*lineSpace));
        return false;
    } else if (index < 0) {
        //最初はcurrrentToolIndexは必ず0で表示    
        for (var i=0; i<haveTools.length; i++) {
            if (i == maxToolDispNum) break; //手持ちのインデックスが画面表示数のmaxになったらbreak
            viewContext.fillStyle = 'black';
            viewContext.fillText(prjTools[haveTools[i]]['name'], 200+2+50, (50+2+5)+(i*lineSpace)); //50はカーソルの間隔よう
        }
        toolDescription(prjTools[haveTools[0]]['description']);
    } else {
        for (var i=0; i<haveTools.length; i++) {
            if (i == maxToolDispNum) break; //手持ちのインデックスが画面表示数のmaxになったらbreak
            viewContext.fillStyle = 'black';
            viewContext.fillText(prjTools[haveTools[i+index]]['name'], 200+2+50, (50+2+5)+(i*lineSpace)); //50はカーソルの間隔よう
        }
        toolDescription(prjTools[haveTools[0+index]]['description']);
    }

    return true;
}

//道具の説明文を表示する
function toolDescription(description) {
                    //道具の説明を、一行ずつに分割
                    //var talkContent = prjTools[currrentToolIndex]['description'];
                    var talkContent = description;
                    talkLines[talkLineIndex] = '';
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
                            talkLineLength = 0; //会話一行長さ
        talkLines = []; //会話行数
        talkLineIndex = 0; //会話行インデックス
        talkPages = []; //会話ページ
        talkPageIndex = 0; //会話ページインデックス
}

function dummy() {
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
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('turnChip')) return false;
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('object')) return false;
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
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('turnChip')) return false;
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('object')) return false;
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
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('turnChip')) return false;
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('object')) return false;
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
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('turnChip')) return false;
                if ( currrentMapObj[nextCellY][nextCellX].hasOwnProperty('object')) return false;
            }
            break;
    }
    return true;
}


//オブジェクトをチェックする（Aボタンのみ)
function checkObject(direction) {
    switch (direction) {
        case 'left':
            //マップ外でないかチェック
            if (mainCharaPosX == 0) return false;
            //オブジェクトがあるかチェック
            var nextCellY = mainCharaPosY/mapTipLength;
            var nextCellX = mainCharaPosX/mapTipLength-1;
            var nextCell = currrentMapObj[nextCellY][nextCellX];
            if(nextCell.hasOwnProperty('object')) {
                return nextCell['object'];
            } else {
                return false;
            }
            break;
        case 'up':  
            //マップ外でないかチェック 
            if (mainCharaPosY == 0) return false;
            //オブジェクトがあるかチェック
            var nextCellY = mainCharaPosY/mapTipLength-1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var nextCell = currrentMapObj[nextCellY][nextCellX];
            if(nextCell.hasOwnProperty('object')) {
                return nextCell['object'];
            } else {
                return false;
            }
            break;
        case 'right':  
            //マップ外でないかチェック 
            if (mainCharaPosX+mapTipLength == currentMapImgWidth) return false;
            //オブジェクトがあるかチェック
            var nextCellY = mainCharaPosY/mapTipLength;
            var nextCellX = mainCharaPosX/mapTipLength+1;
            var nextCell = currrentMapObj[nextCellY][nextCellX];
            if(nextCell.hasOwnProperty('object')) {
                return nextCell['object'];
            } else {
                return false;
            }
            break;
        case 'down':
            //マップ外でないかチェック 
            if (mainCharaPosY+mapTipLength == currentMapImgHeight) return false;
            //オブジェクトがあるかチェック
            var nextCellY = mainCharaPosY/mapTipLength+1;
            var nextCellX = mainCharaPosX/mapTipLength;
            var nextCell = currrentMapObj[nextCellY][nextCellX];
            if(nextCell.hasOwnProperty('object')) {
                return nextCell['object'];
            } else {
                return false;
            }
            break;
        default:
            return false;
            break;
    }
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

//マップチップに設定されたオブジェクトのイベントを実行する
function doObjectEvents() {
    //オブジェクトの種類を取得
    var objName = maptipObj['objName'];
    switch (objName) {
        case 'character':
            //イベントのキーとキーインデックスの取得
            events = Object.keys(maptipObj['events']);
            var evtFullName = events[eventIndex];
            var index = evtFullName.indexOf('_');
            var evtName = evtFullName.substr(index+1);
            switch (evtName) {
                case 'talk':
                    var talkContent =  maptipObj['events'][evtFullName]['talkContent'];
                    if (maptipObj['events'][evtFullName].hasOwnProperty('wipe')) {
                        var wipe =  maptipObj['events'][evtFullName]['wipe'];
                    }
                    doTalk(talkContent, wipe);
                break;
                case 'question':
                    var questionContent =  maptipObj['events'][evtFullName]['questionContent'];
                    if (maptipObj['events'][evtFullName].hasOwnProperty('wipe')) {
                        var wipe =  maptipObj['events'][evtFullName]['wipe'];
                    }
                    doQuestion(questionContent, wipe);
                break;
                case 'transition':
                    var trasitionDataObj =  maptipObj['events'][evtFullName];
                    doTransition(trasitionDataObj);
                break;
                case 'battle':
                    var battleData =  maptipObj['events'][evtFullName];
                    doBattle(battleData);
                break;
                case 'tool':
                    var toolData =  maptipObj['events'][evtFullName];
                    doTool(toolData);
                case 'effect':
                    var effectData =  maptipObj['events'][evtFullName];
                    doEffect(effectData);
                break;
                case 'move':
                    var moveData =  maptipObj['events'][evtFullName];
                    doMove(moveData);
                break;
                case 'scene':
                    var sceneData =  maptipObj['events'][evtFullName];
                    doScene(sceneData);
                break;
            }  
        break;

        case 'tool':
            // ツールの場合、イベントプロパティが設定されていないので、ここでよしなに作成
            events = ['99999999999999_talk']; //eventsを入れないと、doEventsでこけるからね
            haveTools.push(maptipObj['toolId']);
            var talkContent = "「"+ prjTools[maptipObj['toolId']]['name'] + "」を手に入れた！";
            //音を出す。
            soundToolFlg = true;
            doTalk(talkContent);
            mapCharaObjects.splice();

            //マップオブジェクトからオブジェクトを削除して、オブジェクトを再ロード
            var nextCellY;
            var nextCellX;
            switch (scrollDir) {
                case 'left':
                    nextCellY = mainCharaPosY/mapTipLength;
                    nextCellX = mainCharaPosX/mapTipLength-1;
                break;
                case 'up':  
                    //まずはマップオブジェクトから削除
                    nextCellY = mainCharaPosY/mapTipLength-1;
                    nextCellX = mainCharaPosX/mapTipLength;
                break;
                case 'right':  
                    nextCellY = mainCharaPosY/mapTipLength;
                    nextCellX = mainCharaPosX/mapTipLength+1;
                break;
                case 'down':
                    nextCellY = mainCharaPosY/mapTipLength+1;
                    nextCellX = mainCharaPosX/mapTipLength;
                break;
                default:
                break;
            }
            var nextCell = currrentMapObj[nextCellY][nextCellX];
            delete nextCell.object;
            loadSpecialMapChips();
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
            if (maptipObj[evtFullName].hasOwnProperty('wipe')) {
                var wipe =  maptipObj[evtFullName]['wipe'];
            }
            doTalk(talkContent, wipe);
        break;
        case 'question':
            var questionContent =  maptipObj[evtFullName]['questionContent'];
            if (maptipObj[evtFullName].hasOwnProperty('wipe')) {
                var wipe =  maptipObj[evtFullName]['wipe'];
            }
            doQuestion(questionContent, wipe);
        break;
        case 'transition':
            var trasitionDataObj =  maptipObj[evtFullName];
            doTransition(trasitionDataObj);
        break;
        case 'battle':
            var battleData =  maptipObj[evtFullName];
            doBattle(battleData);
        break;
        case 'tool':
            var toolData =  maptipObj[evtFullName];
            doTool(toolData);
        break;
        case 'effect':
            var effectData =  maptipObj[evtFullName];
            doEffect(effectData);
        break;
        case 'move':
            var moveData =  maptipObj[evtFullName];
            doMove(moveData);
        break;
        case 'scene':
            var sceneData =  maptipObj[evtFullName];
            doScene(sceneData);
        break;
    }
}


var effectFlg = false;
//エフェクト実行
function doEffect(effectData) {
    switch(effectData['type']){
        case 'shake':
            //drawを止める
            drawFlg = false;
            effectFlg = true;

            //cssはここのサイトから作成（https://mo2nabe.com/css-shake-elements/）
            shake(effectData['shakeType']);

            //音を出す
            var soundPath = effectData['sound'];
            //音源場所から、持ってきてならす（既存サンプル参考に）
            sound(soundPath);

        break;
        case 'reaction':
            //drawを止める
            drawFlg = false;
            effectFlg = true;
            //reactTypeのマークを表示する
            // '/rpg-player/public/image/bikkuri.png',
            // '/rpg-player/public/image/heart.png',
            // '/rpg-player/public/image/ikari.png',
            // '/rpg-player/public/image/ase.png',
            var reactImage;
            switch(effectData['reactType']) {
                case 'びっくり':
                reactImage = reactionImgArray[0];
                break;
                case 'ハート':
                reactImage = reactionImgArray[1];
                break;
                case 'いかり':
                reactImage = reactionImgArray[2];
                break;
                case '汗':
                reactImage = reactionImgArray[3];
                break;
            }

            viewContext.drawImage(reactImage,viewCanvasHalfWidth,viewCanvasHalfHeight-32);
            // window.setTimeout(function(){
            //     drawCanvas();
            // }, 2000);

            //音を出す
            var soundPath = effectData['sound'];
            //音源場所から、持ってきてならす（既存サンプル参考に）
            sound(soundPath);

        break;
        case 'animation':
        break;

    }
}

//揺れ専用ファンクション
function shake(type) {
    //ゆらす
    if (type == 'v') {
    //縦揺れ
        viewCanvas.classList.add("tateburu");
        window.setTimeout(function(){
            viewCanvas.classList.remove("tateburu");
        }, 1000);//縦揺れは短めに設定

    } else if (type == 'h') {
    //横揺れ
        viewCanvas.classList.add("yokoburu");
        window.setTimeout(function(){
            viewCanvas.classList.remove("yokoburu");
        }, 2000);//横揺れはちょっと長く

    } else {

    }
}

//道具
var enterFlg = false; // 進入があった時点でtrueにするフラグ。
var goBackFlg = false; //一歩戻るフラグ
function doTool(toolData){
    //doTalk呼び出せばOK?（コンテンツは、OKかNGか判断して、渡す）
    //後は手持ちに加えたり、削除したり
    //type(get,use), toolId, OKtalkContent, NGtalkContent, delToolFlg, wipe
    //typeを取得
    var toolType = toolData['type'];
    //typeで分岐
    if (toolType == 'get') {
        //もらい
        //手持ちに加えて、〇〇をもらった！と、ワイプだけ渡して、終わり
        haveTools.push(toolData['toolId']);
        var talkContent = "「"+ prjTools[toolData['toolId']]['name'] + "」を手に入れた！";
        //音を出す。
        soundToolFlg = true;
        doTalk(talkContent);
    } else {
        //使用
        //ツールを持ってるか判断。あればokコンテンツ、なければngコンテンツとワイプを渡す。
        haveFlg = false;
        var index = 0;
        for(var i=0; i<haveTools.length; i++) {
            if(haveTools[i] == toolData['toolId']) {
                haveFlg = true;
                break;  
            } 
            index++;            
        }

        var talkContent = '';
        if(haveFlg) {
            talkContent = toolData['OKtalkContent'];
        } else {
            talkContent = toolData['NGtalkContent'];
        }
        doTalk(talkContent, toolData['wipe']);

        //道具削除フラグを見て、手持ちから削除
        if (toolData['delToolFlg'] == 1){
            haveTools.splice(index, 1);
        }

        //使用判定がngだった場合、以降のイベントを行わない。
        if(!haveFlg) {
            //eventsから以降のイベントを削除
            events.splice(eventIndex+1);
            //トリガー進入で発生していた場合、一歩戻る
            if(enterFlg) {
                //ここで一歩戻るフラグを立てておく。
                goBackFlg = true;
                //進入フラグは初期化しておく
                enterFlg = false;
            }
        }
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
    viewContext.fillStyle = 'white';
    viewContext.fillRect(0, 96, viewCanvasWidth, viewCanvasHeight);
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

    // const sec = 3;

    // const wait = (sec) => {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(resolve, sec*1000);
    //         //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
    //     });
    // };

    // //1秒くらいかけてフェードアウト
    // async () => {
    //     try {
    //         await wait(sec);
    //             // ここに目的の処理を書きます。
    //         alert(sec + '秒たちました！');
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    //遷移専用の音を出す。
    sound('bgm/分類無し効果音/決定、ボタン押下5.mp3');

    // var imgObj = new Image();
    // imgObj.src = '/rpg-player/public/image/test.gif';

    viewContext.drawImage(imgObj,0,0);

    //0.7秒スリープさせる
    const d1 = new Date();
    while (true) {
        const d2 = new Date();
        if (d2 - d1 > 4200) {
            break;
        }
    }

    viewContext.globalAlpha = 1;

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
            mainCharaImg = mainCharaImgArray[8];
            break;
        case 'up':
            mainCharaImg = mainCharaImgArray[3];
            break;
        case 'right':
            mainCharaImg = mainCharaImgArray[6];
            break;
        case 'down':
            mainCharaImg = mainCharaImgArray[0];
            break;
    }

    // 特殊マップチップのロード
    loadSpecialMapChips();

    //遷移先で再描画開始
    //遷移前に描画を止めていない場合（進入での遷移）は、drawを呼ばない（呼ぶと二重に呼ばれてキャラの動きは倍速になる）
    if (!drawFlg) { //ここが重要
        eventIndex = 0; //イベントインデックスは、遷移するたびに0に戻す（次のマップチップに移るため）
        drawFlg = true;
        draw();
    }

    //※※遷移イベントは、必ずそのマップチップの最後のイベントに設定する
    // if (eventIndex+1 != events.length) {
    //     eventIndex++;
    //     if(doingEvtType == 'map') {
    //         doEvents();
    //     } else {
    //         doObjectEvents();
    //     }
    // } else {
    //     eventIndex = 0;
    //     //drawFlg = true;
    //     //draw(); //再描画開始
    // }

}

// 特殊マップチップのロード
// 初期表示と画面遷移時と、オブジェクト削除/追加時などにコールする
// ここでは必要なデータをつめるだけ。描画の時に、ここでつめたデータをもとに、描画する。
function loadSpecialMapChips() {
    mapRepeat = [];
    mapTurn = [];
    mapCharaObjects = [];
    mapToolObjects = [];
    for(let k in currrentMapObj) {
        //console.log(currrentMapObj[k]);
        for(let l in currrentMapObj[k]) {
            //繰り返しマップチップ
            if (currrentMapObj[k][l]['maptipType'] == 6) {
                var aryXY = [l, k];
                mapRepeat.push(aryXY);
            }

            //交互マップチップ
            if (currrentMapObj[k][l].hasOwnProperty('turnChip') || currrentMapObj[k][l].hasOwnProperty('turnChipPass')) {
                var obj;
                if (currrentMapObj[k][l].hasOwnProperty('turnChip')) {
                    obj = currrentMapObj[k][l]['turnChip'];
                } else {
                    obj = currrentMapObj[k][l]['turnChipPass'];
                }
                var imgNum = document.getElementsByClassName("turn_" + obj.name).length;
                var time = Math.floor(loopTime/imgNum); //6000/3 = 2000　みたいなことを想定 
                var aryXYTN = [l, k, time, obj.name];
                mapTurn.push(aryXYTN);
            }

            //キャラオブジェクト/ツールオブジェクト
            if (currrentMapObj[k][l].hasOwnProperty('object') == true) {
                
                switch (currrentMapObj[k][l]['object']['objName']) {
                    case 'character' :
                    var aryXYODMFI = [Number(l), Number(k), currrentMapObj[k][l]['object']['charaName'], 0, null, false, null]; // x y キャラネーム ディレクション（0123:上下左右) ムーブフラグ デリートフラグ マップオブジェクト格納用
                    mapCharaObjects.push(aryXYODMFI);
                    break;
                    case 'tool' :
                    var aryXYO = [l, k, currrentMapObj[k][l]['object']['imgName']];
                    mapToolObjects.push(aryXYO);
                    break;
                }
            }
        }
    }
    doing = 0; //初期化。重要。
}

// param1 : 会話内容
// param2 : イベントで設定されている場合true、質問などで会話を表示するために流用する場合はfalseを指定する
function doTalk(talkContent, wipe = '') {    
    //drawを止める
    drawFlg = false;
    //会話中にする
    talkFlg = true;

    //ワイプがあればワイプを表示
    if (wipe != '') {
        //viewContext.fillStyle = 'black';
        //viewContext.fillRect(talkWinStartX, talkWinStartY, talkWinWidth, talkWinHeight);
        //会話ウィンドウを黒でクリア
        viewContext.fillStyle = 'white';
        viewContext.fillRect(talkWinStartX, talkWinStartY-100, 100, 100);
        wipeImg = document.getElementById(wipe);
        viewContext.drawImage(wipeImg, talkWinStartX+2, talkWinStartY-100+2);
        //ワイプ名を表示
        var sPos = wipe.indexOf('_N')+2;
        var ePos = wipe.indexOf('.png');
        var nameRange = ePos - sPos;
        var wipeName = wipe.substr(sPos, nameRange);
        viewContext.font = talkFont; //文字の長さを測る前に文字の大きさを決定しないといけない
        var wipeNameLength = viewContext.measureText(wipeName);
        viewContext.fillStyle = 'white';
        viewContext.fillRect(talkWinStartX+100+2, talkWinStartY-35, wipeNameLength.width+6, 35);
        viewContext.fillStyle = 'black';
        viewContext.textBaseline = 'top';

        viewContext.fillText(wipeName, talkWinStartX+100+2+4, talkWinStartY-30);
    }

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

function doQuestion(questionContent, wipe = '') {
    questionFlg = true;
    doTalk(questionContent, wipe);
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

    //前回と違う選択をした場合音を出す
    if (targetAnswer != targetAnswerIndex) {
        sound('bgm/分類無し効果音/決定、ボタン押下3.mp3');
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

    //音を出す。
    if (soundToolFlg) {
        sound('bgm/分類無し効果音/決定、ボタン押下5.mp3');
        soundToolFlg = false;
    } else {
        sound('bgm/分類無し効果音/決定、ボタン押下35.mp3');
    }
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
                    if(doingEvtType == 'map') {
                        doEvents();
                    } else {
                        doObjectEvents();
                    }
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

        } else if (sceneFlg) {
            if (sceneEvtsIndex+1 != sceneEvts.length) {
            //次のシーンイベントがあれば実行

                //バトル画面を表示する
                viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);  
                viewContext.drawImage(sceneImg, 128, 29);

                sceneEvtsIndex++;
                var talk = sceneEvts[sceneEvtsIndex]['talkContent'];
                if (sceneEvts[sceneEvtsIndex].hasOwnProperty('wipeSrc')) var wipe = sceneEvts[sceneEvtsIndex]['wipeSrc'];
                doTalk(talk, wipe);

                //揺れ（あったら）
                if (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType")) {
                    var effectData = new Object();
                    effectData['type'] = 'shake';
                    effectData['shakeType'] = sceneEvts[sceneEvtsIndex]['shakeType'];
                    doEffect(effectData);
                }

                //サウンド（あったら）
                if (sceneEvts[sceneEvtsIndex].hasOwnProperty("sound")) {
                    sound(sceneEvts[sceneEvtsIndex]['sound']);
                }

            } else {
            //なければ次のイベント
                //必要なら終わりのタイミングで音を出す
                //sound();

                //シーン関係の変数を戻す
                sceneFlg = false;
                sceneEvts = [];
                sceneEvtsIndex = 0;
                sceneImg = null;
                drawFlg = true;
                draw(); //再描画開始
                if (eventIndex+1 != events.length) {
                    eventIndex++;
                    if(doingEvtType == 'map') {
                        doEvents();
                    } else {
                        doObjectEvents();
                    }
                } else {
                    eventIndex = 0;
                }
            }

        } else if (eventIndex+1 != events.length) {
            //次のイベントがあったら
            //画面をクリア
            drawCanvas();
            //次のイベント呼び出し
            eventIndex++;
            if(doingEvtType == 'map') {
                doEvents();
            } else {
                doObjectEvents();
            }
        } else {
            //イベントが無くなったら
            //イベントが無くなったタイミングで進入フラグ（ツール使用イベントで使用）を初期化
            enterFlg = false;
            //イベントインデックスを初期化
            eventIndex = 0;
            //イベントが無くなったタイミングで一歩戻るフラグがtrueの場合、一歩戻る指令を出す
            if(goBackFlg) {
                var KEvent = "";
                switch (scrollDir) {
                    //scrollDirと逆の方向に一マス進む
                    case 'left':   
                        KEvent = new KeyboardEvent( "keydown", { keyCode: 39 });
                        break;
                    case 'up':   
                        KEvent = new KeyboardEvent( "keydown", { keyCode: 40 });
                        break;
                    case 'right':   
                        KEvent = new KeyboardEvent( "keydown", { keyCode: 37 });
                        break;
                    case 'down':   
                        KEvent = new KeyboardEvent( "keydown", { keyCode: 38 });
                        break;
                }
                //一歩戻る
                document.body.dispatchEvent( KEvent );
                //フラグを初期化
                goBackFlg = false;
            }
            //再描画開始
            drawFlg = true;
            draw();
        }
    }
}

function openHiddenInfo() {
    var eles = document.getElementsByClassName('eachContainer');
    eles = Array.from(eles);
        eles.forEach(function(ele) {
        ele.style.display = 'block';
    });
}








