import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, OrderStatus } from '../types';
import {
  Package,
  Plus,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Truck,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';

export const NurseryDashboard: React.FC = () => {
  const {
    currentUser,
    nurseries,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    orders,
    updateOrderStatus
  } = useApp();

  const currentNursery = nurseries.find(n => n.userId === currentUser.id) || nurseries[0];
  const nurseryProducts = products.filter(p => p.nurseryId === currentNursery.id);
  const incomingOrders = orders.filter(o => o.items.some(i => i.nurseryId === currentNursery.id));

  // Modal for Add/Edit Product
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState('');
  const [formBotanical, setFormBotanical] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Indoor Plants');
  const [formPrice, setFormPrice] = useState(499);
  const [formOriginalPrice, setFormOriginalPrice] = useState(699);
  const [formStock, setFormStock] = useState(25);
  const [formImage, setFormImage] = useState('/assets/heroes/monstera_hero.jpg');
  const [formDescription, setFormDescription] = useState('');
  const [formSunlight, setFormSunlight] = useState<'Low' | 'Medium' | 'Bright Indirect' | 'Full Sun'>('Bright Indirect');
  const [formWater, setFormWater] = useState<'Weekly' | 'Bi-weekly' | 'When soil dries' | 'Daily'>('When soil dries');
  const [formPetFriendly, setFormPetFriendly] = useState(true);

  // Sales metrics
  const totalSalesRevenue = incomingOrders.reduce((sum, order) => {
    const nurseryItemsTotal = order.items
      .filter(i => i.nurseryId === currentNursery.id)
      .reduce((s, i) => s + i.price * i.quantity, 0);
    return sum + nurseryItemsTotal;
  }, 0);

  const unitsSold = incomingOrders.reduce((sum, order) => {
    return sum + order.items.filter(i => i.nurseryId === currentNursery.id).reduce((s, i) => s + i.quantity, 0);
  }, 0);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBotanical('');
    setFormCategory('indoor');
    setFormPrice(499);
    setFormOriginalPrice(699);
    setFormStock(20);
    setFormImage('/assets/heroes/monstera_hero.jpg');
    setFormDescription('Vibrant nursery specimen grown in organic aerated coco-peat.');
    setFormSunlight('Bright Indirect');
    setFormWater('When soil dries');
    setFormPetFriendly(true);
    setProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBotanical(p.botanicalName || '');
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || p.price);
    setFormStock(p.stock);
    setFormImage(p.image);
    setFormDescription(p.description);
    if (p.care) {
      setFormSunlight(p.care.sunlight);
      setFormWater(p.care.water);
      setFormPetFriendly(p.care.petFriendly);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        botanicalName: formBotanical,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        stock: Number(formStock),
        image: formImage,
        description: formDescription,
        care: {
          sunlight: formSunlight,
          water: formWater,
          difficulty: 'Beginner',
          petFriendly: formPetFriendly
        }
      });
    } else {
      addProduct({
        name: formName,
        botanicalName: formBotanical,
        category: formCategory,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        stock: Number(formStock),
        nurseryId: currentNursery.id,
        nurseryName: currentNursery.businessName,
        image: formImage,
        description: formDescription,
        care: {
          sunlight: formSunlight,
          water: formWater,
          difficulty: 'Beginner',
          petFriendly: formPetFriendly
        },
        isFeatured: false
      });
    }

    setProductModalOpen(false);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Nursery Header Profile */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white bg-stone-100">
            <img
              src={currentNursery.image}
              alt={currentNursery.businessName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/image_f9900427.png';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-stone-900 font-serif-botanical">
                {currentNursery.businessName}
              </h1>
              {currentNursery.verifiedStatus === 'verified' && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified Nursery</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Proprietor: {currentNursery.ownerName} · License: {currentNursery.licenseNumber} · Est. {currentNursery.establishedYear}
            </p>
            <p className="text-xs text-stone-600 mt-1">
              {currentNursery.location}, {currentNursery.city} · ★{currentNursery.rating} ({currentNursery.reviewCount} customer reviews)
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant / Product</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-emerald-950 tabular-nums">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">From fulfilled customer orders</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Active Listings</span>
            <Package className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900 tabular-nums">
            {nurseryProducts.length}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Live in Urbano catalog</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Units Shipped</span>
            <Truck className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900 tabular-nums">
            {unitsSold}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Acclimatized botanicals</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold uppercase">Pending Orders</span>
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 tabular-nums">
            {incomingOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
          </p>
          <p className="text-[10px] text-stone-400 mt-1">Awaiting dispatch</p>
        </div>
      </div>

      {/* Incoming Orders Manager */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
          Incoming Customer Orders ({incomingOrders.length})
        </h2>

        {incomingOrders.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center italic">
            No incoming customer orders at the moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items Ordered</th>
                  <th className="py-2.5 px-3">City & Address</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {incomingOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      #{order.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-stone-900">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400">{order.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      {order.items
                        .filter(i => i.nurseryId === currentNursery.id)
                        .map((item, idx) => (
                          <div key={idx} className="truncate max-w-[200px]">
                            {item.quantity}x {item.productName}
                          </div>
                        ))}
                    </td>
                    <td className="py-3 px-3 text-stone-600 truncate max-w-[180px]">
                      {order.deliveryAddress}, {order.city}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'out_for_delivery' ? 'bg-sky-100 text-sky-800' :
                        order.status === 'packed' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog & Inventory Table */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
            Nursery Inventory & Stock Management ({nurseryProducts.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-semibold">
                <th className="py-2.5 px-3">Plant / Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Price (₹)</th>
                <th className="py-2.5 px-3">Stock Units</th>
                <th className="py-2.5 px-3">Availability</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {nurseryProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/heroes/monstera_hero.jpg';
                      }}
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{prod.name}</p>
                      <p className="text-[10px] italic text-stone-400">{prod.botanicalName}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] text-stone-600 font-mono">
                    {prod.category}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-950 tabular-nums">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 tabular-nums font-semibold">
                    {prod.stock} left
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      className="flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      {prod.stock > 0 ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-700" />
                          <span className="text-emerald-700 font-semibold">In Stock</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-stone-400" />
                          <span className="text-rose-600 font-semibold">Out of Stock</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl overflow-hidden border border-white/80 shadow-2xl p-6 sm:p-8 bg-white my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-stone-900 font-serif-botanical mb-1">
              {editingProduct ? 'Edit Botanical Product' : 'Add New Plant / Product'}
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Listing under {currentNursery.businessName}
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Botanical Taxon</label>
                  <input
                    type="text"
                    value={formBotanical}
                    onChange={(e) => setFormBotanical(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="indoor">Indoor Plants</option>
                    <option value="outdoor">Outdoor Plants</option>
                    <option value="flowering">Flowering</option>
                    <option value="pots">Pots & Planters</option>
                    <option value="tools">Tools</option>
                    <option value="soil">Soil & Fertilizer</option>
                    <option value="seeds">Seeds</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="50"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Sunlight Exposure</label>
                  <select
                    value={formSunlight}
                    onChange={(e) => setFormSunlight(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="Low">Low Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Bright Indirect">Bright Indirect</option>
                    <option value="Full Sun">Full Sun</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Watering Schedule</label>
                  <select
                    value={formWater}
                    onChange={(e) => setFormWater(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="When soil dries">When soil dries</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Product Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product to Store'}
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
