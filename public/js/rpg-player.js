
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
//現在選択中マップオブジェクト
var mapObjects = [];
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
//フォローキャラ画像配列;
var followCharaImgArray = [];
//フォローキャラ画像;
var followCharaImg;
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
var battleEndFlg = false;
//バトルオプション選択フラグ
var selectBattleOptionFlg = false;
//バトル中フラグ
var doingBattleFlg = false;
//バトルオーダーインデックス
var battleOrderIndex = 0;
//バトル進行インデックス
var battleProcedeIndex = 0;
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
//フラッシュアニメーション画像配列
var flashAnimationImgArray = [];
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
window.addEventListener('load', setCanvas, false);
document.body.addEventListener('keydown', function(evt) {keyDownHandler(evt);}, false);
document.body.addEventListener('keyup', function(evt) {keyUpHandler(evt);}, false);

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
    showStartProject();
    draw();
    loadSpecialMapChips();
}


//マップ描画イベント。会話中などでscrollStateがfalseの時以外、基本的に常に5ミリ秒毎に動き続ける。
var drawSpeedToChange = 5;
var drawSpeed = drawSpeedToChange; //描画スピード
function draw() {

    //トランジションの時はふんわり
    if (transitionFlg) {
        viewContext.globalAlpha += 0.03;
        if (viewContext.globalAlpha > 0.9) {
            transitionFlg = false;
            viewContext.globalAlpha = 1;
        }
    }

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

        drawSpeed = drawSpeedToChange;

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

    // 点滅が終わったらオブジェクト削除
    if (delObjdrawCnt == 150) { //150は割と適当な数字（点滅の期間）
        delObjdrawCnt = 0;
        //マップデータから削除
        var ylength = currrentMapObj[Number(mapObjects[delObjIndex][1])][Number(mapObjects[delObjIndex][0])]['object']['yCells'];
        var xlength = currrentMapObj[Number(mapObjects[delObjIndex][1])][Number(mapObjects[delObjIndex][0])]['object']['xCells'];
        for(var i=0; i<ylength; i++){
            for(var j=0; j<xlength; j++){
                delete currrentMapObj[Number(mapObjects[delObjIndex][1])+Number(i)][Number(mapObjects[delObjIndex][0]+Number(j))]['object'];
            }
        }

        //オブジェクトデータから削除
        mapObjects.splice(delObjIndex,1);
        delObjIndex = null;

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
        drawCanvas(); //キャンバスに描画する部分の関数をこの関数にまとめる（単に画面をリセットしたい場合など、この関数を呼べるようにするため）
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
    if (drawAnimationFlg) drawAnimationLoop();
    if (!hideMainCharaFlg) drawMainCharacterAndFollowCharacter(); //メインキャラとフォローキャラの描画
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

            //バトル中でのシーン（特別技）のとき
            //doTalkに流して以降の処理を行わない
            if (sceneFlg) {
                    var talk = sceneEvts[sceneEvtsIndex]['talkContent'];
                    if (sceneEvts[sceneEvtsIndex].hasOwnProperty('wipeSrc')) var wipe = sceneEvts[sceneEvtsIndex]['wipeSrc'];

                    //必殺技シーンのセリフ１（キャラのセリフ）
                    doTalk(talk, wipe);

                    //必殺技シーンのセリフ２用（〇〇を繰り出した！）
                    //sceneEvtsIndex++;
                return;
            }

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
                                selectBattleOptionFlg = false;
                                //たたかうモードに切り替え
                                doingBattleFlg = true;
                                //切り替え後はAボタンで進んでいくのみ

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

            if (doingBattleFlg) {
                //battleOrders[battleOrderIndex]でバトルを進めていく
                //バトルが終わったら（どっちか全滅or負け判定）で各フラグを戻してバトル終了

                switch(battleOrders[battleOrderIndex]['type']) {
                    case 'talk':
                        //トーク表示
                        if (battleOrders[battleOrderIndex]['wipe'] == "dummy") {
                            doTalk(battleOrders[battleOrderIndex]['content']);
                        } else {
                            doTalk(battleOrders[battleOrderIndex]['content'], battleOrders[battleOrderIndex]['wipe']);
                        }

                        //battleOrderIndex++するのは、talkの処理の最後で行う
                        battleOrderIndex++;
                        //あと画面リセット

                    break;
                    case 'skill':
                        //技を実行（適宜Aで進む
                        switch(battleProcedeIndex) {
                            //toの画面を開く（fromが1~3なら敵、4~6なら味方画面を開く）
                            case 0:
                                if (battleOrders[battleOrderIndex]['to'] == '1' ||
                                    battleOrders[battleOrderIndex]['to'] == '2' ||
                                    battleOrders[battleOrderIndex]['to'] == '3' ||
                                    battleOrders[battleOrderIndex]['to'] == '7'
                                ) {
                                    //敵キャラ表示
                                    battleTurn = 0;
                                    resetBattleScreen();

                                } else {
                                    //味方キャラ表示
                                    battleTurn = 1;
                                    resetBattleScreen();
                                }

                                //from-toを取得
                                //fromの場合、fromのキャラ名と、fromから出される技名を取得する
                                var skillKey = 'defaultSkillKey';
                                var skillType = 'defaultSkillType'
                                if (battleOrders[battleOrderIndex]['skillIndex']<5) {
                                    skillKey = 'skill' + battleOrders[battleOrderIndex]['skillIndex'];
                                    skillType = 'skill';
                                } else {
                                    if (battleOrders[battleOrderIndex]['skillIndex']==5) {
                                        skillKey = 'spSkill1';
                                    } else {
                                        skillKey = 'spSkill2';
                                    }
                                    skillType = 'spSkill';
                                }
                                switch(battleOrders[battleOrderIndex]['from']) {
                                    case '1':
                                        fromChara = chara1Data["chrName"];
                                        doSkillId = chara1Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                    case '2':
                                        fromChara = chara2Data["chrName"];
                                        doSkillId = chara2Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                    case '3':
                                        fromChara = chara3Data["chrName"];
                                        doSkillId = chara3Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                    case '4':
                                        fromChara = chara4Data["chrName"];
                                        doSkillId = chara4Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                    case '5':
                                        fromChara = chara5Data["chrName"];
                                        doSkillId = chara5Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                    case '6':
                                        fromChara = chara6Data["chrName"];
                                        doSkillId = chara6Data[skillKey];
                                        skillName = document.getElementById(skillType+'_'+doSkillId).innerText;
                                    break;
                                }
                                //toの場合、toのキャラ名のみ取得する
                                switch(battleOrders[battleOrderIndex]['to']) {
                                    case '1': toChara = chara1Data["chrName"]; break;
                                    case '2': toChara = chara2Data["chrName"]; break;
                                    case '3': toChara = chara3Data["chrName"]; break;
                                    case '4': toChara = chara4Data["chrName"]; break;
                                    case '5': toChara = chara5Data["chrName"]; break;
                                    case '6': toChara = chara6Data["chrName"]; break;
                                    case '7': toChara = "敵パーティ全員"; break;
                                    case '8': toChara = "味方パーティ全員"; break;
                                }

                                //スキルの実行
                                //　通常スキル「fromからtoへskillの攻撃!」
                                //　特別スキル　スキルのカットを表示（ちょっと動きつけたい）　→ トーク　→ 画面戻して揺れ
                                if (battleOrders[battleOrderIndex]['skillIndex'] == '1' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '2' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '3' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '4'
                                ) {
                                    //通常スキル
                                    doTalk(fromChara + "から" + toChara + "への" + skillName + "の攻撃！");

                                    //通常スキルの場合は二個上げる
                                    battleProcedeIndex++;
                                    battleProcedeIndex++;

                                } else {
                                    //特別スキル
                                    //スキルのシーンを表示
                                    var tmpSceneData = new Object();
                                    tmpSceneData['sceneEvt_1'] = new Object();
                                    tmpSceneData['sceneEvt_2'] = new Object();

                                    tmpSceneData['cutSceneSrc'] = document.getElementById('spSkill_'+doSkillId).title;
                                    tmpSceneData['sceneEvt_1']['talkContent'] = battleOrders[battleOrderIndex]['content'];
                                    tmpSceneData['sceneEvt_1']['wipeSrc'] = battleOrders[battleOrderIndex]['wipe'];
                                    tmpSceneData['sceneEvt_2']['talkContent'] = fromChara + "は" + skillName + "を繰り出した！";
                                    if (battleOrders[battleOrderIndex]['shake']=="1") {
                                        tmpSceneData['sceneEvt_2']['shakeType'] = "h"; //0か1か入ってる
                                        tmpSceneData['sceneEvt_2']['sound'] = 'effect/sub_nature/explosion_6.ogg'; //必殺技のいい感じの音に後で変える
                                    }

                                    //バトル中のシーンの順番の組み立てめんどくさいなあ、、
                                    //次、case 1まで作って流れチェック
                                    doScene(tmpSceneData);

                                    //特別スキルの場合は一個だけ上げる
                                    battleProcedeIndex++;
                                }

                            break;

                            case 1:
                            //特別スキルの後にワンクッション置く用、通常スキルの場合は通らない。
                                resetBattleScreen();
                                battleProcedeIndex++;
                            break;
                            case 2:
                                //ダメージ計算
                                switch(battleOrders[battleOrderIndex]['to']) {
                                    case '1':
                                        var tmpHP = chara1Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara1Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '2':
                                        var tmpHP = chara2Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara2Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '3':
                                        var tmpHP = chara3Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara3Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '4':
                                        var tmpHP = chara4Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara4Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '5':
                                        var tmpHP = chara5Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara5Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '6':
                                        var tmpHP = chara6Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                        chara6Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                    break;
                                    case '7':
                                        if (chara1Data != null && chara1Data["HP"] != 0) {
                                            var tmpHP = chara1Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara1Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                        if (chara2Data != null && chara2Data["HP"] != 0) {
                                            var tmpHP = chara2Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara2Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                        if (chara3Data != null && chara3Data["HP"] != 0) {
                                            var tmpHP = chara3Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara3Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                    break;
                                    case '8':
                                        if (chara4Data != null && chara4Data["HP"] != 0) {
                                            var tmpHP = chara4Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara4Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                        if (chara5Data != null && chara5Data["HP"] != 0) {
                                            var tmpHP = chara5Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara5Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                        if (chara6Data != null && chara6Data["HP"] != 0) {
                                            var tmpHP = chara6Data["HP"]-battleOrders[battleOrderIndex]['damage'];
                                            chara6Data["HP"] = tmpHP>0 ? tmpHP : 0;
                                        }
                                    break;
                                }

                                //画面リセット
                                resetBattleScreen();

                                //対象のキャラだけ一定時間点滅させて表示させる
                                switch(battleOrders[battleOrderIndex]['to']) {
                                    case '1': showBattleChara(1, true, chara1Data["chrName"], chara1Data["HP"], chara1Data['chrImgName'], true); break;
                                    case '2': showBattleChara(2, true, chara2Data["chrName"], chara2Data["HP"], chara2Data['chrImgName'], true); break;
                                    case '3': showBattleChara(3, true, chara3Data["chrName"], chara3Data["HP"], chara3Data['chrImgName'], true); break;
                                    case '4': showBattleChara(1, false, chara4Data["chrName"], chara4Data["HP"], chara4Data['chrImgName'], true); break;
                                    case '5': showBattleChara(2, false, chara5Data["chrName"], chara5Data["HP"], chara5Data['chrImgName'], true); break;
                                    case '6': showBattleChara(3, false, chara6Data["chrName"], chara6Data["HP"], chara6Data['chrImgName'], true); break;
                                    case '7':
                                        var chrNames  = [null, null, null];
                                        var chrHPs  = [null, null, null];
                                        var chrImgNames  = [null, null, null];
                                        if (chara1Data != null && !chara1KOflg) {
                                            chrNames[0] = chara1Data["chrName"];
                                            chrHPs[0] = chara1Data["HP"];
                                            chrImgNames[0] = chara1Data['chrImgName'];
                                        }
                                        if (chara2Data != null && !chara2KOflg) {
                                            chrNames[1] = chara2Data["chrName"];
                                            chrHPs[1] = chara2Data["HP"];
                                            chrImgNames[1] = chara2Data['chrImgName'];
                                        }
                                        if (chara3Data != null && !chara3KOflg) {
                                            chrNames[2] = chara3Data["chrName"];   
                                            chrHPs[2] = chara3Data["HP"];
                                            chrImgNames[2] = chara3Data['chrImgName'];
                                        }
                                        showBattleChara(4, true, chrNames, chrHPs, chrImgNames, true);
                                    break;
                                    case '8':
                                        var chrNames  = [null, null, null];
                                        var chrHPs  = [null, null, null];
                                        var chrImgNames  = [null, null, null];
                                        if (chara4Data != null && !chara4KOflg) {
                                            chrNames[0] = chara4Data["chrName"];
                                            chrHPs[0] = chara4Data["HP"];
                                            chrImgNames[0] = chara4Data['chrImgName'];
                                        }
                                        if (chara5Data != null && !chara5KOflg) {
                                            chrNames[1] = chara5Data["chrName"];
                                            chrHPs[1] = chara5Data["HP"];
                                            chrImgNames[1] = chara5Data['chrImgName'];
                                        }
                                        if (chara6Data != null && !chara6KOflg) {
                                            chrNames[2] = chara6Data["chrName"];   
                                            chrHPs[2] = chara6Data["HP"];
                                            chrImgNames[2] = chara6Data['chrImgName'];
                                        }
                                        showBattleChara(4, true, chrNames, chrHPs, chrImgNames, true);
                                    break;
                                }

                                if (battleOrders[battleOrderIndex]['skillIndex'] == '1' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '2' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '3' ||
                                    battleOrders[battleOrderIndex]['skillIndex'] == '4'
                                ) {
                                    //音（普通）
                                    sound('effect/sub_attack/hit_sound_8.wav');
                                } else {
                                    //音（特別）
                                    sound('effect/sub_attack/hit_sound_1.wav');
                                }

                                //実行中skill終わり、命令インデックスを上げる
                                battleOrderIndex++;
                                //バトル進行インデックス初期化
                                battleProcedeIndex = 0;

                            break;
                        }
                    break;
                    case 'lose':
                        //やむを得ない理由でバトルが終わる（勝負は一旦お預けだ的な）時に使う

                    break;
                }

                //最後のイベントだったら
                if (battleOrderIndex == Object.keys(battleOrders).length) {
                    //フラグを戻す
                    //バトル中フラグ
                    battleFlg = false;
                    //バトルエンドフラグ　バトル中に、バトルを終了するための判断フラグ
                    battleEndFlg = false;
                    //バトルオプション選択フラグ
                    selectBattleOptionFlg = false;
                    //バトル中フラグ
                    doingBattleFlg = false;
                    //バトルオーダーインデックス
                    battleOrderIndex = 0;
                    //対戦オプションインデックス
                    targetBattleOption = 0;
                    //バトルキャラデータ
                    chara1Data = null;
                    chara2Data = null;
                    chara3Data = null;
                    chara4Data = null;
                    chara5Data = null;
                    chara6Data = null;
                    //ボス判定
                    isBoss = "0";
                    //バトルターン
                    battleTurn = 0;
                    //KOフラグ
                    chara1KOflg = false;
                    chara2KOflg = false;
                    chara3KOflg = false;
                    chara4KOflg = false;
                    chara5KOflg = false;
                    chara6KOflg = false;
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
                    sound('effect/sub_system/select_5.ogg');

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
                    sound('effect/sub_system/select_5.ogg');
                break;
                case 84: //tキー
                    sound('effect/sub_dull_sound/dull_sound_6.wav');
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
                        effectFlg = false; //フラグはここで戻す
                        eventIndex = 0;
                        if (drawFlg) return; //描画中の場合はここでストップ（再描画で加速しない様に）
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
                    sound('effect/sub_system/select_5.ogg');
                    if (res) viewContext.fillText('▶︎', 200+2+10, 50+2+5);
                    return;
                    break;

                case 69: //Eボタン
                    var timerId = setTimeout("draw()", drawSpeed);
                    clearTimeout(timerId);
                    if (drawSpeedToChange == 5) {
                        drawSpeedToChange = 2;
                    } else if (drawSpeedToChange == 2) {
                        drawSpeedToChange = 5;
                    }
                    drawSpeed = drawSpeedToChange;
    
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
var shiftXY = 0;                     //横に動くpx
var shiftCountMax = mapTipLength;   //横に動くpxのMax。まあ１マップ分なので、マップチップレングスでもいいんだけど。
var doing = 0;                      //doNumと合わせて使用する。duNumは横流しの早さを決める数字。小さくすると、速くなる。
var doNum = 30;                     //横流しの早さを決める。
function drawMapRepeat() {
    for (var i=0; i<mapRepeat.length; i++) {
        switch(mapRepeat[i][2]) {
            case 6: //left
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength+shiftXY, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    32-shiftXY, //sw
                    32, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    32-shiftXY, //dw
                    32 //dh
                );//なんか最後の引数dxがよくわからんけどできた
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    shiftXY, //sd
                    32, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength+mapTipLength)-shiftXY, //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    shiftXY, //dw
                    32 //dh
                );//なんか最後の引数dxがよくわからんけどできた
            break;
            case 10: //right
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength+mapTipLength-shiftXY, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    shiftXY, //sw
                    32, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    shiftXY, //dw
                    32 //dh
                );//なんか最後の引数dxがよくわからんけどできた
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    32-shiftXY, //sd
                    32, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength) + shiftXY, //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    32-shiftXY, //dw
                    32 //dh
                );//なんか最後の引数dxがよくわからんけどできた
            break;
            case 11: //up
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength+shiftXY, //sy
                    32, //sw
                    32-shiftXY, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    32, //dw
                    32-shiftXY //dh
                );//なんか最後の引数dxがよくわからんけどできた
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    32, //sd
                    shiftXY, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength+mapTipLength)-shiftXY, //dy
                    32, //dw
                    shiftXY //dh
                );//なんか最後の引数dxがよくわからんけどできた
            break;
            case 12: //down
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength+mapTipLength-shiftXY, //sy
                    32, //sw
                    shiftXY, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength), //dy
                    32, //dw
                    shiftXY //dh
                );//なんか最後の引数dxがよくわからんけどできた
                viewContext.drawImage(
                    currentMapImg, //image
                    mapRepeat[i][0]*mapTipLength, //sx
                    mapRepeat[i][1]*mapTipLength, //sy
                    32, //sd
                    32-shiftXY, //sh
                    viewCanvasHalfWidth-mainCharaPosX + (mapRepeat[i][0]*mapTipLength), //dx
                    viewCanvasHalfHeight-mainCharaPosY + (mapRepeat[i][1]*mapTipLength) + shiftXY, //dy
                    32, //dw
                    32-shiftXY //dh
                );//なんか最後の引数dxがよくわからんけどできた
            break;
        }
        if (doing == doNum) {
            shiftXY++;
            if (shiftXY == shiftCountMax) {
                shiftXY = 0;
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


//アニメーション描画
//アニメーションフラグをonにして使うこと
//draw()中であることが前提

//メモ：発動は即座に発動（若干のタイムラグはsetTimeoutで入れてもいいかも）
//　　　発動後は待機モード、Aボタンで次のイベント発動

var doing3 = 0;
var animationLoopTime = 200; //適当な数字
var drawAnimationFlg = false;

function drawAnimation() {
    var soundPath = "";
    var shakeType = "";
    soundPath = globalEffectData['sound'];
    shakeType = globalEffectData['shakeType'];
    //sound
    if (soundPath != "") sound(soundPath);
    //shakeType
    if (shakeType != "") shake(shakeType);

    if (!drawFlg) {
        drawFlg = true;
        draw();
    }
}

function drawAnimationLoop() {

    //アニメタイプと、画像と、表示セル（複数可）と、揺れフラグと、サウンドを受け取る
    //globalEffectDataからデータを取得する
    var type = globalEffectData['animeType'];
    if (type == 'object') {
    //オブジェクトアニメーション
        var imageName = globalEffectData['objectAnimeType'];
        var imgNum = document.getElementsByClassName("turn_" + imageName).length;
        var time = Math.floor(animationLoopTime/imgNum); //6000/3 = 2000　みたいなことを想定 
        var cellsKey = Object.keys(globalEffectData['animationCells']);
        var cells = [];
        for (var i=0; i<cellsKey.length; i++) {
            //セル情報を配列に詰め直す
            cells[i] = [];
            cells[i][0] = globalEffectData['animationCells'][i]['x'];
            cells[i][1] = globalEffectData['animationCells'][i]['y'];
        }

        drawObjectAnimation(imageName, imgNum, cells, time);
    } else {
    //フラッシュアニメーション
    //オブジェクトアニメーションはできた、フラッシュアニメーションを歓声させて歓声
        var imageName = globalEffectData['flashAnimeType']; //キラキラとかダメージとか
        var cellsKey = Object.keys(globalEffectData['animationCells']);
        var cells = [];
        for (var i=0; i<cellsKey.length; i++) {
            //セル情報を配列に詰め直す
            cells[i] = [];
            cells[i][0] = globalEffectData['animationCells'][i]['x'];
            cells[i][1] = globalEffectData['animationCells'][i]['y'];
        }

        drawFlashAnimation(imageName, cells);
    }
    //このタイミングでAボタン待ちにする。Aボタンで次のイベントを実行できる

}

function drawObjectAnimation(imageName, imgNum, cells, time) {
    // mapTurn => x, y, time, name
    for (var i=0; i<imgNum; i++) {

        if (doing3 == animationLoopTime-10) { // 999 / 333 = 3 (ほんとはマックスのインデックスは2であるべきなのに)のケースを防ぐため、-1
            //オブジェクトアニメーション終了、戻す
            doing3 = 0;
            drawAnimationFlg = false;
            globalEffectData = null;
            //イベント終了だったら（オブジェクトアニメーション特有の分岐、普通はkeyEventHandlerでやるべきこと）
            if (eventIndex+1 == events.length) {
                effectFlg = false; //フラグはここで戻す
                eventIndex = 0;
                console.log("最後のイベント：オブジェクトアニメーション終了、動き始めれます。");
            }
            return;
        }

        //画像インデックス
        var index = Math.floor(doing3/time);
        var tmp = document.getElementById(imageName+"_"+index);
        if (!tmp) {
            console.log(tmp);
        }
        for (var i=0; i<cells.length; i++) {
            //現在のインデックスの画像を各セルに描画する
            viewContext.drawImage(tmp, cells[i][0]*mapTipLength+(viewCanvasHalfWidth-mainCharaPosX), cells[i][1]*mapTipLength+(viewCanvasHalfHeight-mainCharaPosY));
        }

    }
    if (imgNum != 0) doing3++; //imgNumが0の場合、無限に増えていくのを防ぐためにこういう風に書いている。
}

var doing4 = 0;
function drawFlashAnimation(imageName, cells) {

    if (doing4 == animationLoopTime-70) { //-xxは適当な微調整
        //フラッシュアニメーション終了、戻す
        doing4 = 0;
        drawAnimationFlg = false;
        globalEffectData = null;

        //イベント終了だったら（フラッシュアニメーション特有の分岐、普通はkeyEventHandlerでやるべきこと）
        if (eventIndex+1 == events.length) {
            effectFlg = false; //フラグはここで戻す
            eventIndex = 0;
            console.log("最後のイベント：フラッシュアニメーション終了、動き始めれます。");
        }

        return;
    }
    var tmp;
    switch(imageName) {
        case 'ダメージ':
            tmp = flashAnimationImgArray[0];
        break;
        case 'キラキラ':
        break;
    }

    if (Math.floor(doing4/10)%2 == 0) {
        for (var i=0; i<cells.length; i++) {
            //現在のインデックスの画像を各セルに描画する
            viewContext.drawImage(tmp, cells[i][0]*mapTipLength+(viewCanvasHalfWidth-mainCharaPosX), cells[i][1]*mapTipLength+(viewCanvasHalfHeight-mainCharaPosY));
        }
    }

    doing4++;    
}

//オブジェクトを描画する
var switchCountOfObj = 0;
var delObjdrawCnt = 0;
function drawObjects() {
    //歩くアニメーションはここで実装する
    //scrollPos（32pxのカウント）のどっかのタイミングで、表示する画像を切り替える(方向ごとにケース分け)
    var index = 0;

    for (var i=0; i<mapObjects.length; i++) {
        // XYODではsatoshiの名前を取得(2,objName)
        // ここでは、mapTurn[i][3]+"_"+indexで描画（indexの切り替えはメインキャラを参考（ただ、メインキャラと違って必ず画像があるとは限らない））

        // [0]x
        // [1]y
        // [2]キャラネーム
        // [3]ディレクショ（0123:上下左右)
        // [4]ムーブフラグ
        // [5]デリートフラグ
        // [6]マップオブジェクト格納用
        // [7]スライドフラグ
        // [8]固定向き
        // [9]オブジェクトネーム
        // var defaultObjData = [Number(l), Number(k), currrentMapObj[k][l]['object']['charaName'], 0, null, false, null, false, '', 'chara']; 
        if (mapObjects[i][9] == "character") {
        // キャラオブジェクト
            switch (mapObjects[i][3]) { //ディレクション（ランダム）
                case 3: //left  
                    if(document.getElementById(mapObjects[i][2]+"_9")!=null && document.getElementById(mapObjects[i][2]+"_8")!=null) switchCountOfObj < 64 ? index = 9: index = 8;
                break;
                case 1: //up
                    if(document.getElementById(mapObjects[i][2]+"_5")!=null && document.getElementById(mapObjects[i][2]+"_4")!=null) switchCountOfObj < 64 ? index = 5: index = 4;
                break;
                case 2: //right
                    if(document.getElementById(mapObjects[i][2]+"_7")!=null && document.getElementById(mapObjects[i][2]+"_6")!=null) switchCountOfObj < 64 ? index = 7: index = 6;
                break;
                case 0: //down ★ロード時の初期値はこれ、必ず下向きから始まる（なので下向きは必須の仕様）
                    if(document.getElementById(mapObjects[i][2]+"_2")!=null && document.getElementById(mapObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                break;
                default :
                    //if(document.getElementById(mapObjects[i][2]+"_2")!=null && document.getElementById(mapObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                break;
            }

            //ディレクションはランダムで定期的に変える
            var tmp = Math.random();
            if (switchCountOfObj == 127 && tmp < 0.4) mapObjects[i][3] = Math.floor(tmp*10); //01234：上下左右をランダムで格納

            if (i != delObjIndex) {
                //普通に描画する
                if (document.getElementById(mapObjects[i][2]+"_"+index) != null) {
                    //ディレクションの画像がある場合
                    viewContext.drawImage(document.getElementById(mapObjects[i][2]+"_"+index), (mapObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
                } else {
                    //ディレクションの画像がない場合、下向きを描画する（必須のディレクション）
                    var tmp = switchCountOfObj < 64 ? 2 : 1;
                    viewContext.drawImage(document.getElementById(mapObjects[i][2]+"_"+tmp), (mapObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
                }
            } else {
                //オブジェクト削除。点滅で描画する
                if (Math.floor(switchCountOfObj/10)%2 == 0) {
                    if (document.getElementById(mapObjects[i][2]+"_"+index) != null) {
                        viewContext.drawImage(document.getElementById(mapObjects[i][2]+"_"+index), (mapObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
                    } else {
                        var tmp = switchCountOfObj < 64 ? 2 : 1;
                        viewContext.drawImage(document.getElementById(mapObjects[i][2]+"_"+tmp), (mapObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
                    }
                }
                delObjdrawCnt++;
            }

        } else {
        //ツールオブジェクト
            viewContext.drawImage(document.getElementById(mapObjects[i][2]), (mapObjects[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX), (mapObjects[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY));
        }
    }
    switchCountOfObj++;
    if (switchCountOfObj == 128) switchCountOfObj = 0;
}


var drawMoveObjFlg = false;
var mapObjectsMove = [];
var maxOrderNUm = 0;
var targetChips = [];
var tmpCount = 1;
var startSoundFlg = true; //一回ならしたらfalseにする
function doMove(moveData) {

    //まずは開始サウンドを鳴らす
    if (startSoundFlg) {
        if (moveData['startSound'] != "") {
            sound(moveData['startSound']);
        }
        startSoundFlg = false;
    }

    //ここで情報を受け取っておく
    //イベントキー
    //　チップn（チップ分）
    //　　　x
    //     y
    //     orders
    //　　　削除フラグ
    //     スライドフラグ
    //     固定向き
    //　　　追加オブジェクト（ないかもしれない）
    //　　　移動後サウンド
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

            //fromX
            target.push(Number(chipData['fromX']));

            //fromY
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

            //slideFlg
            var slideFlg = chipData['slideFlg'] == "true" ? true : false ;
            target.push(slideFlg);

            //fixDir
            target.push(chipData['fixDir']);

            //newMoveObj
            if (chipData.hasOwnProperty('newMoveObj')) {
                target.push(chipData['newMoveObj']);
            } else {
                target.push(null);
            }

            //finishSound
            target.push(chipData['finishSound']);

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
            if (targetChips[j][6] != null) {
                //追加オブジェクトを召喚
                currrentMapObj[targetChips[j][1]][targetChips[j][0]]['object'] = targetChips[j][6];

                if (targetChips[j][6]['objName'] == "character") {
                //キャラクター
                    // [0]x
                    // [1]y
                    // [2]キャラネーム
                    // [3]ディレクショ（0123:上下左右)
                    // [4]ムーブフラグ
                    // [5]デリートフラグ
                    // [6]マップオブジェクト格納用
                    // [7]スライドフラグ
                    // [8]固定向き
                    // [9]オブジェクトネーム
                    // [10]移動後サウンド
                    var aryData = [
                        Number(targetChips[j] [0 ])
                        , Number(targetChips[j][1])
                        , targetChips[j][6]['charaName']
                        , 0
                        , j
                        , targetChips[j][3]
                        , targetChips[j][6]
                        , targetChips[j][4]
                        , targetChips[j][5]
                        , targetChips[j][6]['objName']
                        , targetChips[j][7]
                    ];
                    mapObjectsMove.push(aryData.concat());

                    var aryData2 = [
                        Number(targetChips[j][0])
                        , Number(targetChips[j][1])
                        , targetChips[j][6]['charaName']
                        , 0
                        , null
                        , false
                        , null
                        ,false
                        , ''
                        , 'character'
                    ];
                    mapObjects.push(aryData2.concat());
                } else {
                //ツール
                    var aryData = [
                        Number(targetChips[j] [0 ])
                        , Number(targetChips[j][1])
                        , targetChips[j][6]['imgName']
                        , 0
                        , j
                        , targetChips[j][3]
                        , targetChips[j][6]
                        , targetChips[j][4]
                        , targetChips[j][5]
                        , targetChips[j][6]['objName']
                        , targetChips[j][7]
                    ];
                    mapObjectsMove.push(aryData.concat());

                    var aryData2 = [
                        Number(targetChips[j][0])
                        , Number(targetChips[j][1])
                        , targetChips[j][6]['imgName']
                        , 0
                        , null
                        , false
                        , null
                        ,false
                        , ''
                        , 'tool'
                    ];
                    mapObjects.push(aryData2.concat());
                }
            } else {
                alert('追加オブジェクトがないよ　' + targetChips[j][0] + '：' + targetChips[j][1]);
            }
        }
    }

    //既存のキャラオブジェクトでループ
    //ターゲットチップとかぶる場合、移動対象とみなす
    for (var i=0; i<mapObjects.length; i++) {
        
        var incldFlg = false;
        var targetIndex = 0;
        var delFlg = false;
        var objInfo;
        var slideFlg = false;
        var fixDir = '';
        var objName;
        var finSound;
        //まずは無条件で、mapObjectsMoveにデータコピー
        mapObjectsMove[i] = mapObjects[i].concat(); //concatで空の配列を繋げて新しい配列にしないと参照渡しになる。
        //ターゲットチップとかぶるキャラオブジェクトだった場合、移動対象のキャラオブジェクトなので
        //もとのマップ上のオブジェクトデータの削除、待避を行う必要がある
        for (var j=0; j<targetChips.length; j++) {
            if (mapObjects[i][0] == targetChips[j][0] && mapObjects[i][1] == targetChips[j][1]) {
                incldFlg = true; //既存のオブジェクトと判断
                targetIndex = j;
                delFlg = targetChips[j][3]; //移動し切った後に削除するかのフラグを取得
                objInfo = currrentMapObj[mapObjects[i][1]][mapObjects[i][0]]['object']; //オブジェクト情報を避難、、どうするか
                slideFlg = targetChips[j][4]; //スライドフラグ
                fixDir = targetChips[j][5]; //固定向き
                objName = mapObjects[i][9] //オブジェクトタイプ
                finSound = targetChips[j][7] //移動後サウンド
                //オブジェクト情報はこの時点で削除する
                //データ範囲分実施
                var ylength = currrentMapObj[mapObjects[i][1]][mapObjects[i][0]]['object']['yCells'];
                var xlength = currrentMapObj[mapObjects[i][1]][mapObjects[i][0]]['object']['xCells'];
                for(var k=0; k<ylength; k++){
                    for(var l=0; l<xlength; l++){
                        delete currrentMapObj[Number(mapObjects[i][1])+Number(k)][Number(mapObjects[i][0])+Number(l)]['object'];
                    }
                }
                break;
            }
        }
        if (incldFlg) {
            mapObjectsMove[i][4] = targetIndex; //ターゲットチップ配列でのインデックス
            mapObjectsMove[i][5] = delFlg; //移動した後削除するかのフラグ
            mapObjectsMove[i][6] = objInfo; //もとのマップ上のオブジェクトデータ（待避）
            mapObjectsMove[i][7] = slideFlg; //スライドフラグ
            mapObjectsMove[i][8] = fixDir; //固定向き
            mapObjectsMove[i][9] = objName; //オブジェクトタイプ（character/tool)
            mapObjectsMove[i][10] = finSound; //移動後サウンド
        } else {
            //mapObjectsMove[i][4] = false;
        }
    }

    if (!drawFlg) {
        //描画開始
        drawFlg = true;
        draw();
    }
}

//moveの実態はこれ
//グローバルに格納済みのオブジェクト移動情報（mapObjectsMove）をもとに描画する
//  基本はほとんど同じ（全部のイメージは揃っているものとする。ランダム描画はこの時だけは停止（歩きながら反対向いたりしたらきもいから）
//  対象のオブジェクトだった場合、1pxずつ、現在のorderIndexの方向にずらして描画する。
//  32px毎に、orderのindexをずらす（右とか左とか）
//  32px毎に、次のorderがあるか判定。なかったら、対象のオブジェクトから削除、削除フラグがあった場合画面からこのタイミングで削除する。
//  描画し切ったら、オブジェクトの位置を整えて、変数を初期化して、drawを止めて、フラグを戻して、次のイベント
var finishDrawMoveFlg = false;
var moveCounter = 0; // if moveCounter == mapTipLength みたいに使う
var orderIndex = 0; //命令の番号 [左　右　下]　みたいな
var movePxX = []; //X方向にずらす距離。オブジェクト毎に保持する（movePxY[i]みたいに）
var movePxY = []; //同上
var scrollPosOfObj = 0;
var sideSwitchFlgOfObj = true;
function drawObjectsWithMove() {

    for (var i=0; i<mapObjectsMove.length; i++) {

        if (mapObjectsMove[i][4] != null) {
            targetIndex = mapObjectsMove[i][4];
            if (movePxX[i] == undefined) movePxX[i] = 0;
            if (movePxY[i] == undefined) movePxY[i] = 0;
            if (targetChips[targetIndex][2][orderIndex] == 0)  movePxY[i] += 1; //down
            if (targetChips[targetIndex][2][orderIndex] == 1)  movePxY[i] -= 1; //up
            if (targetChips[targetIndex][2][orderIndex] == 2)  movePxX[i] += 1; //right
            if (targetChips[targetIndex][2][orderIndex] == 3)  movePxX[i] -= 1; //left
        }

        if (mapObjectsMove[i][9]=="character") {
            //キャラクター
            var index = 0; //足踏みの左右のインデックス

            // 通常チップだった場合　　：通常のディレクションを使用（イベント発生直前の向きで固定される）
            // ムーブのチップだった場合：現在のorderIndexのディレクションを使用（歩く方向に向けたいから）
            var tmp = mapObjectsMove[i][4]==null ? mapObjectsMove[i][3] : targetChips[targetIndex][2][orderIndex];
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

            //固定向きがあったら設定
            if (mapObjectsMove[i][8] != '' && tmp != 4) {
                switch(mapObjectsMove[i][8]) {
                    case 'left':
                        tmp = 3;
                    break;
                    case 'up':
                        tmp = 1;
                    break;
                    case 'right':
                        tmp = 2;
                    break;
                    case 'down':
                        tmp = 0;
                    break;
                }
            }

            //ムーブチップだった場合 && 止まれの信号ではなかった場合
            if (mapObjectsMove[i][4] != null && tmp != 4) {
                switch (tmp) {
                    case 3:  //left  
                        if(document.getElementById(mapObjectsMove[i][2]+"_9")!=null && document.getElementById(mapObjectsMove[i][2]+"_8")!=null) {
                            if (mapObjectsMove[i][7]) { //slideFlg
                                index = 9;
                            } else {
                                if (scrollPosOfObj <  16) index = 9;
                                if (scrollPosOfObj >= 16) index = 8;
                            }
                        }
                    break;
                    case 1: //up
                        //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                        if(document.getElementById(mapObjectsMove[i][2]+"_5")!=null && document.getElementById(mapObjectsMove[i][2]+"_4")!=null){
                            if (mapObjectsMove[i][7]) { //slideFlg
                                index = 5;
                            } else {
                                if (sideSwitchFlgOfObj) {
                                    if (scrollPosOfObj <  16) index = 4;
                                    if (scrollPosOfObj >= 16) index = 5;
                                } else {
                                    if (scrollPosOfObj <  16) index = 5;
                                    if (scrollPosOfObj >= 16) index = 4;
                                }
                            } 
                        }
                    break;
                    case 2: //right
                        if(document.getElementById(mapObjectsMove[i][2]+"_7")!=null && document.getElementById(mapObjectsMove[i][2]+"_6")!=null){
                            if (mapObjectsMove[i][7]) { //slideFlg
                                index = 7;
                            } else {
                                if (scrollPosOfObj <  16) index = 7;
                                if (scrollPosOfObj >= 16) index = 6;
                            }
                        }
                    break;
                    case 0: //down
                        //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                        if(document.getElementById(mapObjectsMove[i][2]+"_2")!=null && document.getElementById(mapObjectsMove[i][2]+"_1")!=null){
                            if (mapObjectsMove[i][7]) { //slideFlg
                                index = 1;
                            } else {
                                if (sideSwitchFlgOfObj) {
                                    if (scrollPosOfObj <  16) index = 1;
                                    if (scrollPosOfObj >= 16) index = 2;
                                } else {
                                    if (scrollPosOfObj <  16) index = 2;
                                    if (scrollPosOfObj >= 16) index = 1;
                                }
                            }
                        }
                    break;
                }

            } else {
            //ムーブチップではなかった場合
                switch (tmp) {
                    case 3: //left  
                        if(document.getElementById(mapObjectsMove[i][2]+"_9")!=null && document.getElementById(mapObjectsMove[i][2]+"_8")!=null) switchCountOfObj < 64 ? index = 9: index = 8;
                    break;
                    case 1: //up
                        if(document.getElementById(mapObjectsMove[i][2]+"_5")!=null && document.getElementById(mapObjectsMove[i][2]+"_4")!=null) switchCountOfObj < 64 ? index = 5: index = 4;
                    break;
                    case 2: //right
                        if(document.getElementById(mapObjectsMove[i][2]+"_7")!=null && document.getElementById(mapObjectsMove[i][2]+"_6")!=null) switchCountOfObj < 64 ? index = 7: index = 6;
                    break;
                    case 0: //down
                        if(document.getElementById(mapObjectsMove[i][2]+"_2")!=null && document.getElementById(mapObjectsMove[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                    break;
                    default :
                        // if(document.getElementById(mapObjects[i][2]+"_2")!=null && document.getElementById(mapObjects[i][2]+"_1")!=null) switchCountOfObj < 64 ? index = 2: index = 1;
                    break;
                }
            }

            if (mapObjectsMove[i][4] != null) {
                viewContext.drawImage(document.getElementById(mapObjectsMove[i][2]+"_"+index), (mapObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX)+movePxX[i], (mapObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)+movePxY[i]);                
            } else {
                viewContext.drawImage(document.getElementById(mapObjectsMove[i][2]+"_"+index), (mapObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX),            (mapObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)           );
            }

        } else {
        //ツール
            // 通常チップだった場合　　：通常のディレクションを使用（イベント発生直前の向きで固定される）
            // ムーブのチップだった場合：現在のorderIndexのディレクションを使用（歩く方向に向けたいから）
            var tmp = mapObjectsMove[i][4]==null ? mapObjectsMove[i][3] : targetChips[targetIndex][2][orderIndex];
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

            if (mapObjectsMove[i][4] != null) {
                viewContext.drawImage(document.getElementById(mapObjectsMove[i][2]), (mapObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX)+movePxX[i], (mapObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)+movePxY[i]);
            } else {
                viewContext.drawImage(document.getElementById(mapObjectsMove[i][2]), (mapObjectsMove[i][0]*32)+(viewCanvasHalfWidth-mainCharaPosX),            (mapObjectsMove[i][1]*32)+(viewCanvasHalfHeight-mainCharaPosY)           );
            }

        }

        //31px進んだ時で
        if ((moveCounter == mapTipLength-1) && (tmp2 != 4)){
            //ムーブチップだった場合
            if (mapObjectsMove[i][4] != null) { //null or targetIndex

                // 次のインデックスのオーダーがない場合で、移動後サウンドがある場合はサウンドを鳴らす
                if (targetChips[targetIndex][2][orderIndex+1] == undefined) {
                    //サウンドを鳴らす
                    if (mapObjectsMove[i][10] != "") {
                        sound(mapObjectsMove[i][10]);
                    }
                }

                // 次のインデックスのオーダーがなくて、かつ削除フラグがあった場合
                if (targetChips[targetIndex][2][orderIndex+1] == undefined && mapObjectsMove[i][5] == true){

                    //mapObjects（Move）から削除する
                    mapObjectsMove.splice(i,1);
                    mapObjects.splice(i,1);
                    i--;//インデックスをずらしてループを調整

                //次のインデックスのオーダーがある場合
                } else {

                    // 位置情報を整える
                    if (targetChips[targetIndex][2][orderIndex] == 0)  mapObjectsMove[i][1] = mapObjectsMove[i][1]+1; //down
                    if (targetChips[targetIndex][2][orderIndex] == 1)  mapObjectsMove[i][1] = mapObjectsMove[i][1]-1; //up
                    if (targetChips[targetIndex][2][orderIndex] == 2)  mapObjectsMove[i][0] = mapObjectsMove[i][0]+1; //right
                    if (targetChips[targetIndex][2][orderIndex] == 3)  mapObjectsMove[i][0] = mapObjectsMove[i][0]-1; //left

                    // 元の方もこのタイミングでやっちゃう
                    mapObjects[i][0] = mapObjectsMove[i][0]; //x
                    mapObjects[i][1] = mapObjectsMove[i][1]; //y

                }
            }
            movePxX[i] = 0; //31 ⇨ 0に戻す
            movePxY[i] = 0; //31 ⇨ 0に戻す
            scrollPosOfObj = 0;
            sideSwitchFlgOfObj = sideSwitchFlgOfObj ? false : true;
        }

        var targetIndex = 0;


    }

    switchCountOfObj++;

    scrollPosOfObj++;

    if (switchCountOfObj == 128) switchCountOfObj = 0;

    moveCounter++;
    if (moveCounter == mapTipLength) {//32px進んだら
        moveCounter = 0;
        orderIndex++; //次のオーダーに切り替える
    }

    //命令が全部終わったら
    if (maxOrderNUm == orderIndex) {
        //mapObjectsMove
        for (var i=0; i<mapObjectsMove.length; i++) {
            //事前に保持しておいた移動対象チップのオブジェクト情報[6]があればマップに移行（ダメならここでアラートを出す。）
            if (mapObjectsMove[i][6] != null) { 
            // mapObjectsMove[i][6]（待避用オブジェクト）が空でないとき（つまり、既存のオブジェクトを動かした場合）待避用データコピー
            //データ範囲分実施
                var ylength = mapObjectsMove[i][6]['yCells'];
                var xlength = mapObjectsMove[i][6]['xCells'];
                delete mapObjectsMove[i][6]['leftTop'];
                delete mapObjectsMove[i][6]['yCells'];
                delete mapObjectsMove[i][6]['xCells'];
                for(var k=0; k<ylength; k++){
                    for(var l=0; l<xlength; l++){

                        //移動先範囲にオブジェクトがある場合、アラートを出す
                        if (currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)].hasOwnProperty('object')) {
                            alert("移動先にオブジェクトがあるんでダメでーす（処理は止めません）");
                        }

                        if (k==0 && l==0) {
                        //左上は、左上フラグとかの情報を追加する
                            currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)]['object'] = mapObjectsMove[i][6];
                            currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)]['object']['leftTop'] = true;
                            currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)]['object']['xCells'] = xlength;
                            currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)]['object']['yCells'] = ylength;
                        } else {
                        //それ以外の範囲は単純にデータコピー
                            currrentMapObj[Number(mapObjectsMove[i][1])+Number(k)][Number(mapObjectsMove[i][0])+Number(l)]['object'] = mapObjectsMove[i][6];
                        }
                    }
                }
            }
        }

        //完了フラグを立てる
        finishDrawMoveFlg = true;
        //変数初期化
        maxOrderNUm = 0;
        orderIndex = 0;
        mapObjectsMove = [];
        targetChips = [];
        movePxX = [];
        movePxY = [];

        startSoundFlg = true;

        //完了フラグはdraw()の途中で使われているよ
        //そこで次のイベントがあれば呼び出し
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
var doSceneEffectFlg = false; 
function doScene(sceneData) {
    //console.log(sceneData);
    //drawを止める
    drawFlg = false;
    //シーン中にする
    sceneFlg = true;
    //バトル画面を表示する
    viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);  
    sceneImg =  document.getElementById(sceneData['cutSceneSrc']);
    viewContext.globalAlpha = 0;
    showCutScene(sceneImg, 128, 29);
    //シーンイベントを詰める
    var index = 1
    while(sceneData.hasOwnProperty('sceneEvt_'+index)) {
        sceneEvts.push(sceneData['sceneEvt_'+index]);
        index++;
    }
    //必要なら表示のタイミングで音を出す
    sound('effect/sub_magic/water_5.wav');

    //あとはシーンイベントをAボタンで実行していく。
    //なくなったら、次のイベント

}

//主人公を変更する
function doChangeMainChara(changeMainCharaData) {
    
    //最初に現在の主人公のデータを初期化
    mainCharaImgArray = [];

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
    for (var i=0; i<mainCharaArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = mainCharaArray[i];
        mainCharaImgArray.push(imgObj);
    }
    //ここで引数の主人公情報を取得、あれば三角パンツを上書きする
    //なければ、三角パンツをそのまま使う。
    if (projectDataObj.hasOwnProperty('mainChara')) {
            if (document.getElementById(changeMainCharaData['name']+"_0") != null) mainCharaImgArray[0] = document.getElementById(changeMainCharaData['name']+"_0"); //f
            if (document.getElementById(changeMainCharaData['name']+"_1") != null) mainCharaImgArray[1] = document.getElementById(changeMainCharaData['name']+"_1"); //★ 前1 fr
            if (document.getElementById(changeMainCharaData['name']+"_2") != null) mainCharaImgArray[2] = document.getElementById(changeMainCharaData['name']+"_2"); //★ 前2 fl
            if (document.getElementById(changeMainCharaData['name']+"_3") != null) mainCharaImgArray[3] = document.getElementById(changeMainCharaData['name']+"_3"); //b
            if (document.getElementById(changeMainCharaData['name']+"_4") != null) mainCharaImgArray[4] = document.getElementById(changeMainCharaData['name']+"_4"); //★ 後4 br
            if (document.getElementById(changeMainCharaData['name']+"_5") != null) mainCharaImgArray[5] = document.getElementById(changeMainCharaData['name']+"_5"); //★ 後5 bl
            if (document.getElementById(changeMainCharaData['name']+"_6") != null) mainCharaImgArray[6] = document.getElementById(changeMainCharaData['name']+"_6"); //★ 右6 r
            if (document.getElementById(changeMainCharaData['name']+"_7") != null) mainCharaImgArray[7] = document.getElementById(changeMainCharaData['name']+"_7"); //★ 右7 rr
            if (document.getElementById(changeMainCharaData['name']+"_8") != null) mainCharaImgArray[8] = document.getElementById(changeMainCharaData['name']+"_8"); //★ 左8 l
            if (document.getElementById(changeMainCharaData['name']+"_9") != null) mainCharaImgArray[9] = document.getElementById(changeMainCharaData['name']+"_9"); //★ 左9 ll

    }
    //ロード時は下向きで表示
    mainCharaImg = mainCharaImgArray[0];

    //一回表示し直さないといけない
    drawCanvas();

    //次のイベントがあれば次のイベント
    if (eventIndex+1 != events.length) {
        eventIndex++;
        doEvents();
    } else {
    //なければ通常通りのdraw()
        if (!drawFlg) {
            drawFlg = true;
            draw();
        }
        eventIndex = 0; 
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
    for (var i=0; i<mainCharaArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = mainCharaArray[i];
        mainCharaImgArray.push(imgObj);   //メインキャラ
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
    var reactionArray = [
        '/rpg-player/public/image/bikkuri.png',
        '/rpg-player/public/image/heart.png',
        '/rpg-player/public/image/ikari.png',
        '/rpg-player/public/image/ase.png',
    ]
    for (var i=0; i<reactionArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = reactionArray[i];
        reactionImgArray.push(imgObj);
    }

    //リアクション表示用画像
    var flashAnimationArray = [
        '/rpg-player/public/image/damage.png',
    ]
    for (var i=0; i<flashAnimationArray.length; i++) {
        var imgObj = new Image();
        imgObj.src = flashAnimationArray[i];
        flashAnimationImgArray.push(imgObj);
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
// 上下の場合の左右切り替えフラグ
var sideSwitchFlg = true;
// フォローキャラが次に進む方向
var tmpScrollDir = '';
var nextFollowDir = '';
// フォローキャラが進んだ距離
function drawMainCharacterAndFollowCharacter() {
    //歩くアニメーションはここで実装する
    //scrollPos（32pxのカウント）のどっかのタイミングで、表示する画像を切り替える(方向ごとにケース分け)
    if (scrollState) {
    //移動中の時
        if (scrollPos == 1) {
        //一歩進んだ時、進んだ方向をフォローキャラが次に進む方向として取得（フォローして２歩目以降）
            if (!followFirstStep) {
                nextFollowDir = tmpScrollDir;
            }
            tmpScrollDir = scrollDir; //1pxでも進んだ時、進んだ方向をフォローキャラが進む方法として取得
        }
        switch (scrollDir) {
            case 'left': 
                if (scrollPos <  16) {
                    mainCharaImg = mainCharaImgArray[9];
                    followCharaImg = followCharaImgArray[9];
                }
                if (scrollPos >= 16) {
                    mainCharaImg = mainCharaImgArray[8];
                    followCharaImg = followCharaImgArray[8];
                }
            break;
            case 'up':
                //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                if (sideSwitchFlg) {
                    if (scrollPos <  16) {
                        mainCharaImg = mainCharaImgArray[4];
                        followCharaImg = followCharaImgArray[4];
                    }
                    if (scrollPos >= 16) {
                        mainCharaImg = mainCharaImgArray[5];
                        followCharaImg = followCharaImgArray[5];
                    }
                } else {
                    if (scrollPos <  16) {
                        mainCharaImg = mainCharaImgArray[5];
                        followCharaImg = followCharaImgArray[5];
                    }
                    if (scrollPos >= 16) {
                        mainCharaImg = mainCharaImgArray[4];
                        followCharaImg = followCharaImgArray[4];
                    }
                } 
            break;
            case 'right':
                if (scrollPos <  16) {
                    mainCharaImg = mainCharaImgArray[7];
                    followCharaImg = followCharaImgArray[7];
                }
                if (scrollPos >= 16) {
                    mainCharaImg = mainCharaImgArray[6];
                    followCharaImg = followCharaImgArray[6];
                }
            break;
            case 'down':
                //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                if (sideSwitchFlg) {
                    if (scrollPos <  16) {
                        mainCharaImg = mainCharaImgArray[1];
                        followCharaImg = followCharaImgArray[1];
                    }
                    if (scrollPos >= 16) {
                        mainCharaImg = mainCharaImgArray[2];
                        followCharaImg = followCharaImgArray[2];
                    }
                } else {
                    if (scrollPos <  16) {
                        mainCharaImg = mainCharaImgArray[2];
                        followCharaImg = followCharaImgArray[2];
                    }
                    if (scrollPos >= 16) {
                        mainCharaImg = mainCharaImgArray[1];
                        followCharaImg = followCharaImgArray[1];
                    }
                }
            break;
        }
        if (!followFirstStep) { //2歩目移行の時
            switch (nextFollowDir) {
                case 'left': 
                    if (scrollPos <  16) {
                        followCharaImg = followCharaImgArray[9];
                    }
                    if (scrollPos >= 16) {
                        followCharaImg = followCharaImgArray[8];
                    }
                break;
                case 'up':
                    //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                    if (sideSwitchFlg) {
                        if (scrollPos <  16) {
                            followCharaImg = followCharaImgArray[4];
                        }
                        if (scrollPos >= 16) {
                            followCharaImg = followCharaImgArray[5];
                        }
                    } else {
                        if (scrollPos <  16) {
                            followCharaImg = followCharaImgArray[5];
                        }
                        if (scrollPos >= 16) {
                            followCharaImg = followCharaImgArray[4];
                        }
                    } 
                break;
                case 'right':
                    if (scrollPos <  16) {
                        followCharaImg = followCharaImgArray[7];
                    }
                    if (scrollPos >= 16) {
                        followCharaImg = followCharaImgArray[6];
                    }
                break;
                case 'down':
                    //上下の場合は、左右の手足の組み合わせを一歩ごとに切り替える必要がある
                    if (sideSwitchFlg) {
                        if (scrollPos <  16) {
                            followCharaImg = followCharaImgArray[1];
                        }
                        if (scrollPos >= 16) {
                            followCharaImg = followCharaImgArray[2];
                        }
                    } else {
                        if (scrollPos <  16) {
                            followCharaImg = followCharaImgArray[2];
                        }
                        if (scrollPos >= 16) {
                            followCharaImg = followCharaImgArray[1];
                        }
                    }
                break;
            }        
        }
        //上下の場合の左右切り替え
        if (scrollPos >= 31) {
            sideSwitchFlg = sideSwitchFlg ? false : true;
            switchCountOfMain = 0;
            //一歩歩いたらフォローキャラの一歩目フラグをfalseにする
            if (followFlg && countFirstStep) {
                countFirstStep = false;
                followFirstStep = false;
            }
        }
        if (followFlg) {
            //フォローキャラを描画
            if (followFirstStep) {
                //一歩めの間。フォローキャラは動かない（メインキャラの移動からずれ込んでいく感じ）
                switch (scrollDir) {
                    case 'left':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+scrollPos,viewCanvasHalfHeight); break;
                    case 'up':    viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight+scrollPos); break;
                    case 'right': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-scrollPos,viewCanvasHalfHeight); break; 
                    case 'down':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight-scrollPos); break;
                }
            } else {
                //一歩うごいたあと。メインキャラの後ろに描画
                //斜めって描画していく必要がある
                switch (nextFollowDir) {  //nextFollowDir
                    case 'left':
                        switch(scrollDir) {
                            case 'left':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+32,viewCanvasHalfHeight); break;
                            case 'up':    viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+32-scrollPos,viewCanvasHalfHeight+scrollPos); break;
                            case 'right': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+32-(scrollPos*2),viewCanvasHalfHeight); break;
                            case 'down':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+32-scrollPos,viewCanvasHalfHeight-scrollPos); break;
                        }
                    break;
                    case 'up':
                        switch(scrollDir) {
                            case 'left':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+scrollPos,viewCanvasHalfHeight+32-scrollPos); break;
                            case 'up':    viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight+32); break;
                            case 'right': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-scrollPos,viewCanvasHalfHeight+32-scrollPos); break;
                            case 'down':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight+32-(scrollPos*2)); break;
                        }
                    break;
                    case 'right':
                        switch(scrollDir) {
                            case 'left':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-32+(scrollPos*2),viewCanvasHalfHeight); break;
                            case 'up':    viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-32+scrollPos,viewCanvasHalfHeight+scrollPos); break;
                            case 'right': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-32,viewCanvasHalfHeight); break;
                            case 'down':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-32+scrollPos,viewCanvasHalfHeight-scrollPos); break;
                        }
                    break;
                    case 'down':
                        switch(scrollDir) {
                            case 'left':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+scrollPos,viewCanvasHalfHeight-32+scrollPos); break;
                            case 'up':    viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight-32+(scrollPos*2));  break;
                            case 'right': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-scrollPos,viewCanvasHalfHeight-32+scrollPos); break;
                            case 'down':  viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight-32); break;
                        }
                    break;
                }
            }
        }
        //メインキャラを描画
        viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);

    } else {
    //移動中じゃない時
        switch (scrollDir) {
            case 'left': switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[9]:mainCharaImg = mainCharaImgArray[8]; break;
            case 'up':   switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[5]:mainCharaImg = mainCharaImgArray[4]; break;
            case 'right':switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[7]:mainCharaImg = mainCharaImgArray[6]; break;
            case 'down': switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[2]:mainCharaImg = mainCharaImgArray[1]; break;
            default :    switchCountOfMain < 64 ? mainCharaImg = mainCharaImgArray[2]:mainCharaImg = mainCharaImgArray[1]; break;
        }
        switch (tmpScrollDir) {
            case 'left': switchCountOfMain < 64 ? followCharaImg = followCharaImgArray[9]:followCharaImg = followCharaImgArray[8]; break;
            case 'up':   switchCountOfMain < 64 ? followCharaImg = followCharaImgArray[5]:followCharaImg = followCharaImgArray[4]; break;
            case 'right':switchCountOfMain < 64 ? followCharaImg = followCharaImgArray[7]:followCharaImg = followCharaImgArray[6]; break;
            case 'down': switchCountOfMain < 64 ? followCharaImg = followCharaImgArray[2]:followCharaImg = followCharaImgArray[1]; break;
            default :    switchCountOfMain < 64 ? followCharaImg = followCharaImgArray[2]:followCharaImg = followCharaImgArray[1]; break;
        }

        if (followFlg && !followFirstStep) {
            switch (tmpScrollDir) {  //mainPrevPos
                case 'left': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth+32,viewCanvasHalfHeight); break;
                case 'up':   viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight+32); break;
                case 'right':viewContext.drawImage(followCharaImg,viewCanvasHalfWidth-32,viewCanvasHalfHeight); break;
                case 'down': viewContext.drawImage(followCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight-32); break;
            }
        }

        //メインキャラを描画
        viewContext.drawImage(mainCharaImg,viewCanvasHalfWidth,viewCanvasHalfHeight);
        switchCountOfMain++;
        if (switchCountOfMain >= 128) switchCountOfMain = 0;

    }

}


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

    //「道具」と表示する
    viewContext.fillStyle = 'yellow';
    viewContext.fillRect(200, 10, 100, 40);
    viewContext.fillStyle = 'black';
    viewContext.fillText('道具', 200+20, 10+7);

    viewContext.fillStyle = 'black';
    if (haveTools.length == 0) {
        viewContext.fillText('道具はありません', 200+2+10, (50+2+3)+(0*lineSpace+5));
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
                case 'changeMainChara':
                    var changeMainCharaData =  maptipObj['events'][evtFullName];
                    doChangeMainChara(changeMainCharaData);
                break;
                case 'follow':
                    var followData =  maptipObj['events'][evtFullName];
                    doFollow(followData);
                break;
                case 'deleteObject':
                    var delObjData =  maptipObj['events'][evtFullName];
                    doDeleteObject(delObjData);
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
            mapObjects.splice();

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
            //マップのデータ上から削除
            delete nextCell.object;
            //マップの描画を削除
            for(var i=0; i<mapObjects.length; i++) {
                if (mapObjects[i][0]==nextCellX && mapObjects[i][1]==nextCellY) {
                    mapObjects.splice(i,1);
                }
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
        case 'changeMainChara':
            var changeMainCharaData =  maptipObj[evtFullName];
            doChangeMainChara(changeMainCharaData);
        break;
        case 'follow':
            var followData =  maptipObj[evtFullName];
            doFollow(followData);
        break;
        case 'deleteObject':
            var delObjData =  maptipObj[evtFullName];
            doDeleteObject(delObjData);
        break;
    }
}


