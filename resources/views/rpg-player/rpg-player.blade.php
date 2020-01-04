<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>rpg-player</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="apple-touch-icon" href=".png">
<!-- <link rel="stylesheet" href="{{ asset('/css/rpg-editor.css') }}"> -->
<link rel="stylesheet"
	href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
	integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
	crossorigin="anonymous">
</head>
<body>
    @component('components.rpg-player-header')

    @endcomponent

    <div id="mapContainer">
    <div id='currentMapContainer'>
        <div id='currentMap'>
            <canvas id="currentMapCanvas"></canvas>
            <img src="" id="currentMapImage" style="display:none">
        </div>
    </div>
    <div id="mapDataContainer">
        <p id="mapTypeName"></p>
        <div id="eventTrigger">
        </div>
        <div id="mapEvent">
        </div>
        <div id="editEventContainer">
            <div id="eventLists">
            </div>
        </div>
    </div>
    <div id="editEvent">
    </div>
    </div>    

    <div id="projectsContainer">
        <p id="projectName">{{$project}}</p>
        @foreach($pngFiles as $pngFile)
            <div class="eachMapContainer">
                <p class="mapNames" id={{$pngFile['baseName']}}>{{$pngFile['baseName']}}</p>
                <img src={{$pngFile['path']}} class='maps' width="200" height="150" alt="{{$pngFile['baseName']}}">
            </div>
        @endforeach
    </div>
    <div id="saveProjectContainer">
        <button id="saveMap">編集中マップをプロジェクトに保存</button>
    </div>
    <form name="map_data" action="rpg-editor/saveEditedMap" method="post">
        {{ csrf_field() }}
        <input type="hidden" name="map_obj_data" value="" />
        <input type="hidden" name="map_save_name" value="" />
        <input type="hidden" name="project_name" value="" />
    </form>
<script src="{{ asset('/js/rpg-editor.js') }}"></script>
</body>


