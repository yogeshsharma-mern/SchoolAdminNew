import React, { useRef,useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Grid,
  Command,
  Sparkles
} from 'lucide-react';
import { toggleSidebarCollapse } from '../../redux/features/ui/uislice';

const ModernHeader = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
const [isDark, setIsDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
const notificationRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target)
    ) {
      setShowUserMenu(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, []);
const toggleTheme = () => {
  const newTheme = !isDark;
  setIsDark(newTheme);

  if (newTheme) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

  return (
    <header className={`
      sticky top-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-[rgb(var(--color-surface))]/80 backdrop-blur-xl border-b border-[rgb(var(--color-border))]/50' 
        : 'bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))]'
      }
    `}>
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section - Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebarCollapse())}
              className="lg:hidden p-2 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 hidden md:flex rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary)_/_0.2)]">
                <Command size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-[rgb(var(--color-text))]">
                  Dashboard
                </h1>
                <p className="text-xs text-[rgb(var(--color-muted))]">Welcome back, Admin</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          {/* <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-primary)_/_0.1)] to-[rgb(var(--color-secondary)_/_0.1)] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-muted))] group-focus-within:text-[rgb(var(--color-primary))] transition-colors" />
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full pl-11 pr-12 py-2.5 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-2xl text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] focus:border-[rgb(var(--color-primary))] transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-lg text-xs text-[rgb(var(--color-muted))]">
                  <Command size={12} />
                  <span>K</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            {/* <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] hover:from-[rgb(var(--color-primary))] hover:to-[rgb(var(--color-secondary))] text-white rounded-xl transition-all duration-200 shadow-lg shadow-[rgb(var(--color-primary)_/_0.25)] hover:shadow-[rgb(var(--color-primary)_/_0.4)]">
              <Sparkles size={18} />
              <span className="text-sm font-medium">New</span>
            </button> */}

            <button className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors relative">
              <Grid size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
       <div ref={notificationRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[rgb(var(--color-danger))] rounded-full ring-2 ring-[rgb(var(--color-surface))] animate-pulse" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-[rgb(var(--color-surface))] rounded-2xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden animate-scaleIn">
                  <div className="p-4 border-b border-[rgb(var(--color-border))]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[rgb(var(--color-text))]">Notifications</h3>
                      <span className="px-2 py-1 bg-[rgb(var(--color-primary)_/_0.1)] text-[rgb(var(--color-primary))] text-xs rounded-full">
                        3 new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        title: 'New user registered',
                        time: '2 min ago',
                        icon: '👤',
                        color: 'primary'
                      },
                      {
                        title: 'System update completed',
                        time: '1 hour ago',
                        icon: '⚡',
                        color: 'secondary'
                      },
                      {
                        title: 'Weekly report ready',
                        time: '3 hours ago',
                        icon: '📊',
                        color: 'warning'
                      }
                    ].map((notification, i) => (
                      <div key={i} className="p-4 hover:bg-[rgb(var(--color-surface-hover))] transition-colors cursor-pointer border-b border-[rgb(var(--color-border))] last:border-0">
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-10 h-10 rounded-xl bg-[rgb(var(--color-${notification.color})_/_0.1)] 
                            flex items-center justify-center text-xl
                          `}>
                            {notification.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[rgb(var(--color-text))]">
                              {notification.title}
                            </p>
                            <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                    <button className="w-full py-2 text-sm text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] font-medium text-center transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
    <div ref={userMenuRef} className="relative ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] transition-colors group"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-[rgb(var(--color-primary)_/_0.2)]">
                    JD
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[rgb(var(--color-success))] border-2 border-[rgb(var(--color-surface))] rounded-full" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-[rgb(var(--color-text))]">John Doe</p>
                  <p className="text-xs text-[rgb(var(--color-muted))]">Administrator</p>
                </div>
                <ChevronDown size={18} className="text-[rgb(var(--color-muted))] group-hover:text-[rgb(var(--color-text))] transition-colors" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-6 md:mt-2 w-64 bg-[rgb(var(--color-surface))] rounded-2xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden animate-scaleIn">
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-r from-[rgb(var(--color-primary)_/_0.05)] to-[rgb(var(--color-secondary)_/_0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center text-white font-semibold text-xl">
                        JD
                      </div>
                      <div>
                        <p className="font-semibold text-[rgb(var(--color-text))]">John Doe</p>
                        <p className="text-xs text-[rgb(var(--color-muted))]">john.doe@company.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {[
                      { icon: User, label: 'My Profile', href: '/profile' },
                      { icon: Settings, label: 'Settings', href: '/settings' },
                      { icon: HelpCircle, label: 'Help & Support', href: '/help' },
                      { icon: LogOut, label: 'Sign Out', href: '/logout', danger: true },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                            transition-all duration-200
                            ${item.danger 
                              ? 'text-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger)_/_0.1)]' 
                              : 'text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-hover))]'
                            }
                          `}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                    <p className="text-xs text-center text-[rgb(var(--color-muted))]">
                      Version 2.0.1
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-muted))]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] focus:border-[rgb(var(--color-primary))] transition-all"
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default ModernHeader;