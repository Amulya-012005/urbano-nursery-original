const fs = require('fs');

let code = fs.readFileSync('src/components/AdminModulePage.tsx', 'utf8');

// 1. Add imports if needed
if (!code.includes('ProductImage')) {
  code = code.replace(
    `import { UrbanoLogo } from './UrbanoLogo';`,
    `import { UrbanoLogo } from './UrbanoLogo';\nimport { ProductImage } from './ProductImage';`
  );
}

if (!code.includes('UploadCloud')) {
  code = code.replace(
    `  Filter\n} from 'lucide-react';`,
    `  Filter,\n  Image as ImageIcon,\n  UploadCloud,\n  AlertTriangle,\n  RotateCcw\n} from 'lucide-react';`
  );
}

// 2. Add methods from useApp
code = code.replace(
  `    allUsers,\n    setActiveTab\n  } = useApp();`,
  `    allUsers,\n    setActiveTab,\n    approveProductImage,\n    rejectProductImage,\n    removeProductImage,\n    assignProductImage,\n    missingImagesCount,\n    verifiedImagesCount\n  } = useApp();`
);

// 3. Update adminTab type
code = code.replace(
  `const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'verification' | 'analytics' | 'complaints'>('orders');`,
  `const [adminTab, setAdminTab] = useState<'orders' | 'images' | 'products' | 'verification' | 'analytics' | 'complaints'>('orders');`
);

// 4. Update newProduct submit in handleCreateProduct
code = code.replace(
  `    addProduct({\n      name: newProduct.name,\n      category: newProduct.category,\n      price: Number(newProduct.price),\n      originalPrice: Number(newProduct.originalPrice),\n      stock: Number(newProduct.stock),\n      image: newProduct.image,\n      description: newProduct.description || 'Premium botanical nursery specimen curated by platform horticulturists.',\n      care: newProduct.care,\n      nurseryId: nurseries[0]?.id || 'nursery-1',\n      nurseryName: newProduct.uploadedByGardener || nurseries[0]?.businessName || 'GreenRoots Nursery'\n    });`,
  `    addProduct({\n      sku: 'PRD-' + Math.floor(100 + Math.random() * 900),\n      currency: 'INR',\n      imageUrl: newProduct.image,\n      imageVerified: false,\n      name: newProduct.name,\n      category: newProduct.category,\n      price: Number(newProduct.price),\n      originalPrice: Number(newProduct.originalPrice),\n      stock: Number(newProduct.stock),\n      image: newProduct.image,\n      description: newProduct.description || 'Premium botanical nursery specimen curated by platform horticulturists.',\n      care: newProduct.care,\n      nurseryId: nurseries[0]?.id || 'nursery-1',\n      nurseryName: newProduct.uploadedByGardener || nurseries[0]?.businessName || 'GreenRoots Nursery'\n    });`
);

// 5. Add Image tab states right after adminTab definition
const imageStates = `  // Image Approval & Upload Management States
  const [imageApprovalFilter, setImageApprovalFilter] = useState<'all' | 'missing' | 'verified'>('all');
  const [imageCategoryFilter, setImageCategoryFilter] = useState<string>('all');
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [selectedUploadProductId, setSelectedUploadProductId] = useState<string>('');
  const [uploadFilePreview, setUploadFilePreview] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showNotificationMsg = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleImageFileSelected = (prod: Product, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewProduct(prod);
      setPreviewDataUrl(dataUrl);
      setPreviewModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishImage = () => {
    if (!previewProduct || !previewDataUrl) return;
    approveProductImage(previewProduct.id, previewDataUrl);
    setPreviewModalOpen(false);
    showNotificationMsg(\`Image successfully approved & published for \${previewProduct.name} (\${previewProduct.sku})\`);
    setPreviewProduct(null);
    setPreviewDataUrl(null);
  };

  const handleRemoveProductImage = (prod: Product) => {
    if (confirm(\`Remove image for \${prod.name}? It will revert to "Image coming soon" on the public shop.\`)) {
      removeProductImage(prod.id);
      showNotificationMsg(\`Image removed for \${prod.name}. Now displaying "Image coming soon".\`);
    }
  };
`;

