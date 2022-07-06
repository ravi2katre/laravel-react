<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

 // Password Reset Routes...
 Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
 Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.reset');
 Route::post('login', 'Auth\LoginController@login');
 Route::post('register', 'Auth\RegisterController@register');

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    Route::any('/logout', 'Auth\LoginController@logout');
});
