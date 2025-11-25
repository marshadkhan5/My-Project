import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FONTS, DEFAULT_CATEGORIES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Settings, Palette, BarChart3, Plus, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { settings, updateSettings } = useTheme();
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'stats'>('design');
  const [newCategory, setNewCategory] = useState("");

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'accentColor', value: string) => {
    updateSettings({ [key]: value });
  };

  const addCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      updateSettings({ categories: [...settings.categories, newCategory] });
      setNewCategory("");
    }
  };

  const removeCategory = (cat: string) => {
    updateSettings({ categories: settings.categories.filter(c => c !== cat) });
  };

  // Mock data for charts
  const chartData = [
    { name: 'Gen Knowledge', quizzes: 12 },
    { name: 'Science', quizzes: 19 },
    { name: 'History', quizzes: 8 },
    { name: 'Sports', quizzes: 15 },
    { name: 'Tech', quizzes: 22 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Settings</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('design')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'design' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Palette size={18} /> Appearance
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'content' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Settings size={18} /> Content
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart3 size={18} /> Statistics
            </button>
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
        
        {activeTab === 'design' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Design Settings</h1>
            
            {/* Colors */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Theme Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-300">Primary Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer border-none"
                    />
                    <input 
                      type="text" 
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-300">Accent Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer border-none"
                    />
                     <input 
                      type="text" 
                      value={settings.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Typography</h3>
              <div className="max-w-md">
                <label className="block text-sm font-medium mb-2 dark:text-slate-300">Font Family</label>
                <select 
                  value={settings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                  className="w-full px-4 py-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary"
                >
                  {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Management</h1>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Quiz Categories</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category..."
                  className="flex-1 px-4 py-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  onClick={addCategory}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.categories.map(cat => (
                  <span key={cat} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                    {cat}
                    <button onClick={() => removeCategory(cat)} className="text-slate-400 hover:text-red-500">
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-4xl space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Statistics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h4 className="text-sm text-slate-500 uppercase">Total Quizzes</h4>
                 <p className="text-3xl font-bold text-primary mt-2">1,248</p>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h4 className="text-sm text-slate-500 uppercase">Active Users</h4>
                 <p className="text-3xl font-bold text-accent mt-2">856</p>
               </div>
               <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h4 className="text-sm text-slate-500 uppercase">Files Processed</h4>
                 <p className="text-3xl font-bold text-slate-700 dark:text-white mt-2">3.2k</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-96">
              <h3 className="text-lg font-semibold mb-6 dark:text-white">Generations by Category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: settings.secondaryColor, border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="quizzes" fill={settings.primaryColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper for the X icon in categories
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Dashboard;