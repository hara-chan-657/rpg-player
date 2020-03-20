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
        <p id="projectName">{{$project}}</p>
        @foreach($pngFiles as $pngFile)
            <div class="eachMapContainer">
                <p class="mapNames">{{$pngFile['baseName']}}</p>
                <img src={{$pngFile['path']}} id={{$pngFile['baseName']}} class='maps' width="200" height="150" alt="{{$pngFile['baseName']}}">
            </div>
        @endforeach
    </div>
<script src="{{ asset('/js/rpg-player.js') }}"></script>
</body>