var effectFlg = false;
var globalEffectData = null;
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

            //イベント終了だったら（シェイクアニメーション特有の分岐、普通はkeyEventHandlerでやるべきこと）
            if (eventIndex+1 == events.length) {
                effectFlg = false; //フラグはここで戻す
                eventIndex = 0;
                console.log("最後のイベント：シェイクアニメーション終了、動き始めれます。");
                drawFlg = true;
                draw();
            }

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

            //音を出す
            var soundPath = effectData['sound'];
            //音源場所から、持ってきてならす（既存サンプル参考に）
            sound(soundPath);

        break;
        case 'animation':
            effectFlg = true;
            globalEffectData = effectData;
            drawAnimationFlg = true;
            drawAnimation();

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
        }, 1000);//横揺れはちょっと長く

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
    //バトル開始アニメーション
    showBattleStartAnimation();
    sound('effect/sub_event/encount_3.wav');
    //バトル画面を表示する（遅延表示）
    setTimeout(function(){
        showBattleScreen(battleData);    
    },1100);
}

var BattleStartAniIndex = 1;
function showBattleStartAnimation() {
    //画像もう作っておいて、getIdで順繰りに表示していく
    var AniImg = document.getElementById("battle_"+BattleStartAniIndex);
    viewContext.drawImage(AniImg, 0, 0);

    BattleStartAniIndex++;
    if (BattleStartAniIndex == 12) {
        BattleStartAniIndex = 1;
        return;
    }
    setTimeout("showBattleStartAnimation()", 100);
}