code = code.replace(
  `  // Sub-tabs for monitoring (Orders vs Service Bookings)`,
  `${imageStates}\n  // Sub-tabs for monitoring (Orders vs Service Bookings)`
);

// 6. Add tab to header tab list
const oldTabsArray = `          {[
            {
              id: 'orders',
              label: \`Customer Orders & Delivery (\${orders.length})\`,
              icon: Truck
            },
            {
              id: 'products',
              label: \`Gardener Uploads & Catalog (\${products.length})\`,
              icon: Package
            },`;

const newTabsArray = `          {[
            {
              id: 'orders',
              label: \`Customer Orders & Delivery (\${orders.length})\`,
              icon: Truck
            },
            {
              id: 'images',
              label: \`Image Approval & Upload (\${missingImagesCount} Missing)\`,
              icon: ImageIcon,
              badge: missingImagesCount > 0 ? \`\${missingImagesCount} Awaiting\` : null
            },
            {
              id: 'products',
              label: \`Gardener Uploads & Catalog (\${products.length})\`,
              icon: Package
            },`;

code = code.replace(oldTabsArray, newTabsArray);

// 7. Inject the images workspace JSX right before products tab
const imagesWorkspaceJsx = `
        {/* =========================================================================
            IMAGE UPLOAD AND APPROVAL SYSTEM (STRICT BOTANICAL CATALOGUE)
           ========================================================================= */}
        {adminTab === 'images' && (
          <div className="space-y-6">
            {/* Success Toast */}
            {actionSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-900/90 border border-emerald-400 text-emerald-100 flex items-center justify-between shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-semibold">{actionSuccessMsg}</span>
                </div>
                <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-300 hover:text-white text-xs font-bold px-2 py-1">
                  Dismiss
                </button>
              </div>
            )}

            {/* Top KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-xs font-medium">Approved Products</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">{products.length}</div>
                <p className="text-[11px] text-amber-200/60 mt-1">Single source of truth (175 items)</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-emerald-400/40 shadow-lg">
                <div className="flex items-center justify-between text-emerald-200/80 mb-1">
                  <span className="text-xs font-medium">Verified Images</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-300 tabular-nums">{verifiedImagesCount}</div>
                <p className="text-[11px] text-emerald-200/60 mt-1">Publicly displayed to customers</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-rose-400/40 shadow-lg">
                <div className="flex items-center justify-between text-rose-200/80 mb-1">
                  <span className="text-xs font-medium">Missing Approved Images</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-300 tabular-nums">{missingImagesCount}</div>
                <p className="text-[11px] text-rose-200/60 mt-1">Clean "Image coming soon" box</p>
              </div>

              <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 shadow-lg">
                <div className="flex items-center justify-between text-amber-200/80 mb-1">
                  <span className="text-xs font-medium">Catalogue Coverage</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {Math.round((verifiedImagesCount / products.length) * 100)}%
                </div>
                <p className="text-[11px] text-amber-200/60 mt-1">Zero unverified or random images</p>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="plant-card-gold p-5 rounded-2xl border border-amber-400/40 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span>Product Image Approval & Catalogue Curator</span>
                  </h3>
                  <p className="text-xs text-amber-100/70 mt-0.5">
                    Upload, preview, approve, replace, or remove images. Only verified approved assets appear on the public shopping website.
                  </p>
                </div>

                {/* Quick Upload Button */}
                <button
                  onClick={() => setUploadDrawerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer self-start md:self-auto"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Assign to SKU</span>
                </button>
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                <span className="text-xs text-stone-400 font-semibold mr-1">Status:</span>
                {[
                  { key: 'all', label: \`All Items (\${products.length})\` },
                  { key: 'missing', label: \`Missing Images (\${missingImagesCount})\` },
                  { key: 'verified', label: \`Verified Approved (\${verifiedImagesCount})\` }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setImageApprovalFilter(st.key as any)}
                    className={\`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors \${
                      imageApprovalFilter === st.key
                        ? 'bg-amber-600 text-white border border-amber-400 shadow-sm'
                        : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
                    }\`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Category Filter & Search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by SKU (e.g. IND-001) or plant name..."
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-900/80 border border-white/15 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <select
                    value={imageCategoryFilter}
                    onChange={(e) => setImageCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">All Categories (175 Products)</option>
                    <option value="Indoor Plants">Indoor Plants (50)</option>
                    <option value="Outdoor Plants">Outdoor Plants (50)</option>
                    <option value="Flowering Plants">Flowering Plants (50)</option>
                    <option value="Gardening Items">Gardening Items (25)</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      setImageApprovalFilter('all');
                      setImageCategoryFilter('all');
                      setImageSearchQuery('');
                    }}
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Image Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Table with Inline Image Uploader & Approver */}
            <div className="plant-card-gold rounded-2xl border border-amber-400/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950/80 text-amber-200/90 uppercase text-[10px] tracking-wider border-b border-amber-400/30">
                    <tr>
                      <th className="py-3 px-4">Preview</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-4">Image Approval Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-stone-200">
                    {products
                      .filter((prod) => {
                        // Status filter
                        if (imageApprovalFilter === 'missing' && prod.imageVerified && prod.imageUrl) return false;
                        if (imageApprovalFilter === 'verified' && (!prod.imageVerified || !prod.imageUrl)) return false;

                        // Category filter
                        if (imageCategoryFilter !== 'all') {
                          if (prod.category !== imageCategoryFilter && !prod.category.toLowerCase().includes(imageCategoryFilter.toLowerCase())) {
                            return false;
                          }
                        }

                        // Search query
                        if (imageSearchQuery.trim()) {
                          const q = imageSearchQuery.toLowerCase();
                          const matchName = prod.name.toLowerCase().includes(q);
                          const matchSku = prod.sku?.toLowerCase().includes(q);
                          const matchBotanical = prod.botanicalName?.toLowerCase().includes(q);
                          if (!matchName && !matchSku && !matchBotanical) return false;
                        }

                        return true;
                      })
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                          {/* Preview Column */}
                          <td className="py-3 px-4">
                            <div className="w-16 h-14 rounded-lg overflow-hidden border border-amber-400/40 bg-stone-900 flex items-center justify-center">
                              <ProductImage
                                product={prod}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover"
                              />
                            </div>
                          </td>

                          {/* SKU Column */}
                          <td className="py-3 px-3 font-mono font-bold text-amber-300">
                            {prod.sku || prod.id}
                          </td>

                          {/* Name Column */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-white hover:text-amber-300">{prod.name}</p>
                            {prod.botanicalName && (
                              <p className="text-[10px] italic text-amber-200/60">{prod.botanicalName}</p>
                            )}
                          </td>

                          {/* Category Column */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                              {prod.category}
                            </span>
                          </td>

                          {/* Price Column */}
                          <td className="py-3 px-3 font-bold text-amber-300 tabular-nums">
                            ₹{prod.price}
                          </td>

                          {/* Status Badge Column */}
                          <td className="py-3 px-4">
                            {prod.imageVerified && prod.imageUrl ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-400/40">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Verified & Approved</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-400/40">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                <span>Image Coming Soon</span>
                              </span>
                            )}
                          </td>

                          {/* Actions Column */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Upload Image Button */}
                              <label className="px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer border border-emerald-500/40 flex items-center gap-1.5 shadow-sm transition-all">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>{prod.imageVerified ? 'Replace' : 'Upload'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleImageFileSelected(prod, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>

                              {/* Remove image button if verified */}
                              {prod.imageVerified && prod.imageUrl && (
                                <button
                                  onClick={() => handleRemoveProductImage(prod)}
                                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 cursor-pointer transition-colors"
                                  title="Remove Image (reverts to 'Image coming soon')"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preview & Approval Modal */}
            {previewModalOpen && previewProduct && previewDataUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="plant-card-gold rounded-3xl border-2 border-amber-400/60 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-amber-400" />
                      <span>Preview Image Before Publishing</span>
                    </h3>
                    <button
                      onClick={() => setPreviewModalOpen(false)}
                      className="p-1 rounded-full text-stone-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Image Preview Box */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-950 border border-amber-400/40">
                    <img
                      src={previewDataUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-amber-300 font-mono text-xs font-bold border border-amber-400/50">
                      SKU: {previewProduct.sku}
                    </div>
                  </div>

                  {/* Target Product Confirmation */}
                  <div className="bg-stone-950/60 p-4 rounded-xl border border-white/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-400">Target Product:</span>
                      <strong className="text-white font-semibold">{previewProduct.name}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-400">Category:</span>
                      <span className="text-amber-300 font-medium">{previewProduct.category}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-400">Market Price:</span>
                      <span className="text-white font-bold">₹{previewProduct.price}</span>
                    </div>
                  </div>

                  {/* Notice */}
                  <p className="text-[11px] text-amber-200/70">
                    Once approved, this image will immediately go live on the customer shopping catalogue and product cards.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setPreviewModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel / Discard
                    </button>
                    <button
                      onClick={handlePublishImage}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish to Shop</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Upload & Assign Drawer / Modal */}
            {uploadDrawerOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="plant-card-gold rounded-3xl border-2 border-amber-400/60 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-amber-400" />
                      <span>Upload & Assign Image to Product</span>
                    </h3>
                    <button
                      onClick={() => {
                        setUploadDrawerOpen(false);
                        setSelectedUploadProductId('');
                        setUploadFilePreview(null);
                      }}
                      className="p-1 rounded-full text-stone-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Picker */}
                  <div>
                    <label className="text-xs font-bold text-amber-200 block mb-1">
                      Select Target Product / SKU:
                    </label>
                    <select
                      value={selectedUploadProductId}
                      onChange={(e) => setSelectedUploadProductId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="">-- Choose from 175 Products --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.sku} | {p.name} ({p.category}) - ₹{p.price} {p.imageVerified ? '✓ Verified' : '⚠️ Missing'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Selector */}
                  <div>
                    <label className="text-xs font-bold text-amber-200 block mb-1">
                      Choose Image File from Computer:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setUploadFilePreview(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Live Preview if chosen */}
                  {uploadFilePreview && (
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-950 border border-amber-400/40">
                      <img
                        src={uploadFilePreview}
                        alt="Upload Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setUploadDrawerOpen(false);
                        setSelectedUploadProductId('');
                        setUploadFilePreview(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedUploadProductId || !uploadFilePreview}
                      onClick={() => {
                        if (!selectedUploadProductId || !uploadFilePreview) return;
                        approveProductImage(selectedUploadProductId, uploadFilePreview);
                        setUploadDrawerOpen(false);
                        setSelectedUploadProductId('');
                        setUploadFilePreview(null);
                        showNotificationMsg('Image successfully assigned & published!');
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Assign</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
`;

code = code.replace(
  `        {/* =========================================================================\n            FEATURE 2: WHICH GARDENER HAS UPLOADED WHICH ITEM & GARDENER MONITORING\n           ========================================================================= */}`,
  `${imagesWorkspaceJsx}\n        {/* =========================================================================\n            FEATURE 2: WHICH GARDENER HAS UPLOADED WHICH ITEM & GARDENER MONITORING\n           ========================================================================= */}`
);

fs.writeFileSync('src/components/AdminModulePage.tsx', code, 'utf8');
console.log('Successfully updated AdminModulePage.tsx with Image Approval System!');
