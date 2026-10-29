import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Package,
  Calendar,
  Heart,
  Bell,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Send,
  UserCheck
} from 'lucide-react';
import { OrderStatus, BookingStatus } from '../types';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    bookings,
    products,
    wishlist,
    notifications,
    complaints,
    fileComplaint,
    updateBookingStatus,
    setActiveTab,
    markNotificationAsRead
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'orders' | 'bookings' | 'wishlist' | 'notifications' | 'support'>('orders');

  // Support ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'order' | 'service' | 'partner' | 'other'>('order');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const customerOrders = orders.filter(o => o.customerId === currentUser.id);
  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const customerComplaints = complaints.filter(c => c.userId === currentUser.id);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    fileComplaint({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      description: ticketDescription.trim()
    });

    setTicketSubject('');
    setTicketDescription('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const getOrderStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'packed': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-stone-200/80 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white bg-stone-100">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-stone-900 font-serif-botanical">
              {currentUser.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mx-auto sm:mx-0 w-fit">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Plant Parent</span>
            </span>
          </div>

          <p className="text-xs text-stone-500 mb-2">
            {currentUser.email} · {currentUser.phone} · {currentUser.city}
          </p>
          <p className="text-xs text-stone-600 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{currentUser.address}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-stone-200 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div>
            <p className="text-xl font-bold text-emerald-950 tabular-nums">{customerOrders.length}</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wide">Orders</p>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div>
            <p className="text-xl font-bold text-emerald-950 tabular-nums">{customerBookings.length}</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wide">Visits</p>
          </div>
          <div className="w-px h-8 bg-stone-200" />
          <div>
            <p className="text-xl font-bold text-emerald-950 tabular-nums">{wishlist.length}</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wide">Saved</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTabLocal('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Gardener Appointments ({customerBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications ({userNotifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Disputes & Support ({customerComplaints.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {customerOrders.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-stone-200">
              <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-800">No orders placed yet</p>
              <p className="text-xs text-stone-500 mt-1 mb-4">Discover air-purifying plants, pots, and soil.</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            customerOrders.map(order => {
              const step = getOrderStatusStep(order.status);
              return (
                <div key={order.id} className="glass-panel rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900 font-mono">#{order.id}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} · Est: {order.estimatedDelivery}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-base font-bold text-emerald-950 tabular-nums">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-stone-400 uppercase font-mono">
                        via {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Progress Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 text-center text-[10px] font-semibold text-stone-500 mb-2">
                      <span className={step >= 1 ? 'text-emerald-800' : ''}>Placed</span>
                      <span className={step >= 2 ? 'text-emerald-800' : ''}>Packed</span>
                      <span className={step >= 4 ? 'text-emerald-800' : ''}>Out for Delivery</span>
                      <span className={step >= 5 ? 'text-emerald-800' : ''}>Delivered</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-800 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (step / 5) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3 pt-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/heroes/monstera_hero.jpg';
                            }}
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{item.productName}</p>
                            <p className="text-[11px] text-stone-500">
                              Qty: {item.quantity} · Nursery: {item.nurseryName}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-800 tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {customerBookings.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-stone-200">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-800">No gardener appointments yet</p>
              <p className="text-xs text-stone-500 mt-1 mb-4">Book a master horticulturist for pruning, balcony setup or pest removal.</p>
              <button
                onClick={() => setActiveTab('services')}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Explore Gardening Services
              </button>
            </div>
          ) : (
            customerBookings.map(b => (
              <div key={b.id} className="glass-panel rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 font-mono">#{b.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'completed' ? 'bg-stone-200 text-stone-700' :
                      b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 font-serif-botanical">
                    {b.serviceTitle}
                  </h3>

                  <p className="text-xs text-stone-600">
                    Master Horticulturist: <strong>{b.gardenerName}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-stone-800">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.date} ({b.timeSlot})</span>
                    </span>
                    <span>·</span>
                    <span>{b.address}, {b.city}</span>
                  </div>

                  {b.notes && (
                    <p className="text-[11px] text-stone-500 italic mt-1">
                      Notes: "{b.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto justify-between pt-3 md:pt-0 border-t md:border-t-0 border-stone-200">
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-950 tabular-nums">
                      ₹{b.price}
                    </span>
                    <p className="text-[10px] text-stone-400">{b.paymentStatus === 'paid' ? 'Paid Online' : 'Pay after visit'}</p>
                  </div>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="px-3 py-1.5 border border-stone-300 hover:border-rose-400 text-stone-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-stone-200">
              <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-800">Your wishlist is empty</p>
              <p className="text-xs text-stone-500 mt-1 mb-4">Click the heart icon on any plant to save it for later.</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Browse Plants
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-panel rounded-3xl p-6 border border-stone-200/90 divide-y divide-stone-100">
          {userNotifications.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center">No notifications right now.</p>
          ) : (
            userNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`py-3.5 px-3 rounded-xl cursor-pointer transition-colors ${
                  n.isRead ? 'opacity-70 hover:opacity-100' : 'bg-emerald-50/70 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-900">{n.title}</p>
                  <span className="text-[10px] text-stone-400">{n.createdAt}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Disputes & Helpdesk */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-serif-botanical mb-2">
              File a Plant Care or Order Dispute
            </h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Did a terracotta pot arrive damaged? Need a replacement under our 7-Day Guarantee? Our support horticulturists resolve disputes swiftly.
            </p>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Issue Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
                >
                  <option value="order">Plant or Product Delivery Issue</option>
                  <option value="service">Gardener Visit Feedback</option>
                  <option value="partner">Nursery Quality Dispute</option>
                  <option value="other">General Account Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken saucer in Order #ORD-90241"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide context, order number, or details..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket to Admin</span>
              </button>

              {ticketSuccess && (
                <p className="text-xs text-emerald-700 font-semibold text-center">
                  Ticket filed successfully! Admin has been notified.
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif-botanical">
              Your Filed Tickets ({customerComplaints.length})
            </h3>

            {customerComplaints.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No tickets filed.</p>
            ) : (
              customerComplaints.map(ticket => (
                <div key={ticket.id} className="glass-panel p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 font-mono">#{ticket.id}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      ticket.status === 'investigating' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="font-semibold text-stone-800">{ticket.subject}</p>
                  <p className="text-stone-600 leading-relaxed">{ticket.description}</p>
                  {ticket.resolutionNotes && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 mt-2 text-emerald-900">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Admin Resolution Response:</p>
                      <p className="text-xs mt-0.5">{ticket.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
