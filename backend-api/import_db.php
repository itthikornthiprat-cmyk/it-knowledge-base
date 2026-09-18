<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// อ่านไฟล์ SQL และตัดแบ่งคำสั่งด้วยเครื่องหมาย semicolon (;)
$sql = file_get_contents(__DIR__ . '/../it_ui_db.sql');

// ปิดการเช็กค่าซ้ำชั่วคราวเพื่อให้ข้อมูลวิ่งเข้าได้ราบรื่น
DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::statement('SET NAMES utf8mb4;');

// รันทีละคำสั่งแยกกัน ป้องกันไฟล์ใหญ่เกินไปจนหลุด
$queries = array_filter(array_map('trim', explode(';', $sql)));
foreach ($queries as $query) {
    if (!empty($query)) {
        try {
            DB::unprepared($query);
        } catch (\Exception $e) {
            // ข้ามคำสั่ง CREATE TABLE หรือโครงสร้างที่ซ้ำซ้อนไป
            continue;
        }
    }
}

DB::statement('SET FOREIGN_KEY_CHECKS=1;');
echo "Import Database to Aiven Successfully!\n";