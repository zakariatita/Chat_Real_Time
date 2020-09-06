<?php

namespace App\Http\Controllers;

use App\Events\chatEvent;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class chatController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat()
    {
        return view('chat');
    }
    public function send(Request $request)
    {
        $user = User::find(Auth::id());
        $this->saveToSession($request);
        event(new chatEvent($request->message, $user));
    }

    public function saveToSession(Request $request)
    {
        session()->put('chat', $request->chat);
    }

    public function getOldMessage()
    {
        return session('chat');
    }

    public function deleteSession()
    {
        session()->forget('chat');
    }
}
