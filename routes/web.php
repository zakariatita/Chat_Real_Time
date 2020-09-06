<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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

Route::get('/', function () {
    return view('welcome');
});
Route::get('chat', 'chatController@chat');
Route::post('send', 'chatController@send');
Route::post('getOldMessage', 'chatController@getOldMessage');
Route::post('saveToSession', 'chatController@saveToSession');
Route::post('deleteSession', 'chatController@deleteSession');
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
