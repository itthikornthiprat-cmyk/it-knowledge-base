<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

// โหลดไฟล์ SQL มาอ่าน
$sql = File::get(base_path('../it_ui_db.sql'));

// รันคำสั่ง SQL ทีละชุดเข้า Aiven
DB::unprepared($sql);

echo "Import Database to Aiven Successfully!";