<?php

use \App\Http\Middleware\SelectProjectMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', 'RpgPlayerController@selectProject')
    ->middleware('selectProject');

//プロジェクトの情報を取得しにいく
Route::post('/getProjectData', 'RpgPlayerController@getProjectData');

//マップ保存のアクションへ
// Route::post('/rpg-editor/saveEditedMap', 'RpgEditorController@saveEditedMap');