//バトル画面を表示する
var battleOrders;
var chara1Data = null; //このデータのHPをバトル中にいじっていく
var chara2Data = null;
var chara3Data = null;
var chara4Data = null;
var chara5Data = null;
var chara6Data = null;
var isBoss = "0";
var battleTurn = 0; //0:敵　1:味方 リセットバトルスクリーンで振り分けるのに使う
var fromChara = ""; //攻撃元
var doSkillId = "";
var toChara = ""; //攻撃先
var skillName = ""; //攻撃技名
function showBattleScreen(battleData) {

    //前回の残ってたらリセット
    chara1Data = null;
    chara2Data = null;
    chara3Data = null;
    chara4Data = null;
    chara5Data = null;
    chara6Data = null;

    viewContext.fillStyle = 'white';
    viewContext.fillRect(0, 0, viewCanvasWidth, viewCanvasHeight);

    //Object.assign({}, tmp);
    if (battleData['chara1'] != "") chara1Data = Object.assign({}, projectDataObj['characters'][battleData['chara1']]);
    if (battleData['chara2'] != "") chara2Data = Object.assign({}, projectDataObj['characters'][battleData['chara2']]);
    if (battleData['chara3'] != "") chara3Data = Object.assign({}, projectDataObj['characters'][battleData['chara3']]);
    if (battleData['chara4'] != "") chara4Data = Object.assign({}, projectDataObj['characters'][battleData['chara4']]);
    if (battleData['chara5'] != "") chara5Data = Object.assign({}, projectDataObj['characters'][battleData['chara5']]);
    if (battleData['chara6'] != "") chara6Data = Object.assign({}, projectDataObj['characters'][battleData['chara6']]);

    //最初は敵キャラ表示
    if (chara1Data != null) showBattleChara(1, true, chara1Data["chrName"], chara1Data["HP"], chara1Data['chrImgName']);
    if (chara2Data != null) showBattleChara(2, true, chara2Data["chrName"], chara2Data["HP"], chara2Data['chrImgName']);
    if (chara3Data != null) showBattleChara(3, true, chara3Data["chrName"], chara3Data["HP"], chara3Data['chrImgName']);

    //バトルオーダー取得
    battleOrders = battleData['battleOrders'];

    //これなんのために作ったんだっけ、、
    isBoss =  battleData['isBoss'];

    //キャラグルーム名表示
    doTalk(battleData['charaGroup'] + "が現れた！！");
}

