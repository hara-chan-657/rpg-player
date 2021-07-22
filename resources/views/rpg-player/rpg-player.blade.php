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
    <p>確認コマンド：console.log(mapObj);</p>

    <div id="projectsContainer">
        <p id="projectName">{{$project}}</p>
        @foreach($pngFiles as $pngFile)
            <div class="eachMapContainer">
                <p class="mapNames">{{$pngFile['baseName']}}</p>
                <img src="{{$pngFile['path']}}" id="{{$pngFile['baseName']}}" class='maps' width="200" height="150" alt="{{$pngFile['baseName']}}">
            </div>
        @endforeach
        @foreach($characters as $character)
            <div class="eachCharacterContainer">
                <p class="charaNames">{{$character['baseName']}}</p>
                <img src="{{$character['path']}}" id="{{$character['baseName']}}" class='chracters' width="200" height="150" alt="{{$character['baseName']}}">
            </div>
        @endforeach
    </div>
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

    <audio id="overSound" preload="auto">
        <!-- <source src="{{ asset('/sounds/effect/hokou.mp3') }}" type="audio/mp3"> -->
        <source src="{{ asset('/sounds/bgm/SNES-Town01.mp3') }}" type="audio/mp3">
        <!-- <source src="sound.ogg" type="audio/ogg"> -->
        <!-- <source src="sound.wav" type="audio/wav"> -->
        <p>※お使いのブラウザはHTML5のaudio要素をサポートしていないので音は鳴りません。</p>
    </audio>

    <button onclick="sound()">鳴るよ</button>
    
<script src="{{ asset('/js/rpg-player.js') }}"></script>
</body>


