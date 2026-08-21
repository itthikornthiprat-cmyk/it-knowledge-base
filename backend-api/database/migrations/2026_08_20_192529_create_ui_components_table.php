<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ui_components', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // เก็บชื่อชิ้นส่วน เช่น navbar,card
            $table->text('description')->nullable(); // เก็บคำอธิบายวิธีนำไปใช้
            $table->longText('code_html')->nullable(); // เก็บโค้ดดิบ HTML/Tailwind
            $table->string('category')->nullable(); // เก็บหมวดหมู่เพื่อให้แยกตามหัวข้อได้
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ui_components');
    }
};
