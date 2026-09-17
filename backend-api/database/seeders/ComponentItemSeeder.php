namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComponentItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('component_items')->insert([
            [
                'name' => 'React useState Hook Best Practices',
                'category' => 'Frontend',
                'stock' => 1,
                'price' => 0.00,
                'description' => 'การใช้งาน useState ใน React สำหรับจัดการสถานะ (State) ของคอมโพเนนต์อย่างมีประสิทธิภาพ',
                'how_to_use' => 'ใช้สำหรับจัดการค่าข้อมูลภายใน Component ที่ต้องการเปลี่ยนแปลง',
                'snippet' => 'const [state, setState] = useState(initialState);',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Laravel Eloquent Relationships: One-to-Many',
                'category' => 'Backend',
                'stock' => 1,
                'price' => 0.00,
                'description' => 'การเชื่อมโยงความสัมพันธ์ระหว่างตารางในฐานข้อมูลแบบ หนึ่งต่อหลาย (One-to-Many)',
                'how_to_use' => 'ใช้ใน Model เพื่อเชื่อมโยงข้อมูลระหว่างตาราง',
                'snippet' => 'public function posts() { return $this->hasMany(Post::class); }',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // สามารถคัดลอกเพิ่มรายการอื่นๆ ตามไฟล์ SQL ตรงนี้ได้เลยครับ
        ]);
    }
}