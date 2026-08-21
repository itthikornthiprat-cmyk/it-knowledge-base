<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComponentItem extends Model
{
    use HasFactory;

    // อนุญาตให้ฟิลด์เหล่านี้บันทึกข้อมูลลงฐานข้อมูลได้
    protected $fillable = [
        'name',
        'category',
        'stock',
        'price',
        'description',
        'how_to_use',
        'snippet'
    ];
}