//バトル画面をリセットする
function resetBattleScreen() {

    viewContext.fillStyle = 'white';
    viewContext.fillRect(0, 0, viewCanvasWidth, viewCanvasHeight);

    if (battleTurn == 0) {
        //敵キャラ表示
        if (chara1Data != null) showBattleChara(1, true, chara1Data["chrName"], chara1Data["HP"], chara1Data['chrImgName']);
        if (chara2Data != null) showBattleChara(2, true, chara2Data["chrName"], chara2Data["HP"], chara2Data['chrImgName']);
        if (chara3Data != null) showBattleChara(3, true, chara3Data["chrName"], chara3Data["HP"], chara3Data['chrImgName']);

    } else {
        //味方キャラ表示
        if (chara4Data != null) showBattleChara(1, false, chara4Data["chrName"], chara4Data["HP"], chara4Data['chrImgName']);
        if (chara5Data != null) showBattleChara(2, false, chara5Data["chrName"], chara5Data["HP"], chara5Data['chrImgName']);
        if (chara6Data != null) showBattleChara(3, false, chara6Data["chrName"], chara6Data["HP"], chara6Data['chrImgName']);
    }

}

//バトルキャラを表示する
//キャラ位置、敵フラグ、キャラ名、HP、キャライメージネーム
var damageEffectCounter = 0;
var KOcharaNames = '';
var chara1KOflg = false;
var chara2KOflg = false;
var chara3KOflg = false;
var chara4KOflg = false;
var chara5KOflg = false;
var chara6KOflg = false;
function showBattleChara(index, enemyFlg, chrName, HP, chrImgName, damageEffectFlg=false) {

    if (damageEffectFlg) {
        if (damageEffectCounter == 70) { //70は適当な数値
            //ダメージエフェクト中で、カウンターがマックスになったら終了
            damageEffectCounter = 0;
            var timerId = setTimeout(function() {
                showBattleChara(index, enemyFlg, chrName, HP, chrImgName, damageEffectFlg);
            }, 1);
            clearTimeout(timerId);

            if (index == 4) {
            //ALLが対象のとき
                for (var i=0; i<HP.length; i++) {
                    if (enemyFlg) {
                        if(HP[i] != null && HP[i] <= 0) {
                            //キャラ瀕死。
                            if (i == 0 && !chara1KOflg) {
                                KOcharaNames += chrName[i]+"、";
                                chara1KOflg = true;
                            } else if (i == 1 && !chara2KOflg) {
                                KOcharaNames += chrName[i]+"、";
                                chara2KOflg = true;
                            } else {
                                KOcharaNames += chrName[i]+"、";
                                chara3KOflg = true;
                            }
                        } else {
                            //キャラを通常表示する（resetBattleScreendでも可）
                            showBattleChara(index, enemyFlg, chrName, HP, chrImgName, false);
                        }
                    } else {
                        if(HP[i] != null && HP[i] <= 0) {
                            //キャラ瀕死。
                            if (i == 0 && !chara1KOflg) {
                                KOcharaNames += chrName[i]+"、";
                                chara1KOflg = true;
                            } else if (i == 1 && !chara2KOflg) {
                                KOcharaNames += chrName[i]+"、";
                                chara2KOflg = true;
                            } else {
                                KOcharaNames += chrName[i]+"、";
                                chara3KOflg = true;
                            }
                        } else {
                            //キャラを通常表示する（resetBattleScreendでも可）
                            showBattleChara(index, enemyFlg, chrName, HP, chrImgName, false);
                        }
                    }
                }
                doTalk(KOcharaNames+"は倒れた！");
                KOcharaNames = ''; 
            } else {
            //一体が対象のとき    
                if(HP <= 0) {
                    //キャラ瀕死。表示しない。
                    doTalk(chrName+"は倒れた！");
                } else {
                    //キャラを通常表示する（resetBattleScreendでも可）
                    showBattleChara(index, enemyFlg, chrName, HP, chrImgName, false);
                }
            }

            return;
        } 

        if (damageEffectCounter%2 != 0) {
            //ダメージエフェクト中で、カウンターが奇数の場合は、対象のキャラを消すのみで表示処理に進まない
            viewContext.fillStyle = 'white';
            if (index == 4) {
                viewContext.fillRect((1-1)*256+10-((1-1)*8), 96-5, 224, 224);
                viewContext.fillRect((2-1)*256+10-((2-1)*8), 96-5, 224, 224);
                viewContext.fillRect((3-1)*256+10-((3-1)*8), 96-5, 224, 224);
            } else {
                viewContext.fillRect((index-1)*256+10-((index-1)*8), 96-5, 224, 224);
            }
            setTimeout(function() {
                showBattleChara(index, enemyFlg, chrName, HP, chrImgName, damageEffectFlg);
            }, drawSpeed);
            damageEffectCounter++;
            return;
        }
    }
    //キャラ名とHPの枠
    viewContext.fillStyle = 'black';
    if (index == 4) {
        if (enemyFlg) {
            if (chara1Data != null) viewContext.fillRect((1-1)*256+7-((1-1)*6), 5, 224, 76);
            if (chara2Data != null) viewContext.fillRect((2-1)*256+7-((2-1)*6), 5, 224, 76);
            if (chara3Data != null) viewContext.fillRect((3-1)*256+7-((3-1)*6), 5, 224, 76);
        } else {
            if (chara4Data != null) viewContext.fillRect((1-1)*256+7-((1-1)*6), 5, 224, 76);
            if (chara5Data != null) viewContext.fillRect((2-1)*256+7-((2-1)*6), 5, 224, 76);
            if (chara6Data != null) viewContext.fillRect((3-1)*256+7-((3-1)*6), 5, 224, 76);
        }
    } else {
        viewContext.fillRect((index-1)*256+7-((index-1)*6), 5, 224, 76);
    }
    viewContext.fillStyle = enemyFlg ? 'lightpink' : 'paleturquoise';
    if (index == 4) {
        if (enemyFlg) {
            if (chara1Data != null) viewContext.fillRect((1-1)*256+2+7-((1-1)*6), 2+5, 220, 72);
            if (chara2Data != null) viewContext.fillRect((2-1)*256+2+7-((2-1)*6), 2+5, 220, 72);
            if (chara3Data != null) viewContext.fillRect((3-1)*256+2+7-((3-1)*6), 2+5, 220, 72);
        } else {
            if (chara4Data != null) viewContext.fillRect((1-1)*256+2+7-((1-1)*6), 2+5, 220, 72);
            if (chara5Data != null) viewContext.fillRect((2-1)*256+2+7-((2-1)*6), 2+5, 220, 72);
            if (chara6Data != null) viewContext.fillRect((3-1)*256+2+7-((3-1)*6), 2+5, 220, 72);
        }
    } else {
        viewContext.fillRect((index-1)*256+2+7-((index-1)*6), 2+5, 220, 72);
    }
    //キャラ名とHP
    viewContext.fillStyle = 'black';
    viewContext.textBaseline = 'top';
    viewContext.font = talkFont;
    if (index == 4) {
        if (enemyFlg) {
            if (chara1Data != null) viewContext.fillText(chrName[0], (1-1)*256+20-((1-1)*6), 15);
            if (chara1Data != null) viewContext.fillText('HP: '+HP[0], (1-1)*256+20-((1-1)*6), 45);
            if (chara2Data != null) viewContext.fillText(chrName[1], (2-1)*256+20-((2-1)*6), 15);
            if (chara2Data != null) viewContext.fillText('HP: '+HP[1], (2-1)*256+20-((2-1)*6), 45);
            if (chara3Data != null) viewContext.fillText(chrName[2], (3-1)*256+20-((3-1)*6), 15);
            if (chara3Data != null) viewContext.fillText('HP: '+HP[2], (3-1)*256+20-((3-1)*6), 45);
        } else {
            if (chara4Data != null) viewContext.fillText(chrName[0], (1-1)*256+20-((1-1)*6), 15);
            if (chara4Data != null) viewContext.fillText('HP: '+HP[0], (1-1)*256+20-((1-1)*6), 45);
            if (chara5Data != null) viewContext.fillText(chrName[1], (2-1)*256+20-((2-1)*6), 15);
            if (chara5Data != null) viewContext.fillText('HP: '+HP[1], (2-1)*256+20-((2-1)*6), 45);
            if (chara6Data != null) viewContext.fillText(chrName[2], (3-1)*256+20-((3-1)*6), 15);
            if (chara6Data != null) viewContext.fillText('HP: '+HP[2], (3-1)*256+20-((3-1)*6), 45);
        }
    } else {
        viewContext.fillText(chrName, (index-1)*256+20-((index-1)*6), 15);
        viewContext.fillText('HP: '+HP, (index-1)*256+20-((index-1)*6), 45);
    }
    //キャライメージ
    if (index == 4) {
        if (chrImgName[0] != null) {
            var charaImg1 = document.getElementById(chrImgName[0]);
            if (!damageEffectFlg && HP[0] == 0) {
                //瀕死、表示しない
            } else {
                viewContext.drawImage(charaImg1, (1-1)*256+10-((1-1)*8), 96-5);
            }
        }
        if (chrImgName[1] != null) {
            var charaImg2 = document.getElementById(chrImgName[1]);
            if (!damageEffectFlg && HP[1] == 0) {
                //瀕死、表示しない
            } else {
                viewContext.drawImage(charaImg2, (2-1)*256+10-((2-1)*8), 96-5);
            }
        }
        if (chrImgName[2] != null) {
            var charaImg3 = document.getElementById(chrImgName[2]);
            if (!damageEffectFlg && HP[2] == 0) {
                //瀕死、表示しない
            } else {
                viewContext.drawImage(charaImg3, (3-1)*256+10-((3-1)*8), 96-5);
            }
        }
    } else {
        var charaImg =  document.getElementById(chrImgName);
        if (!damageEffectFlg && HP == 0) {
            //瀕死、表示しない
        } else {
            viewContext.drawImage(charaImg, (index-1)*256+10-((index-1)*8), 96-5);
        }
    }

    //ダメージエフェクト（ある場合）
    if (damageEffectFlg) {
        setTimeout(function() {
            showBattleChara(index, enemyFlg, chrName, HP, chrImgName, damageEffectFlg);
        }, drawSpeed);
        damageEffectCounter++;
    }
}

