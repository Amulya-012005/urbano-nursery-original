import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, Bell, Sprout, Shield, CheckCircle2, User as UserIcon, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const {
    currentUser,
    switchRole,
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    setAuthModalOpen,
    setAdminPinModalOpen
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  const handleRoleSelect = (role: 'customer' | 'nursery' | 'gardener' | 'admin') => {
    if (role === 'admin') {
      setAdminPinModalOpen(true);
      setRoleMenuOpen(false);
      return;
    }
    switchRole(role);
    setRoleMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setActiveTab('shop');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f4f2ec]/90 backdrop-blur-md border-b border-stone-200/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        {/* Left: Brand Logo (Sprout inside circle + Urbano Nursery / GreenNest) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-900 group-hover:bg-emerald-950 group-hover:text-white group-hover:border-emerald-950 transition-colors">
              <Sprout className="w-4 h-4 text-emerald-800 group-hover:text-emerald-300" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-stone-900 font-sans">
                Urbano
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">
                Nursery
              </span>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links matching user image (Home, Shop, Plant Care, About, Contact) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`relative py-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'home'
                ? 'text-stone-950 font-bold'
                : 'hover:text-stone-950 text-stone-600'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`relative py-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'shop'
                ? 'text-stone-950 font-bold'
                : 'hover:text-stone-950 text-stone-600'
            }`}
          >
            Shop
            {activeTab === 'shop' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`relative py-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'services'
                ? 'text-stone-950 font-bold'
                : 'hover:text-stone-950 text-stone-600'
            }`}
          >
            Plant Care
            {activeTab === 'services' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`relative py-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'about'
                ? 'text-stone-950 font-bold'
                : 'hover:text-stone-950 text-stone-600'
            }`}
          >
            About
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900 rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenContact}
            className="py-2 whitespace-nowrap cursor-pointer transition-colors hover:text-stone-950 text-stone-600"
          >
            Contact
          </button>

          {/* Quick link to active role dashboard if not customer */}
          {currentUser.role !== 'customer' && (
            <button
              onClick={() => {
                if (currentUser.role === 'nursery') setActiveTab('nursery_dash');
                else if (currentUser.role === 'gardener') setActiveTab('gardener_dash');
                else if (currentUser.role === 'admin') setActiveTab('admin_dash');
              }}
              className="py-1 px-2.5 rounded-lg bg-emerald-100 text-emerald-950 text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-emerald-200 transition-colors"
            >
              {currentUser.role === 'nursery' ? 'Nursery Portal' : currentUser.role === 'gardener' ? 'Gardener Hub' : 'Admin Console'}
            </button>
          )}
        </nav>

        {/* Right: Search, Cart Bag, and Shop Now CTA matching user image */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Icon in Rounded Box */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-xl bg-white border border-stone-200/90 hover:border-stone-400 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Search plants"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 mt-2 w-72 p-2 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 flex gap-2 animate-in fade-in"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Monstera, pots, seeds..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-900 text-white text-xs font-semibold rounded-xl"
                >
                  Go
                </button>
              </form>
            )}
          </div>

          {/* Cart Bag Icon in Rounded Box */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-white border border-stone-200/90 hover:border-stone-400 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Shop Now Primary Button (Deep Forest Green pill button as in mockup) */}
          <button
            onClick={() => setActiveTab('shop')}
            className="hidden sm:inline-flex px-5 py-2.5 bg-[#0e3b26] hover:bg-[#0a2c1c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            Shop Now
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setRoleMenuOpen(false);
              }}
              className="w-10 h-10 rounded-xl bg-white border border-stone-200/90 hover:border-stone-400 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-700 rounded-full" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-900">Notifications</span>
                  <span className="text-[10px] text-stone-400 tabular-nums">
                    {userNotifications.length} updates
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 py-2">
                  {userNotifications.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">No new notifications</p>
                  ) : (
                    userNotifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2 rounded-lg cursor-pointer text-xs ${
                          n.isRead ? 'opacity-70' : 'bg-emerald-50 font-medium'
                        }`}
                      >
                        <p className="font-semibold text-stone-900">{n.title}</p>
                        <p className="text-stone-600 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 cursor-pointer shadow-2xs"
              title="Switch user role or view profile"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-stone-100 flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-stone-600" />
                )}
              </div>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl p-3 z-50 border border-stone-200">
                <div className="px-2 py-1.5 border-b border-stone-200">
                  <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] uppercase font-mono text-emerald-800 font-bold">
                    Role: {currentUser.role}
                  </p>
                </div>

                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2">
                    Switch Workspace Role
                  </p>

                  <button
                    onClick={() => handleRoleSelect('customer')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      currentUser.role === 'customer' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>🌱 Customer (Aarav)</span>
                    {currentUser.role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('nursery')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      currentUser.role === 'nursery' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>🌿 Nursery (GreenRoots)</span>
                    {currentUser.role === 'nursery' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('gardener')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      currentUser.role === 'gardener' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>✂️ Gardener (Ramesh)</span>
                    {currentUser.role === 'gardener' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      currentUser.role === 'admin' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin (PIN: 1234)</span>
                    </span>
                    {currentUser.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-200 flex gap-2">
                  <button
                    onClick={() => {
                      if (currentUser.role === 'customer') setActiveTab('customer_dash');
                      else if (currentUser.role === 'nursery') setActiveTab('nursery_dash');
                      else if (currentUser.role === 'gardener') setActiveTab('gardener_dash');
                      else setActiveTab('admin_dash');
                      setRoleMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 bg-emerald-900 text-white text-xs font-semibold rounded-lg text-center cursor-pointer"
                  >
                    Go to Portal
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setRoleMenuOpen(false);
                    }}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Shop
          </button>
          <button
            onClick={() => {
              setActiveTab('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Plant Care
          </button>
          <button
            onClick={() => {
              setActiveTab('about');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            About
          </button>
          <button
            onClick={() => {
              onOpenContact();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
