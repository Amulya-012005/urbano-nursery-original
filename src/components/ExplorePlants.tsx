import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ExplorePlants: React.FC = () => {
  const { products, nurseries } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNursery, setSelectedNursery] = useState<string>('all');
  const [selectedSunlight, setSelectedSunlight] = useState<string>('all');
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  const indoorCount = products.filter(p => p.category === 'Indoor Plants' || p.category === 'indoor').length;
  const floweringCount = products.filter(p => p.category === 'Flowering Plants' || p.category === 'flowering').length;
  const fruitCount = products.filter(p => p.category === 'Fruit Plants' || p.tags?.includes('Fruit Plants')).length;
  const careCount = products.filter(p => p.category === 'Composts & Care' || p.tags?.includes('Composts & Care')).length;
  const toolsCount = products.filter(p => (p.category === 'Gardening Items' || p.category === 'tools') && !p.tags?.includes('Composts & Care')).length;

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: `All Items (${products.length})` },
    { key: 'Fruit Plants', label: `Fruit Trees & Plants (${fruitCount})` },
    { key: 'Composts & Care', label: `Composts & Care Oils (${careCount})` },
    { key: 'Indoor Plants', label: `Indoor Plants (${indoorCount})` },
    { key: 'Flowering Plants', label: `Flowering Plants (${floweringCount})` },
    { key: 'Gardening Items', label: `Gardening Tools (${toolsCount})` }
  ];

  const filteredProducts = useMemo(() => {
    const raw = products
      .filter(product => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBotanical = product.botanicalName?.toLowerCase().includes(q);
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchNursery = product.nurseryName.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchTags = product.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchBotanical && !matchSku && !matchNursery && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'all') {
          const cat = product.category.toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (target.includes('fruit')) {
            if (!cat.includes('fruit') && !product.tags?.some(t => t.toLowerCase().includes('fruit'))) return false;
          } else if (target.includes('compost') || target.includes('care')) {
            if (!cat.includes('compost') && !cat.includes('care') && !product.tags?.some(t => t.toLowerCase().includes('compost') || t.toLowerCase().includes('care'))) return false;
          } else if (target.includes('indoor')) {
            if (!cat.includes('indoor')) return false;
          } else if (target.includes('flowering')) {
            if (!cat.includes('flowering')) return false;
          } else if (target.includes('gardening') || target.includes('tools')) {
            if ((!cat.includes('gardening') && !cat.includes('tools')) || product.tags?.includes('Composts & Care')) return false;
          }
        }

        // Nursery
        if (selectedNursery !== 'all' && product.nurseryId !== selectedNursery) {
          return false;
        }

        // Sunlight
        if (selectedSunlight !== 'all' && product.care?.sunlight !== selectedSunlight) {
          return false;
        }

        // Pet friendly
        if (petFriendlyOnly && (!product.care || !product.care.petFriendly)) {
          return false;
        }

        // Price
        if (product.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });

    // Enforce strict single display per product (no duplicates)
    const seen = new Set<string>();
    const unique: Product[] = [];
    for (const p of raw) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    return unique;
  }, [products, searchQuery, selectedCategory, selectedNursery, selectedSunlight, petFriendlyOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedNursery('all');
    setSelectedSunlight('all');
    setPetFriendlyOnly(false);
    setMaxPrice(2000);
    setSortBy('featured');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-950 font-serif-botanical">
          Explore Plants & Gardening Supplies
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Discover verified healthy nursery plants, heirloom seeds, clay pots, and nutrient-rich soils curated for Indian spaces.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plants, tools, terracotta, seeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-700"
          />
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <span className="text-xs text-stone-500 font-medium tabular-nums whitespace-nowrap">
            Showing <strong className="text-stone-900 font-semibold">{filteredProducts.length}</strong> products
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white/90 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Segmented Buttons */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-2.5">
                Category
              </label>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="font-semibold text-stone-800">Max Budget</label>
                <span className="font-bold text-emerald-950 tabular-nums">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 tabular-nums">
                <span>₹200</span>
                <span>₹2,500+</span>
              </div>
            </div>

            {/* Sunlight Needs */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-2">
                Sunlight Exposure
              </label>
              <select
                value={selectedSunlight}
                onChange={(e) => setSelectedSunlight(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
              >
                <option value="all">Any Sunlight</option>
                <option value="Low">Low Light / Shade</option>
                <option value="Medium">Medium Indirect</option>
                <option value="Bright Indirect">Bright Indirect</option>
                <option value="Full Sun">Full Direct Sunlight</option>
              </select>
            </div>

            {/* Nursery Origin */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-2">
                Nursery Partner
              </label>
              <select
                value={selectedNursery}
                onChange={(e) => setSelectedNursery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
              >
                <option value="all">All Accredited Nurseries</option>
                {nurseries.map(nur => (
                  <option key={nur.id} value={nur.id}>
                    {nur.businessName} ({nur.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Pet Friendly Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={petFriendlyOnly}
                  onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-800 accent-emerald-800 cursor-pointer"
                />
                <span>Non-toxic to pets (Cat/Dog safe)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center border border-stone-200/80">
              <p className="text-base font-bold text-stone-800 font-serif-botanical mb-1">
                No matching plants or products found
              </p>
              <p className="text-xs text-stone-500 mb-6">
                Try widening your price range, choosing another category, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
