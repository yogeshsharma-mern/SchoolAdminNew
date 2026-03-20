import React, { useRef, useState, useEffect } from 'react';
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
  Sparkles,
  Palette,
  Check
} from 'lucide-react';
import { toggleSidebarCollapse } from '../../redux/features/ui/uislice';

const ModernHeader = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  
  // Get initial theme from localStorage or default to 'light'
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  };

  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const themeMenuRef = useRef(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme on mount and when currentTheme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes/attributes
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    
    // Apply the selected theme
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme !== 'light') {
      root.setAttribute('data-theme', currentTheme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: currentTheme } }));
  }, [currentTheme]);

  // Theme configurations with proper colors
  const themes = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: Sun, 
      primary: '#2563eb',
      secondary: '#16a34a',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a'
    },
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: Moon, 
      primary: '#3b82f6',
      secondary: '#22c55e',
      bg: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc'
    },
    { 
      id: 'sunset', 
      name: 'Sunset', 
      icon: Palette, 
      primary: '#f97316',
      secondary: '#f43f5e',
      bg: '#fff7ed',
      surface: '#ffffff',
      text: '#1e293b'
    },
    { 
      id: 'forest', 
      name: 'Forest', 
      icon: Palette, 
      primary: '#22c55e',
      secondary: '#10b981',
      bg: '#f0fdf4',
      surface: '#ffffff',
      text: '#166534'
    },
    { 
      id: 'amber', 
      name: 'Amber', 
      icon: Palette, 
      primary: '#f59e0b',
      secondary: '#fbbf24',
      bg: '#fffbeb',
      surface: '#ffffff',
      text: '#78350f'
    },
    { 
      id: 'neon', 
      name: 'Neon', 
      icon: Palette, 
      primary: '#14b8a6',
      secondary: '#22d3ee',
      bg: '#0f172a',
      surface: '#1e293b',
      text: '#e2e8f0'
    },
    { 
      id: 'carbon', 
      name: 'Carbon', 
      icon: Palette, 
      primary: '#4b5563',
      secondary: '#6b7280',
      bg: '#111827',
      surface: '#1f2937',
      text: '#e5e7eb'
    }
  ];

  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
    setShowThemeMenu(false);
  };

  // Get current theme icon
  const CurrentThemeIcon = themes.find(t => t.id === currentTheme)?.icon || Sun;

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
              <div className="w-9 h-9 hidden md:flex rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] items-center justify-center shadow-lg shadow-[rgb(var(--color-primary)_/_0.2)]">
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

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors relative">
              <Grid size={20} />
            </button>

            {/* Theme Switcher with Color Grid */}
            <div ref={themeMenuRef} className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2.5 rounded-xl hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-muted))] transition-colors flex items-center gap-1 relative group"
                aria-label="Toggle theme"
              >
                <CurrentThemeIcon size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[rgb(var(--color-primary))] rounded-full animate-pulse" />
              </button>

              {/* Theme Dropdown with Color Grid */}
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[rgb(var(--color-surface))] rounded-2xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden animate-scaleIn z-50">
                  {/* Header */}
                  <div className="p-4 border-b border-[rgb(var(--color-border))] bg-gradient-to-r from-[rgb(var(--color-primary)_/_0.05)] to-[rgb(var(--color-secondary)_/_0.05)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text))] flex items-center gap-2">
                          <Palette size={16} className="text-[rgb(var(--color-primary))]" />
                          Theme Gallery
                        </h3>
                        <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
                          Choose your preferred style
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-[rgb(var(--color-primary)_/_0.1)] rounded-lg">
                        <span className="text-[10px] font-medium text-[rgb(var(--color-primary))]">
                          {themes.length} themes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Color Grid - 4 per row */}
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {themes.map((theme) => {
                        const isActive = currentTheme === theme.id;
                        const Icon = theme.icon;
                        
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setTheme(theme.id)}
                            className={`
                              group relative flex flex-col items-center gap-2 p-3 rounded-xl
                              transition-all duration-300
                              ${isActive 
                                ? 'bg-[rgb(var(--color-primary)_/_0.1)] ring-2 ring-[rgb(var(--color-primary))] ring-offset-2 ring-offset-[rgb(var(--color-surface))]' 
                                : 'hover:bg-[rgb(var(--color-surface-hover))]'
                              }
                            `}
                          >
                            {/* Color Preview */}
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                              {/* Color Grid Preview */}
                              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                                <div style={{ backgroundColor: theme.primary }} />
                                <div style={{ backgroundColor: theme.secondary }} />
                                <div style={{ backgroundColor: theme.bg }} />
                                <div style={{ backgroundColor: theme.surface }} />
                              </div>
                              
                              {/* Active Indicator */}
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--color-primary))]/20 backdrop-blur-sm">
                                  <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Check size={12} className="text-white" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Theme Name & Icon */}
                            <div className="flex items-center gap-1">
                              <Icon size={10} className="text-[rgb(var(--color-muted))]" />
                              <span className="text-[10px] font-medium text-[rgb(var(--color-text))]">
                                {theme.name}
                              </span>
                            </div>

                            {/* Active Dot */}
                            {isActive && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(var(--color-primary))] rounded-full ring-2 ring-[rgb(var(--color-surface))] animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview Bar */}
                  <div className="px-4 pb-4">
                    <div className="p-3 rounded-xl bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-medium text-[rgb(var(--color-muted))] uppercase tracking-wider">
                          Current Theme
                        </span>
                        <span className="text-xs font-semibold text-[rgb(var(--color-text))]">
                          {themes.find(t => t.id === currentTheme)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-[rgb(var(--color-border))] overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: '70%',
                              background: `linear-gradient(90deg, ${themes.find(t => t.id === currentTheme)?.primary}, ${themes.find(t => t.id === currentTheme)?.secondary})`
                            }}
                          />
                        </div>
                        <span className="text-[8px] text-[rgb(var(--color-muted))]">
                          Saved to localStorage
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Persistence Info */}
                  <div className="p-3 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[rgb(var(--color-muted))] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Theme persisted
                      </span>
                      <span className="text-[rgb(var(--color-primary))] font-medium">
                        Click to apply
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

                  <div className="p-3 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]">
                    <p className="text-xs text-center text-[rgb(var(--color-muted))] flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Theme: {themes.find(t => t.id === currentTheme)?.name} • v2.0
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </header>
  );
};

export default ModernHeader;