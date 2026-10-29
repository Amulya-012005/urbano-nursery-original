import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Sprout, Wrench } from 'lucide-react';

interface ProductImageProps {
  product: Product;
  className?: string;
  imgClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
}) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [product.id, product.sku, product.imageUrl, product.image]);

  const rawUrl = product.imageUrl || product.image;
  const isTool = product.category === 'Gardening Items' || (product.category as string) === 'tools' || product.category === 'Composts & Care';

  // Fallback botanical plant card if image fails to load
  if (!rawUrl || rawUrl.trim() === '' || loadError) {
    return (
      <div
        key={`fallback-${product.id}`}
        className={`flex flex-col items-center justify-center p-4 text-center select-none bg-stone-900/90 border border-emerald-800/40 relative overflow-hidden ${className}`}
        style={{ minHeight: '160px' }}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center mb-2 shadow-inner">
          {isTool ? (
            <Wrench className="w-5 h-5 text-amber-400" />
          ) : (
            <Sprout className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <p className="text-xs font-bold text-amber-300 line-clamp-1">{product.name}</p>
        <p className="text-[10px] text-stone-400 font-mono mt-0.5">SKU: {product.sku || product.id}</p>
        <span className="inline-block mt-1 text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
          Urbano Verified Specimen
        </span>
      </div>
    );
  }

  return (
    <div key={`img-container-${product.id}`} className={`relative overflow-hidden ${className}`}>
      <img
        key={`img-${product.id}-${rawUrl}`}
        src={rawUrl}
        alt={product.name}
        className={imgClassName}
        loading="lazy"
        onError={() => setLoadError(true)}
      />
    </div>
  );
};
