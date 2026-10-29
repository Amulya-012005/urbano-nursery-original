import { ProductImage } from './ProductImage';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Building2,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  Star,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';
import { OrderStatus, BookingStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    nurseries,
    updateNurseryStatus,
    gardeners,
    updateGardenerStatus,
    products,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    bookings,
    updateBookingStatus,
    complaints,
    updateComplaintStatus,
    allUsers
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'products' | 'orders' | 'bookings' | 'complaints'>('overview');
  const [resolutionInput, setResolutionInput] = useState<{ [key: string]: string }>({});

  // Analytics calculation from actual stored data
  const totalProductSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalServicesRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const platformGMV = totalProductSales + totalServicesRevenue;
  const pendingNurseries = nurseries.filter(n => n.verifiedStatus === 'pending');
  const pendingGardeners = gardeners.filter(g => g.verifiedStatus === 'pending');
  const totalPendingVerifications = pendingNurseries.length + pendingGardeners.length;
  const openComplaints = complaints.filter(c => c.status !== 'resolved');

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-white/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-stone-900 font-serif-botanical">
                Platform Administration Console
              </h1>
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                Master Authority
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Oversight for partner accreditation, dispute resolution, product catalog, and transaction integrity.
            </p>
          </div>
        </div>

        {totalPendingVerifications > 0 && (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>{totalPendingVerifications} Partner Accreditation Applications Pending</span>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {[
          { key: 'overview', label: 'Platform Analytics', icon: TrendingUp },
          { key: 'verification', label: `Partner Verification (${totalPendingVerifications})`, icon: Award },
          { key: 'products', label: `Catalog Management (${products.length})`, icon: Package },
          { key: 'orders', label: `Orders Master Log (${orders.length})`, icon: FileText },
          { key: 'bookings', label: `Services & Visits (${bookings.length})`, icon: Calendar },
          { key: 'complaints', label: `Complaints & Disputes (${openComplaints.length})`, icon: AlertCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase text-stone-500">Platform GMV</span>
              <p className="text-2xl font-bold text-emerald-950 tabular-nums mt-1">
                ₹{platformGMV.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">Products + Home Visits</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase text-stone-500">Total Customer Orders</span>
              <p className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {orders.length}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">₹{totalProductSales.toLocaleString('en-IN')} fulfilled</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase text-stone-500">Gardener Visits</span>
              <p className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {bookings.length}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">₹{totalServicesRevenue.toLocaleString('en-IN')} volume</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase text-stone-500">Registered Users</span>
              <p className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
                {allUsers.length}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">Customers & Vendors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 font-serif-botanical mb-3">
                Partner Nurseries ({nurseries.length})
              </h3>
              <div className="space-y-3">
                {nurseries.map(n => (
                  <div key={n.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50">
                    <div>
                      <p className="font-semibold text-stone-900">{n.businessName}</p>
                      <p className="text-[10px] text-stone-500">{n.city} · Lic: {n.licenseNumber}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      n.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {n.verifiedStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 font-serif-botanical mb-3">
                Accredited Horticulturists ({gardeners.length})
              </h3>
              <div className="space-y-3">
                {gardeners.map(g => (
                  <div key={g.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50">
                    <div>
                      <p className="font-semibold text-stone-900">{g.fullName}</p>
                      <p className="text-[10px] text-stone-500">{g.experienceYears}y exp · ₹{g.hourlyRate}/hr</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      g.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.verifiedStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 font-serif-botanical mb-3">
                Quality & Dispute Health
              </h3>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span>Open Complaints:</span>
                  <span className="font-bold text-amber-700 tabular-nums">{openComplaints.length}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span>Resolved Disputes:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {complaints.filter(c => c.status === 'resolved').length}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span>Avg Customer Satisfaction:</span>
                  <span className="font-bold text-stone-900 tabular-nums">4.9 / 5.0</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>7-Day Replacement Ratio:</span>
                  <span className="font-bold text-stone-900 tabular-nums">0.6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Partner Verification Queue */}
      {activeTab === 'verification' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
              Partner Accreditation & Document Verification Queue
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review government horticulture licenses, nursery registration docs, and professional ID credentials.
            </p>
          </div>

          <div className="space-y-4">
            {/* Nurseries */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Nursery Partners ({nurseries.length})
            </h3>
            <div className="space-y-3">
              {nurseries.map(nur => (
                <div key={nur.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-900 text-sm">{nur.businessName}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        nur.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        nur.verifiedStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {nur.verifiedStatus}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Owner: {nur.ownerName} · {nur.location}, {nur.city} · Est. {nur.establishedYear}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono mt-1">
                      Submitted License: <strong>{nur.licenseNumber}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {nur.verifiedStatus !== 'verified' && (
                      <button
                        onClick={() => updateNurseryStatus(nur.id, 'verified')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve License</span>
                      </button>
                    )}
                    {nur.verifiedStatus !== 'rejected' && (
                      <button
                        onClick={() => updateNurseryStatus(nur.id, 'rejected')}
                        className="px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Gardeners */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 pt-4">
              Gardener Specialists ({gardeners.length})
            </h3>
            <div className="space-y-3">
              {gardeners.map(g => (
                <div key={g.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-stone-900 text-sm">{g.fullName}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        g.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        g.verifiedStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.verifiedStatus}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Experience: {g.experienceYears} Years · Base Rate: ₹{g.hourlyRate}/hr
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono mt-1">
                      Certification: <strong>{g.certificateName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {g.verifiedStatus !== 'verified' && (
                      <button
                        onClick={() => updateGardenerStatus(g.id, 'verified')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accredit Specialist</span>
                      </button>
                    )}
                    {g.verifiedStatus !== 'rejected' && (
                      <button
                        onClick={() => updateGardenerStatus(g.id, 'rejected')}
                        className="px-3 py-2 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Catalog Management */}
      {activeTab === 'products' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
                Master Products Oversight ({products.length})
              </h2>
              <p className="text-xs text-stone-500">
                Curate featured items, adjust pricing, or moderate plant descriptions across all nurseries.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Nursery</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Featured</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 flex items-center gap-2.5 font-semibold text-stone-900">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0"><ProductImage product={p} className="w-full h-full" imgClassName="w-full h-full object-cover" /></div>
                      <span className="truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">{p.nurseryName}</td>
                    <td className="py-3 px-3 uppercase text-[10px] text-stone-500 font-mono">{p.category}</td>
                    <td className="py-3 px-3 font-bold text-emerald-950 tabular-nums">₹{p.price}</td>
                    <td className="py-3 px-3 tabular-nums">{p.stock}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                        className={`text-xs cursor-pointer ${p.isFeatured ? 'text-amber-600 font-bold' : 'text-stone-400'}`}
                      >
                        {p.isFeatured ? '★ Featured' : '☆ Standard'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Remove from Marketplace"
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
      )}

      {/* Tab 4: Orders Master Log */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
          <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
            All Platform Orders ({orders.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">#{order.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-stone-900">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400">{order.city}</p>
                    </td>
                    <td className="py-3 px-3 text-stone-600">{order.items.length} item(s)</td>
                    <td className="py-3 px-3 font-bold text-emerald-950 tabular-nums">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
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
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Bookings Master Log */}
      {activeTab === 'bookings' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-4">
          <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
            All Gardener Service Appointments ({bookings.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Gardener</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date & Slot</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Admin Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">#{b.id}</td>
                    <td className="py-3 px-3 font-semibold text-stone-900">{b.serviceTitle}</td>
                    <td className="py-3 px-3 text-stone-700">{b.gardenerName}</td>
                    <td className="py-3 px-3 text-stone-700">{b.customerName}</td>
                    <td className="py-3 px-3 text-stone-500">{b.date} ({b.timeSlot})</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Complaints & Disputes Desk */}
      {activeTab === 'complaints' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif-botanical">
              Customer Support & Dispute Resolution Desk ({complaints.length})
            </h2>
            <p className="text-xs text-stone-500">
              Manage reported transit damage, service disputes, and guarantee replacements.
            </p>
          </div>

          <div className="space-y-4">
            {complaints.map(ticket => (
              <div key={ticket.id} className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-xs">#{ticket.id}</span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {ticket.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">
                    Filed by {ticket.userName} ({ticket.userRole})
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900">{ticket.subject}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{ticket.description}</p>
                </div>

                {/* Resolution note */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter resolution notes (e.g. Free replacement dispatched via nursery)..."
                    value={resolutionInput[ticket.id] ?? (ticket.resolutionNotes || '')}
                    onChange={(e) => setResolutionInput({ ...resolutionInput, [ticket.id]: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateComplaintStatus(ticket.id, 'investigating', resolutionInput[ticket.id])}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Investigating
                    </button>
                    <button
                      onClick={() => updateComplaintStatus(ticket.id, 'resolved', resolutionInput[ticket.id])}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
