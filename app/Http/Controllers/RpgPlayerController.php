<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RpgPlayerController extends Controller
{
    //プロジェクト選択画面へ
    public function selectProject(Request $request) {
        //SelectProjectMiddlewara.phpからデータ取得
        return view('rpg-player.select-project', ['data'=>$request->data]);
    }

    //プロジェクトデータを取得しにいく
    public function getProjectData(Request $request) {
        //引数のプロジェクト名を元に、プロジェクトのマップと、マップデータを探しにいく
        //ディレクトリの中のマップ画像パスを取得する
        $i = 0; //マップ画像インデックス
        foreach(glob('./projects/' . $request->oldProjectName . '/*.png') AS $pngFile){
            if(is_file($pngFile)){
                $pngFiles[$i]['path'] = $pngFile;
                $pngFiles[$i]['baseName'] = basename($pngFile, '.png');
                $i++;
            }
        }
        foreach(glob('./projects/' . $request->oldProjectName . '/*.json') AS $jsonFile){
            if(is_file($jsonFile)){
                $jsonFiles[] = basename($jsonFile);
            }
        }
        $i = 0; //キャラクター画像インデックス
        $characters = array();
        foreach(glob('./projects/' . $request->oldProjectName . '/characters/battle/*.png') AS $character){
            if(is_file($character)){
                $characters[$i]['path'] = $character;
                $characters[$i]['baseName'] = basename($character);
                $i++;
            }
        }
        $i = 0; //ワイプ画像インデックス
        $wipes = array();
        foreach(glob('./projects/*') AS $prjDir ) {
            foreach(glob($prjDir . '/characters/wipe/*') AS $prjWipeDir ) {
                foreach(glob($prjWipeDir .'/*.png') AS $wipe){
                    if(is_file($wipe)){
                        $wipes[$i]['path'] = $wipe;
                        $wipes[$i]['baseName'] = basename($wipe);
                        $i++;
                    }
                }
            }
        }
        $i = 0; //キャラクターオブジェクト画像インデックス
        $objCharas = array();
        foreach(glob('./projects/*') AS $prjDir ) {
            foreach(glob($prjDir . '/objects/characters/*') AS $prjObjCharaDir ) {

                // ロケールの設定
                setlocale(LC_ALL, 'ja_JP.UTF-8');

                $charaBaseName = basename($prjObjCharaDir);
                foreach(glob($prjObjCharaDir .'/*.png') AS $objChara){
                    //var_dump($objChara);
                    if(is_file($objChara)){
                        $objCharas[$charaBaseName][$i]['path'] = $objChara;
                        $objCharas[$charaBaseName][$i]['baseName'] = basename($objChara);
                        $i++;
                    }
                }
                $i = 0;
            }
        }
        $i = 0; //ツールオブジェクト画像インデックス
        $objTools = array();
        foreach(glob('./projects/*') AS $prjDir ) {
            foreach(glob($prjDir . '/objects/tools/*.png') AS $objTool ) {
                if(is_file($objTool)){
                    $objTools[$i]['path'] = $objTool;
                    $objTools[$i]['baseName'] = basename($objTool);
                    $i++;
                }
            }
        }
        //ツール取得
        $toolCtlr = new ToolController();
        $tools = $toolCtlr->getTools($request->oldProjectName);

        //サウンド取得
        $i = 0; //サウンドインデックス
        $sounds = array();
        foreach(glob('./sounds/*') AS $soundTypeDir ) {
            foreach(glob($soundTypeDir . '/*') AS $soundTypeSubDir ) {
                foreach(glob($soundTypeSubDir . '/*') AS $soundFile ) {
                    $sounds[$i]['baseName'] = basename($soundFile);
                    //先頭の.はじゃまなので削除
                    $soundFile = substr($soundFile, 1);
                    $sounds[$i]['path'] = $soundFile; //例）sounds/bgm/分類無し効果音/何ちゃら.mp3
                    $i++;
                }
            }
        }
        // //サウンド取得
        // //$i = 0; //インデックス
        // $sounds = array();
        // //var_dump(scandir('../../rpg-player/public/projects'));
        // foreach(scandir('../../rpg-player/public/sounds') AS $soundTypeDir){
        //     if (in_array($soundTypeDir, $excludes)) continue;
        //     foreach(scandir('../../rpg-player/public/sounds/' . $soundTypeDir) AS $soundTypeSubDir){
        //         if (in_array($soundTypeSubDir, $excludes)) continue;
        //         foreach(scandir('../../rpg-player/public/sounds/' . $soundTypeDir . '/'. $soundTypeSubDir) AS $soundFile){
        //             if (in_array($soundFile, $excludes)) continue;
        //             $sounds[$soundTypeDir][$soundTypeSubDir][] = $soundFile;
        //         }
        //     }
        // }

        //画面に出力（デバッグ）
        //var_dump($objCharas);
        //var_dump($wipes);
        return view('rpg-player.rpg-player',
                    [
                        'pngFiles'=>$pngFiles,
                        'jsonFiles'=>$jsonFiles, 
                        'project'=>$request->oldProjectName,
                        'characters'=>$characters,
                        'wipes'=>$wipes,
                        'objCharas'=>$objCharas,
                        'objTools'=>$objTools,
                        'tools'=>$tools,
                        'sounds'=>$sounds
                    ]
        );
    }
}
