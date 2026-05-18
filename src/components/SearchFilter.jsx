import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function SearchFilter({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) {
  return (
    <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center w-full justify-between">
      {/* Search Bar */}
      <div className="relative flex-grow max-w-lg relative group">
        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#4a7c59] transition-colors" />
        <input
          type="text"
          placeholder="Cari cendawan premium..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-11 py-3.5 bg-white/55 backdrop-blur-md border border-white/60 rounded-2xl
                     focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-[#4a7c59] outline-none
                     shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02)] focus:shadow-xl transition-all duration-300 text-sm font-semibold text-slate-700
                     placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full p-1 transition-all active:scale-90"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <div className="flex items-center gap-2 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/50 p-1.5 rounded-2xl">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap active:scale-95
              ${selectedCategory === 'Semua'
                ? 'bg-[#4a7c59] text-white shadow-[2px_4px_10px_rgba(74,124,89,0.3)]'
                : 'bg-white/60 text-slate-600 border border-white hover:bg-white hover:text-[#4a7c59] shadow-sm hover:shadow'
              }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap active:scale-95
                ${selectedCategory === cat
                  ? 'bg-[#4a7c59] text-white shadow-[2px_4px_10px_rgba(74,124,89,0.3)]'
                  : 'bg-white/60 text-slate-600 border border-white hover:bg-white hover:text-[#4a7c59] shadow-sm hover:shadow'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}