//カットシーンを表示する
function showCutScene(sceneImg, x, y) {
    if (viewContext.globalAlpha > 0.9) {
            var timerId = setTimeout(function() {
                showCutScene(sceneImg, x, y);
            }, 1);
            clearTimeout(timerId);
            return;
    }
    viewContext.globalAlpha += 0.1;
    viewContext.clearRect(x, y, 480, 228);
    viewContext.drawImage(sceneImg, 128, 29);
    setTimeout(function() {
        showCutScene(sceneImg, x, y);
    }, 30); //ふんわり具合はこの数字を変えて操作する
}

//画面遷移
var transitionFlg = false;
function doTransition(trasitionDataObj) {

    transitionFlg = true;
    viewContext.globalAlpha = 0;

    //フォローキャラの追跡をリセット
    followFirstStep = true;
    countFirstStep = true;

    //遷移専用の音を出す。
    sound('effect/sub_transition/stairs_1.wav');

    //マップ変更前にオブジェクトデータをリセット
    for (var i=0; i<mapObjects.length; i++) {
        //データ範囲分実施
        var ylength = currrentMapObj[mapObjects[i][1]][mapObjects[i][0]]['object']['yCells'];
        var xlength = currrentMapObj[mapObjects[i][1]][mapObjects[i][0]]['object']['xCells'];
        for(var k=0; k<ylength; k++){
            for(var l=0; l<xlength; l++){
                if (k==0 && l==0) {
                    delete currrentMapObj[Number(mapObjects[i][1])+Number(k)][Number(mapObjects[i][0])+Number(l)]['object']['leftTop'];
                    delete currrentMapObj[Number(mapObjects[i][1])+Number(k)][Number(mapObjects[i][0])+Number(l)]['object']['yCells'];
                    delete currrentMapObj[Number(mapObjects[i][1])+Number(k)][Number(mapObjects[i][0])+Number(l)]['object']['xCells'];
                } else {
                    delete currrentMapObj[Number(mapObjects[i][1])+Number(k)][Number(mapObjects[i][0])+Number(l)]['object'];
                }
            }
        }
    }

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

}

