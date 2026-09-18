<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComponentItem extends Model
{
    use HasFactory;

    protected $table = 'components'; // <-- เปลี่ยนตรงนี้ให้ตรงกับชื่อตารางจริงใน Aiven

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