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
        return view('rpg-player.rpg-player', ['pngFiles'=>$pngFiles, 'jsonFiles'=>$jsonFiles, 'project'=>$request->oldProjectName, 'characters'=>$characters]);
    }
}
