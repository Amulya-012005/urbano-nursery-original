import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { X, Heart, ShoppingBag, Sun, Droplets, Gauge, ShieldAlert, ShieldCheck, Star, Send } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const productReviews = reviews.filter(
    r => r.targetType === 'product' && r.targetId === selectedProduct.id
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      targetType: 'product',
      targetId: selectedProduct.id,
      authorName: reviewAuthor.trim() || 'Verified Plant Parent',
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl plant-card-gold rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200 text-stone-100">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Image Gallery */}
          <div className="relative bg-black/40 min-h-[340px] md:min-h-full overflow-hidden flex items-center justify-center">
            <ProductImage
              product={selectedProduct}
              className="w-full h-full min-h-[340px]"
              imgClassName="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="px-3 py-1 rounded-md bg-stone-950/85 backdrop-blur-md text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 border border-amber-400/40">
                SKU: {selectedProduct.sku || selectedProduct.id}
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                {selectedProduct.category}
              </span>
              {selectedProduct.isFeatured && (
                <span className="px-3 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-[11px] font-bold text-stone-950">
                  Curator's Choice
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto space-y-4">
            <div>
              {/* Nursery attribution */}
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nursery Grower / Partner:</span>
                <strong className="text-white font-semibold">{selectedProduct.nurseryName}</strong>
              </div>

              {/* Title & Botanical Name */}
              <h2 className="text-2xl font-bold text-white font-serif-botanical leading-tight">
                {selectedProduct.name}
              </h2>
              {selectedProduct.botanicalName && (
                <p className="text-xs italic text-stone-400 mt-1">
                  Botanical taxon: {selectedProduct.botanicalName}
                </p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 my-3 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white ml-1 tabular-nums">
                    {selectedProduct.rating}
                  </span>
                </div>
                <span className="text-stone-500">·</span>
                <span className="text-stone-300 font-medium">
                  {selectedProduct.reviewCount} Verified Reviews
                </span>
                <span className="text-stone-500">·</span>
                <span className={`text-[11px] font-semibold ${selectedProduct.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-2 py-3 border-y border-white/10">
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-stone-400 ml-auto">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <div className="py-3">
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Care Metrics Grid */}
              {selectedProduct.care && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Sunlight</p>
                      <p className="text-xs font-semibold text-white">{selectedProduct.care.sunlight}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Watering</p>
                      <p className="text-xs font-semibold text-white">{selectedProduct.care.water}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Difficulty</p>
                      <p className="text-xs font-semibold text-white">{selectedProduct.care.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {selectedProduct.care.petFriendly ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Pet Safety</p>
                      <p className="text-xs font-semibold text-white">
                        {selectedProduct.care.petFriendly ? 'Pet Friendly' : 'Keep Away from Pets'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Controls */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-black/40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-300 hover:bg-white/10 transition-colors text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="px-3 py-2 text-stone-300 hover:bg-white/10 transition-colors text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={selectedProduct.stock === 0}
                  className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹{(selectedProduct.price * quantity).toLocaleString('en-IN')})</span>
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Customer Reviews & Feedback */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white font-serif-botanical">
                Community Plant Reviews
              </h4>

              {productReviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic">Be the first to leave a verified review!</p>
              ) : (
                <div className="space-y-2">
                  {productReviews.map(rev => (
                    <div key={rev.id} className="p-3 bg-black/35 rounded-xl border border-white/10 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{rev.authorName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add review form */}
              <form onSubmit={handleSubmitReview} className="space-y-2 pt-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Sneha)"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Share your experience with this plant..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Post
                  </button>
                </div>
                {showReviewSuccess && (
                  <p className="text-[11px] text-emerald-400">Review added successfully!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
