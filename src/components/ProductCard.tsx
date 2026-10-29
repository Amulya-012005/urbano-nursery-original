import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { Heart, ShoppingBag, Eye, Sun, Droplets, ShieldCheck, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between bg-emerald-950/80 border-2 border-amber-400/50 hover:border-amber-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_12px_36px_rgba(245,158,11,0.25)] backdrop-blur-md">
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-950/70 border-b border-amber-400/30">
        <ProductImage
          product={product}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* SKU Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-stone-950/85 backdrop-blur-md text-[10px] text-amber-300 font-mono font-bold border border-amber-400/50 shadow-sm flex items-center gap-1">
          <Tag className="w-2.5 h-2.5 text-amber-400" />
          <span>{product.sku || product.id}</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-900/50'
              : 'bg-stone-900/80 text-stone-300 hover:text-rose-400 hover:bg-stone-800 border border-stone-700/60'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Nursery attribution badge */}
        {product.nurseryName && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-[10px] text-stone-200 flex items-center gap-1 font-medium border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[140px]">{product.nurseryName}</span>
          </div>
        )}

        {/* Quick View Overlay on hover */}
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => setSelectedProduct(product)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5 text-stone-950" />
            <span>Care & Details</span>
          </button>
        </div>
      </div>

      {/* Product Content - Slight Green & Golden Yellow highlighted box */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-linear-to-b from-emerald-950/40 via-emerald-900/20 to-stone-950/60">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="uppercase tracking-wider font-bold text-amber-300/90 text-[10px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-stone-900/60 px-1.5 py-0.5 rounded border border-stone-800">
              <span className="text-amber-400">★</span>
              <span className="font-semibold text-amber-200 tabular-nums">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-bold text-emerald-50 hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Botanical Scientific Name */}
          {product.botanicalName && (
            <p className="text-[11px] italic text-emerald-200/60 line-clamp-1 mb-2">
              {product.botanicalName}
            </p>
          )}

          {/* Care Micro-Indicators */}
          {product.care && (
            <div className="flex items-center gap-3 text-[11px] text-stone-300 my-2 pt-2 border-t border-amber-400/20">
              <span className="flex items-center gap-1" title="Sunlight Requirement">
                <Sun className="w-3 h-3 text-amber-400" />
                <span className="text-xs">{product.care.sunlight}</span>
              </span>
              <span className="text-stone-500">·</span>
              <span className="flex items-center gap-1" title="Watering Schedule">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span className="text-xs">{product.care.water}</span>
              </span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-amber-400/25 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-amber-300 tabular-nums drop-shadow-xs">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-400 font-medium block">
                Only {product.stock} left in stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] text-rose-400 font-medium block">Out of stock</span>
            )}
          </div>

          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product, 1)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs ${
              product.stock === 0
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                : 'bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold shadow-md hover:shadow-amber-500/20 active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
