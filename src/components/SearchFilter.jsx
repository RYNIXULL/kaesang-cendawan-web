import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function SearchFilter({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full">
      {/* Search Bar */}
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl
                     focus:ring-2 focus:ring-[#4a7c59]/20 focus:border-[#4a7c59] outline-none
                     transition-all text-sm font-medium text-slate-700
                     placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap
              ${selectedCategory === 'Semua'
                ? 'bg-[#4a7c59] text-white shadow-md shadow-[#4a7c59]/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#4a7c59] hover:text-[#4a7c59] hover:shadow-md'
              }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap
                ${selectedCategory === cat
                  ? 'bg-[#4a7c59] text-white shadow-md shadow-[#4a7c59]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#4a7c59] hover:text-[#4a7c59] hover:shadow-md'
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