// 特殊マップチップのロード
// 初期表示と画面遷移時と、オブジェクト削除/追加時などにコールする
// ここでは必要なデータをつめるだけ。描画の時に、ここでつめたデータをもとに、描画する。
function loadSpecialMapChips() {
    mapRepeat = [];
    mapTurn = [];
    mapObjects = [];
    dataCopyAry = [];
    copyIndex = 0;
    for(let k in currrentMapObj) {
        //console.log(currrentMapObj[k]);
        for(let l in currrentMapObj[k]) {
            //繰り返しマップチップ
            if (currrentMapObj[k][l]['maptipType'] == 6) {
                var aryXYD = [l, k, 6];
                mapRepeat.push(aryXYD);
            } else if (currrentMapObj[k][l]['maptipType'] == 10) {
                var aryXYD = [l, k, 10];
                mapRepeat.push(aryXYD);
            } else if (currrentMapObj[k][l]['maptipType'] == 11) {
                var aryXYD = [l, k, 11];
                mapRepeat.push(aryXYD);
            } else if (currrentMapObj[k][l]['maptipType'] == 12) {
                var aryXYD = [l, k, 12];
                mapRepeat.push(aryXYD);
            } else {

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
                        // x y キャラネーム ディレクション（0123:上下左右) ムーブフラグ デリートフラグ マップオブジェクト格納用 スライドフラグ 固定向き オブジェクトネーム
                        var defaultObjData = [Number(l), Number(k), currrentMapObj[k][l]['object']['charaName'], 0, null, false, null, false, '', 'character']; 
                        mapObjects.push(defaultObjData);

                        //キャラオブジェクトの場合、大きさの範囲分マップへデータコピーする
                        var imgEle = document.getElementById(currrentMapObj[k][l]['object']['charaName']+"_1");
                        var xCells = imgEle.naturalWidth/mapTipLength;
                        var yCells = imgEle.naturalHeight/mapTipLength;
                        var objData = currrentMapObj[k][l]['object'];
                        for(var x=0; x<xCells; x++) {
                            for(var y=0; y<yCells; y++) {
                                //左上のセルだった場合左上フラグ、範囲を設定
                                if (x==0 && y==0) {
                                    currrentMapObj[k][l]['object']['leftTop'] = true;
                                    currrentMapObj[k][l]['object']['xCells'] = xCells;
                                    currrentMapObj[k][l]['object']['yCells'] = yCells;
                                } else {
                                //それ以外の範囲はデータコピー
                                    var ky = Number(k)+y;
                                    var lx = Number(l)+x;
                                    //[ky.toString()][lx.toString()]['object'] = objData;
                                    dataCopyAry[copyIndex] = [ky.toString(), lx.toString(), objData];
                                    copyIndex++;
                                }
                            }
                        }

                    break;
                    case 'tool' :
                        //var aryXYO = [l, k, currrentMapObj[k][l]['object']['imgName']];
                        // x y キャラネーム ディレクション（0123:上下左右) ムーブフラグ デリートフラグ マップオブジェクト格納用 スライドフラグ 固定向き オブジェクトネーム
                        var defaultObjData = [Number(l), Number(k), currrentMapObj[k][l]['object']['imgName'], 0, null, false, null, false, '', 'tool']; 
                        // mapToolObjects.push(defaultObjData);
                        mapObjects.push(defaultObjData);
                    break;
                }
            }
        }
    }
    doing = 0; //初期化。重要。

    //データコピー
    for (var i=0; i<dataCopyAry.length; i++) {
        currrentMapObj[dataCopyAry[i][0]][dataCopyAry[i][1]]['object'] = dataCopyAry[i][2];
    }

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
        sound('effect/sub_system/select_4.mp3');
    }

    //カーソル描画、上下とAボタンではいいいえを選択し、結果を返す
    targetAnswer = targetAnswerIndex; //1：はい、2：いいえ
    viewContext.fillStyle = 'black';
    viewContext.fillText('▶︎', questionWinStartX+5, questionWinStartY+10+(targetAnswerIndex*mapTipLength));
}

