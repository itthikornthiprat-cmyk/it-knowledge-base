<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('component_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('category');
        $table->integer('stock')->default(1);
        $table->decimal('price', 10, 2)->default(0);
        $table->text('description')->nullable(); // 1. ส่วนนี้ใช้ทำอะไร
        $table->text('how_to_use')->nullable();  // 2. นำไปใช้อย่างไร (เพิ่มใหม่)
        $table->text('snippet')->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('component_items');
    }
};