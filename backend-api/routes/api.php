<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComponentController;

Route::get('/components', [ComponentController::class, 'index']);
Route::post('/components', [ComponentController::class, 'store']);
Route::delete('/components/{id}', [ComponentController::class, 'destroy']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::put('/components/{id}', [ComponentController::class, 'update']);