//プロジェクト選択用view!

@extends('layouts.rpg-player-parent')


@component('components.rpg-player-header')

@endcomponent


@section('select-project')
    <form action="/rpg-player/public/getProjectData" method="POST">
    {{ csrf_field() }}
    <p>プロジェクトを選択してください</p>
    <p>{!! $data['projects'] !!}</P>
    <input type="submit">
</form>
@endsection