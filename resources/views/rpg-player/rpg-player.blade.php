<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>rpgPlayer</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="apple-touch-icon" href=".png">
<link rel="stylesheet" href="{{ asset('/css/rpg-player.css') }}">
<link rel="stylesheet"
	href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
	integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
	crossorigin="anonymous">
</head>
<body>
    @component('components.rpg-player-header')

    @endcomponent
    <canvas id="viewCanvas"></canvas>
    <div id="projectsContainer">
        <p>確認コマンド：console.log(mapObj);</p>
        <button onclick="openHiddenInfo()">オープン</button>
        <p id="projectName">{{$project}}</p>
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($pngFiles as $pngFile)
            <div class="eachMapContainer eachContainer">
                <p class="mapNames">{{$pngFile['baseName']}}</p>
                <img src="{{$pngFile['path']}}" id="{{$pngFile['baseName']}}" class='maps' width="200" height="150" alt="{{$pngFile['baseName']}}">
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($characters as $character)
            <div class="eachCharacterContainer eachContainer">
                <p class="charaNames">{{$character['baseName']}}</p>
                <img src="{{$character['path']}}" id="{{$character['baseName']}}" class='chracters' width="200" height="150" alt="{{$character['baseName']}}">
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($wipes as $wipe)
            <div class="eachWipeContainer eachContainer">
                <p class="wipeNames">{{$wipe['baseName']}}</p>
                <img src="{{$wipe['path']}}" id="{{$wipe['baseName']}}" class='wipes' alt="{{$wipe['baseName']}}">
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($objCharas as $key => $objCharaDir)
            <div class="eachObjCharaContainer eachContainer" alt="{{$key}}">
                @foreach($objCharaDir as $objChara)
                    <img src="{{$objChara['path']}}" id="{{$objChara['baseName']}}" class='objChara' alt="{{$objChara['baseName']}}">
                @endforeach
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($objTools as $objTool)
            <div class="eachObjToolContainer eachContainer">
                <p class="objToolNames">{{$objTool['baseName']}}</p>
                <img src="{{$objTool['path']}}" id="{{$objTool['baseName']}}" class='objTool' alt="{{$objTool['baseName']}}">
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        <!-- ツール用のコンテナ -->
        <div id="tools" class="eachContainer">
            <div id="toolContainer">
                <table border="1">
                    <tr style="background: skyblue">
                        <th>ID</th>
                        <th>ツール名</th>
                        <th>説明</th>
                    </tr>                
                    @foreach($tools as $tool)
                        <tr>
                            <th>{{$tool->id}}</th>
                            <th>{{$tool->toolName}}</th>
                            <th>{{$tool->description}}</th>
                        </tr>
                    @endforeach
                </table>
                    @foreach($tools as $tool)
                        <input type=hidden id="{{$tool->id}}" name="{{$tool->toolName}}" class="prjTools" value="{{$tool->description}}"></input>
                    @endforeach
            </div>
        </div>
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        <!-- ターンチップ用のコンテナ -->
        <div id="turnChipContainer" class="eachContainer">
            <span style="background-color: yellow;">↓★★★★マップ交互★★★★</span>
            @foreach($turnChips as $key1 => $prjDir)
                <div id="turnChip_{{$key1}}_containter">
                    <p id>■■■{{$key1}}</p> 
                    @foreach($prjDir as $key2 => $turnChipDir)
                        <p id="{{$key2}}">{{$key2}}</p>
                        @foreach($turnChipDir as $chipPng)
                            <img class="turn_{{$key2}}" id="{{$key2}}_{{$loop->index}}" alt="turnChip" src="../../map-editor/image/map-editor/map-chip/{{$key1}}/mapTurn/{{$key2}}/{{$chipPng}}">
                        @endforeach
                    @endforeach
                </div>
            @endforeach
            <span style="background-color: yellow;">↓★★★★マップパス交互★★★★</span>
            @foreach($turnPassChips as $key1 => $prjDir)
                <div id="turnChipPass_{{$key1}}_containter">
                    <p>■■■{{$key1}}</p> 
                    @foreach($prjDir as $key2 => $turnPassChipDir)
                        <p id="{{$key2}}">>{{$key2}}</p>
                        @foreach($turnPassChipDir as $chipPng)
                            <img class="turn_{{$key2}}" id="{{$key2}}_{{$loop->index}}" alt="turnChipPass" src="../../map-editor/image/map-editor/map-chip/{{$key1}}/mapTurnPass/{{$key2}}/{{$chipPng}}">
                        @endforeach
                    @endforeach
                </div>
            @endforeach        
        </div>
    </div>
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
        @foreach($sounds as $sound)
            <div class="eachSoundContainer eachContainer">
                <p class="soundNames">{{$sound['baseName']}}</p>
                <p class="soundNames">{{$sound['path']}}</p>
                <audio id={{$sound['path']}} preload="auto">
                    <!-- <source src="{{ asset('/sounds/bgm/SNES-Town01.mp3') }}" type="audio/mp3"> -->
                    <source src="{{ asset($sound['path']) }}" type="audio/mp3">
                    <p>※お使いのブラウザはHTML5のaudio要素をサポートしていないので音は鳴りません。</p>
                </audio>
            </div>
        @endforeach
        <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
    <img src="{{ asset('/image/mainCharacter_dummy.png') }}"/ id="dummy">
    <img src="{{ asset('/image/l.png') }}"/ id="l">
    <img src="{{ asset('/image/m.png') }}"/ id="m">
    <img src="{{ asset('/image/r.png') }}"/ id="r">
    <img src="{{ asset('/image/dr.png') }}"/ id="dr">
    <img src="{{ asset('/image/drr.png') }}"/ id="drr">
    <img src="{{ asset('/image/drl.png') }}"/ id="drl">
    <img src="{{ asset('/image/dl.png') }}"/ id="dl">
    <img src="{{ asset('/image/dlr.png') }}"/ id="dlr">
    <img src="{{ asset('/image/dll.png') }}"/ id="dll">
    <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
    <audio id="overSound" preload="auto">
        <!-- <source src="{{ asset('/sounds/effect/hokou.mp3') }}" type="audio/mp3"> -->
        <source src="{{ asset('/sounds/bgm/SNES-Town01.mp3') }}" type="audio/mp3">
        <!-- <source src="sound.ogg" type="audio/ogg"> -->
        <!-- <source src="sound.wav" type="audio/wav"> -->
        <p>※お使いのブラウザはHTML5のaudio要素をサポートしていないので音は鳴りません。</p>
    </audio>

    <button onclick="sound()">鳴るよ</button>
    <p>■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
<script src="{{ asset('/js/rpg-player.js') }}"></script>
</body>


