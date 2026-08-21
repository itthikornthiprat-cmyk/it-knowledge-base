<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ComponentItem;

class ComponentController extends Controller
{
    // ดึงข้อมูลทั้งหมด
    public function index()
    {
        return response()->json(ComponentItem::all());
    }

    // เพิ่มข้อมูลใหม่
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'how_to_use' => 'nullable|string', // ตรวจสอบค่า
            'snippet' => 'nullable|string',
        ]);

        $item = ComponentItem::create([
            'name' => $request->name,
            'category' => $request->category,
            'stock' => 1,
            'price' => 0,
            'description' => $request->description,
            'how_to_use' => $request->how_to_use, // บันทึกค่า
            'snippet' => $request->snippet,
        ]);

        return response()->json([
            'message' => 'บันทึกความรู้สำเร็จ',
            'item' => $item
        ], 201);
    }

    // แก้ไขข้อมูล (Update)
    public function update(Request $request, $id)
    {
        $item = ComponentItem::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'snippet' => 'nullable|string',
        ]);

        $item->update([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'snippet' => $request->snippet,
        ]);

        return response()->json([
            'message' => 'แก้ไขข้อมูลสำเร็จ',
            'item' => $item
        ]);
    }

    // ลบข้อมูล
    public function destroy($id)
    {
        $item = ComponentItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'ลบข้อมูลสำเร็จ']);
    }
}