function showBattleOptions() {
    selectBattleOptionFlg = true;
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
    viewContext.fillStyle = 'black';
    viewContext.fillText('▶︎', questionWinStartX-30, talkWinStartY+10+(targetBattleOption*mapTipLength));   
}

var followFlg = false;
var followFirstStep = true; //最初の一歩だけ動かないフラグ
var countFirstStep = true; //一歩進んだら、followFirstStepをfalseにするフラグ
function doFollow(followData) {

    if (followData.type == 'add') {
        var followCharaArray = [];
        followCharaArray = [
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
        ];
        for (var i=0; i<followCharaArray.length; i++) {
            var imgObj = new Image();
            imgObj.src = followCharaArray[i];
            followCharaImgArray.push(imgObj);
        }

        //三角パンツを上書きする
        //なければ、三角パンツをそのまま使う。
        if (document.getElementById(followData.name+"_0") != null) followCharaImgArray[0] = document.getElementById(followData.name+"_0"); //f
        if (document.getElementById(followData.name+"_1") != null) followCharaImgArray[1] = document.getElementById(followData.name+"_1"); //★ 前1 fr
        if (document.getElementById(followData.name+"_2") != null) followCharaImgArray[2] = document.getElementById(followData.name+"_2"); //★ 前2 fl
        if (document.getElementById(followData.name+"_3") != null) followCharaImgArray[3] = document.getElementById(followData.name+"_3"); //b
        if (document.getElementById(followData.name+"_4") != null) followCharaImgArray[4] = document.getElementById(followData.name+"_4"); //★ 後ろ4 br
        if (document.getElementById(followData.name+"_5") != null) followCharaImgArray[5] = document.getElementById(followData.name+"_5"); //★ 後ろ5 bl
        if (document.getElementById(followData.name+"_6") != null) followCharaImgArray[6] = document.getElementById(followData.name+"_6");   //★ 右6 r
        if (document.getElementById(followData.name+"_7") != null) followCharaImgArray[7] = document.getElementById(followData.name+"_7"); //★ 右7 rr
        if (document.getElementById(followData.name+"_8") != null) followCharaImgArray[8] = document.getElementById(followData.name+"_8");   //★ 左8 l
        if (document.getElementById(followData.name+"_9") != null) followCharaImgArray[9] = document.getElementById(followData.name+"_9"); //★ 左9 ll

        followFlg = true;
    } else {

        followFlg = false;
        followFirstStep = true;
        countFirstStep = true;

    }

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


//オブジェクトを削除する
var delObjIndex = null;
function doDeleteObject(delObjData) {
    //delObjDataのXとYの位置からオブジェクトを削除する
　　　//指定の位置にオブジェクトがなかった場合、エラー
　　　//指定の位置のオブジェクトの当オブジェクトイベントだった場合もその後のイベントは全部やり切る
　　　//アニメーションが終わってから次のイベントを発動させる
　　　//次のイベント発動はmove同様、draw()の方で行う

    //まずはチェック
    if (!currrentMapObj[Number(delObjData.delY)][Number(delObjData.delX)].hasOwnProperty('object')){
        alert("削除オブジェクトがありません[マップ]（"+delObjData.delX+":"+delObjData.delY+")");
        return;
    }
    if (!currrentMapObj[Number(delObjData.delY)][Number(delObjData.delX)]['object'].hasOwnProperty('leftTop')){
        alert("左上のチップではありません[マップ]（"+delObjData.delX+":"+delObjData.delY+")");
        return;
    }
    var exsist = false;
    for(var i=0; i<mapObjects.length; i++) {
        if (mapObjects[i][0] == delObjData.delX) {
            if (mapObjects[i][1] == delObjData.delY) {
                exsist = true;
            }   
        }
    }
    if (!exsist){
        alert("削除オブジェクトがありません[オブジェクト配列]（"+delObjData.delX+":"+delObjData.delY+")");
        return;
    }

    //チェックOKなら、削除対象のオブジェクトのmapObjectsのインデックスを取得
    //→描画後、削除するのに使う
    for(var i=0; i<mapObjects.length; i++) {
        if (mapObjects[i][0] == delObjData.delX) {
            if (mapObjects[i][1] == delObjData.delY) {
                delObjIndex = i;
            }   
        }
    }

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

    //音を出す。
    if (soundToolFlg) {
        sound('effect/sub_event/get_3.wav');
        soundToolFlg = false;
    } else {
        sound('effect/sub_system/select_4.mp3');
    }
}

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
        //シーンの場合とそれ以外で分ける（シーンは揺れ&音だしのワンテンポがある、doSceneEffectFlgで判定する）
        if (sceneFlg && 
            doSceneEffectFlg &&
            (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType") || sceneEvts[sceneEvtsIndex].hasOwnProperty("sound"))
        ) {
            //揺れ（あったら）
            if (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType")) {
                //ゆらす
                shake(sceneEvts[sceneEvtsIndex]['shakeType']);
            }

            //サウンド（あったら）
            if (sceneEvts[sceneEvtsIndex].hasOwnProperty("sound")) {
                sound(sceneEvts[sceneEvtsIndex]['sound']);
            }

            //フラグを戻す
            doSceneEffectFlg = false;
                        sceneFlg = false;
                        sceneEvts = [];
                        sceneEvtsIndex = 0;
                        sceneImg = null;

        } else {

            //会話イベント終了、次のイベントへ(フラグ等戻す)
            talkFlg = false; //トーク中フラグ
            talkLineLength = 0; //会話一行長さ
            talkLines = []; //会話行数
            talkLineIndex = 0; //会話行インデックス
            talkPages = []; //会話ページ
            talkPageIndex = 0; //会話ページインデックス
            if (battleFlg) {

                if (sceneFlg) { //これはこれで必要か

                    if (sceneEvtsIndex+1 != sceneEvts.length) {
                        //次のシーンイベントがあれば実行

                        //バトル画面を表示する
                        viewContext.clearRect(0, 0, viewCanvasWidth, viewCanvasHeight);  
                        viewContext.drawImage(sceneImg, 128, 29);

                        sceneEvtsIndex++;
                        var talk = sceneEvts[sceneEvtsIndex]['talkContent'];
                        if (sceneEvts[sceneEvtsIndex].hasOwnProperty('wipeSrc')) var wipe = sceneEvts[sceneEvtsIndex]['wipeSrc'];
                        doTalk(talk, wipe);

                        if (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType") || sceneEvts[sceneEvtsIndex].hasOwnProperty("sound")) {
                            doSceneEffectFlg = true;
                        }

                    } else {

                        sceneFlg = false;
                        sceneEvts = [];
                        sceneEvtsIndex = 0;
                        sceneImg = null;
                    }

                } else {
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
                        }
                    } else {
                        if (doingBattleFlg) {
                            //これはこれで必要！
                        } else {
                            showBattleOptions(); //敵が現れた後にAボタン受付で開始
                        }

                    }
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

                    if (sceneEvts[sceneEvtsIndex].hasOwnProperty("shakeType") || sceneEvts[sceneEvtsIndex].hasOwnProperty("sound")) {
                        doSceneEffectFlg = true;
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
                //現在のイベントがバトルの場合とそれ以外で分ける
                var evtFullName = events[eventIndex];
                var index = evtFullName.indexOf('_');
                var evtName = evtFullName.substr(index+1);
                if (evtName == 'battle') {
                    //バトルの場合は、drawして、ちょっと遅らせてから次のイベント発動
                    drawFlg = true;
                    draw();
                    setTimeout(function(){
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
                    }, 1000);
                } else {
                    //画面をクリア
                    drawCanvas();
                    //次のイベント呼び出し
                    eventIndex++;
                    if(doingEvtType == 'map') {
                        doEvents();
                    } else {
                        doObjectEvents();
                    }
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
}

function openHiddenInfo() {
    var eles = document.getElementsByClassName('eachContainer');
    eles = Array.from(eles);
        eles.forEach(function(ele) {
        ele.style.display = 'block';
    });
}

function openProjectsContainerDiv() {
    document.getElementById("projectsContainer").style.display = 'block';
}

var hideMainCharaFlg = false;
function hideMainChara() {
    if (!hideMainCharaFlg) {
        hideMainCharaFlg = true;
        document.getElementById("hideMainChara").style.backgroundColor = 'red';
    } else {
        hideMainCharaFlg = false;
        document.getElementById("hideMainChara").style.backgroundColor = '';
    }
}







