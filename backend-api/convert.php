<?php
$content = file_get_contents('../it_ui_db.sql');
// ตัดคำสั่งควบคุม MySQL ออก
$content = preg_replace('/SET.*?;/s', '', $content);
$content = preg_replace('//*!.*?;\s*/s', '', $content);
// เปลี่ยนแบคติกเป็นเครื่องหมายคำพูดคู่หรือลบออก
$content = str_replace('`', '"', $content);
file_put_contents('clean_db.sql', $content);
echo "Converted successfully!";