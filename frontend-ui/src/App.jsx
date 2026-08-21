import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Cpu, BookOpen, Search, Plus, Trash2, Edit, Copy, Check, User, Mail, Key, CheckCircle, AlertCircle, ArrowRight, Code, LogOut, Bookmark, ShieldAlert } from 'lucide-react';
import logoImg from './logo.png'; // นำเข้าโลโก้ของคุณ

function App() {
  const [view, setView] = useState(() => localStorage.getItem('current_view') || 'welcome');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // กำหนดอีเมล Admin
  const ADMIN_EMAIL = 'itthikorn.thiprat@gmail.com';
  const isAdmin = user && user.email === ADMIN_EMAIL;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [knowledges, setKnowledges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  
  // State สำหรับจัดการการแก้ไขข้อมูล (Inline Edit)
  const [editingItem, setEditingItem] = useState(null);

  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('bookmarked_codes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Networking', 'Architecture'];

  useEffect(() => {
    localStorage.setItem('current_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('bookmarked_codes', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (view === 'dashboard') {
      fetchKnowledges();
    }
  }, [view]);

  const fetchKnowledges = async () => {
    try {
      const res = await axios.get('/api/components');
      setKnowledges(res.data);
    } catch (err) {
      console.log('ไม่สามารถดึงข้อมูลความรู้ได้', err);
    }
  };

  // ฟังก์ชันอัปเดตข้อมูล (แก้ไข)
  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`/api/components/${id}`, editingItem);
      setEditingItem(null); // ปิดโหมดแก้ไข
      fetchKnowledges(); // โหลดข้อมูลใหม่
    } catch (err) {
      alert('แก้ไขข้อมูลไม่สำเร็จ');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register', { name, email, password });
      setIsError(false);
      setMessage('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      setTimeout(() => setView('login'), 1500);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      setIsError(false);
      setMessage(response.data.message);
      
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setTimeout(() => setView('dashboard'), 1500);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.setItem('current_view', 'welcome');
    setView('welcome');
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(item => item !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const filteredKnowledges = knowledges.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.how_to_use && item.how_to_use.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTab = activeTab === 'all' || savedIds.includes(item.id);
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col justify-between">
      {/* Navbar แสดงทั้งรูปโลโก้และข้อความ I.T. KNOWLEDGE BASE */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(user ? 'dashboard' : 'welcome')}>
          <div className="flex items-center justify-center h-11">
            <img src={logoImg} alt="Logo" className="h-full w-auto object-contain rounded-xl" />
          </div>
          <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            I.T. KNOWLEDGE BASE
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium ${isAdmin ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'}`}>
                {isAdmin ? <ShieldAlert className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>{user.name} {isAdmin && '(Admin)'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => { setView('login'); setMessage(''); }}
                className="px-5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition cursor-pointer text-sm"
              >
                เข้าสู่ระบบ
              </button>
              <button 
                onClick={() => { setView('register'); setMessage(''); }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition cursor-pointer text-sm"
              >
                สมัครสมาชิก
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {view === 'welcome' && (
          <div className="max-w-4xl text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-4">
              <Code className="w-4 h-4" />
              <span>ศูนย์รวมความรู้และโค้ดตัวอย่างทุกสายเทคโนโลยี</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              รวบรวมองค์ความรู้ไอที <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                เพื่อการพัฒนาที่ไม่สิ้นสุด
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              คลังเก็บโค้ด คำอธิบาย และคู่มือความรู้ทางเทคนิค ค้นหาง่าย มีคำอธิบายการใช้งานชัดเจน และบันทึกเก็บไว้ดูได้ทันที
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              <button 
                onClick={() => setView('register')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-lg shadow-xl shadow-indigo-500/25 flex items-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>เริ่มต้นใช้งานคลังข้อมูล</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
            </div>
            {message && (
              <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm ${isError ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                {isError ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{message}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Name@gmail.com" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-indigo-500 transition text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">รหัสผ่าน</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-indigo-500 transition text-white" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer">
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        )}

        {view === 'register' && (
          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">สมัครสมาชิก</h2>
            </div>
            {message && (
              <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm ${isError ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                {isError ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{message}</span>
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="name" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-indigo-500 transition text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">อีเมล</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Name@gmail.com" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-indigo-500 transition text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-indigo-500 transition text-white" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer">
                ยืนยันการสมัครสมาชิก
              </button>
            </form>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in w-full px-4 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                  📚 คลังความรู้และโค้ดตัวอย่าง (Knowledge Base)
                </h2>
                <p className="text-slate-400 text-sm">ค้นหาข้อมูล ศึกษาคำอธิบายการทำงาน และบันทึกโค้ดเก็บไว้ใช้ได้ทันที</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  ทั้งหมด ({knowledges.length})
                </button>
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  <Bookmark className="w-3.5 h-3.5" /> โค้ดที่บันทึกไว้ ({savedIds.length})
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อหัวข้อ คำอธิบาย หรือโค้ด..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 pl-12 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800/60 text-slate-400 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && !editingItem && (
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> เพิ่มหัวข้อความรู้หรือโค้ดใหม่ (เฉพาะผู้ดูแลระบบ)
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const name = e.target.titleName.value;
                  const category = e.target.categoryName.value;
                  const description = e.target.descText.value;
                  const how_to_use = e.target.howToUseText.value;
                  const snippet = e.target.snippetCode.value;

                  try {
                    await axios.post('/api/components', { name, category, description, how_to_use, snippet });
                    e.target.reset();
                    fetchKnowledges();
                  } catch (err) {
                    alert('บันทึกข้อมูลไม่สำเร็จ');
                  }
                }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="titleName" type="text" placeholder="ชื่อหัวข้อ / ฟีเจอร์ (เช่น ระบบ Login ด้วย Laravel Sanctum)" required className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-white" />
                  <select name="categoryName" className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 text-white cursor-pointer">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  <textarea name="descText" rows="2" placeholder="1. ส่วนนี้ใช้ทำอะไร (Concept / ทฤษฎี)" required className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500/50 text-slate-200"></textarea>
                  <textarea name="howToUseText" rows="2" placeholder="2. นำไปใช้อย่างไรได้บ้าง (วิธีประยุกต์ใช้)" required className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500/50 text-slate-200"></textarea>
                  
                  <textarea name="snippetCode" rows="3" placeholder="วางโค้ดตัวอย่างที่นี่..." required className="md:col-span-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-amber-500/50 text-emerald-400"></textarea>
                  <button type="submit" className="md:col-span-2 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold shadow-lg shadow-amber-600/30 transition text-sm text-slate-900 cursor-pointer">
                    บันทึกเข้าคลังความรู้
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredKnowledges.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
                  ไม่พบข้อมูลความรู้ในหมวดหมู่นี้
                </div>
              ) : (
                filteredKnowledges.map((item) => {
                  const isSaved = savedIds.includes(item.id);
                  
                  if (editingItem && editingItem.id === item.id) {
                    return (
                      <div key={item.id} className="bg-slate-900/80 border border-amber-500/50 p-6 rounded-3xl backdrop-blur-xl flex flex-col space-y-4 shadow-lg shadow-amber-500/10">
                        <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                          <Edit className="w-4 h-4" /> กำลังแก้ไขข้อมูล
                        </h3>
                        <form onSubmit={(e) => handleUpdate(e, item.id)} className="space-y-3 flex-1 flex flex-col">
                          <input 
                            type="text" 
                            required 
                            value={editingItem.name} 
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                            placeholder="ชื่อหัวข้อ"
                          />
                          <select 
                            value={editingItem.category} 
                            onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                            className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none cursor-pointer"
                          >
                            {categories.filter(c => c !== 'All').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          
                          <textarea 
                            rows="2" 
                            value={editingItem.description || ''} 
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-amber-500 outline-none"
                            placeholder="1. ส่วนนี้ใช้ทำอะไร"
                          ></textarea>
                          <textarea 
                            rows="2" 
                            value={editingItem.how_to_use || ''} 
                            onChange={(e) => setEditingItem({...editingItem, how_to_use: e.target.value})}
                            className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-amber-500 outline-none"
                            placeholder="2. นำไปใช้อย่างไร"
                          ></textarea>
                          
                          <textarea 
                            rows="3" 
                            value={editingItem.snippet || ''} 
                            onChange={(e) => setEditingItem({...editingItem, snippet: e.target.value})}
                            className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-emerald-400 focus:border-amber-500 outline-none"
                            placeholder="โค้ดตัวอย่าง"
                          ></textarea>
                          <div className="flex gap-2 mt-auto pt-2">
                            <button type="submit" className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-900 rounded-xl font-bold transition text-sm cursor-pointer">
                              บันทึกการแก้ไข
                            </button>
                            <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition text-sm cursor-pointer">
                              ยกเลิก
                            </button>
                          </div>
                        </form>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-lg">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => toggleBookmark(item.id)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer mr-1 ${isSaved ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                              title="บันทึกโค้ดเก็บไว้"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            
                            {isAdmin && (
                              <>
                                <button 
                                  onClick={() => setEditingItem(item)}
                                  className="text-slate-500 hover:text-amber-400 transition cursor-pointer p-1"
                                  title="แก้ไขข้อมูล"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`ต้องการลบหัวข้อ "${item.name}" ใช่หรือไม่?`)) {
                                      try {
                                        await axios.delete(`/api/components/${item.id}`);
                                        fetchKnowledges();
                                      } catch (err) {
                                        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
                                      }
                                    }
                                  }}
                                  className="text-slate-500 hover:text-red-400 transition cursor-pointer p-1"
                                  title="ลบข้อมูล"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white mb-3">{item.name}</h3>
                          
                          <div className="space-y-2">
                            <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                              <span className="font-semibold text-indigo-400">💡 ใช้ทำอะไร:</span> {item.description || '-'}
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                              <span className="font-semibold text-emerald-400">🚀 นำไปใช้อย่างไร:</span> {item.how_to_use || '-'}
                            </p>
                          </div>

                        </div>

                        <div className="relative bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-40 mt-2">
                          <code>{item.snippet || 'ไม่มีโค้ดตัวอย่าง'}</code>
                        </div>
                      </div>

                      {item.snippet && (
                        <button 
                          onClick={() => copyToClipboard(item.snippet, item.id)}
                          className="flex items-center justify-center space-x-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-300 transition cursor-pointer"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedId === item.id ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกโค้ดตัวอย่าง'}</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;