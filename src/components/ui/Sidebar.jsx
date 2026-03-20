import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  toggleSidebarCollapse
} from '../../redux/features/ui/uislice';
import { logout } from "../../redux/features/auth/authslice";
import { Link } from 'react-router-dom';
import {setSidebarCollapse}  from "../../redux/features/ui/uislice";

import {
  // Dashboard
  LayoutDashboard,
  // Subjects & Assign
  BookOpen,
  ClipboardList,
  // Students
  Users,
  // Teachers
  Users2,
  CalendarCheck,
  Wallet,
  // Fees
  DollarSign,
  // School Settings
  School,
  Calendar,
  Image,
  Info,
  MessageSquare,
  Key,
  Bell,
  Palette,
  Settings,
  // Navigation
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  FileText,
  HelpCircle,
  Shield,
  Globe,
  Mail,
  Phone,
  Clock,
  Star,
  Gift,
  Target,
  GraduationCap,
  Sparkles,
  Rocket,
  Zap,
  Layers,
  Network,
  LineChart
} from 'lucide-react';

const TailwindSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const [expandedMenus, setExpandedMenus] = useState({
    teachers: false,
    schoolSetting: true,
    appearance: false,
  });

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(toggleSidebarCollapse());
        dispatch(setSidebarCollapse(true));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  useEffect(() => {
  const handleResize = () => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      dispatch(setSidebarCollapse(true)); // 📱 hide
    } else {
      dispatch(setSidebarCollapse(false)); // 💻 show
    }
  };

  handleResize(); // ✅ run on mount

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [dispatch]);

  // Function to close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      dispatch(setSidebarCollapse(true));
    }
  };

  const toggleSubMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Auto-expand submenu if child is active
  useEffect(() => {
    const newExpandedMenus = {};

    navSections.forEach(section => {
      section.items.forEach(item => {
        if (item.hasSubmenu) {
          const isChildActive = item.submenu.some(
            sub => location.pathname === sub.href
          );

          if (isChildActive) {
            newExpandedMenus[item.id] = true;
          }
        }
      });
    });

    setExpandedMenus(prev => ({
      ...prev,
      ...newExpandedMenus
    }));
  }, [location.pathname]);

  // Your original routes structure preserved
  const navSections = [
    {
      title: 'MAIN',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/admin/dashboard',
        },
        {
          id: 'class',
          label: 'Classes',
          icon: ClipboardList,
          href: '/admin/Classes',
          notification: true
        },
        {
          id: 'subjects',
          label: 'Subjects',
          icon: BookOpen,
          href: '/admin/subjects',
        },
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        {
          id: 'students',
          label: 'Students',
          icon: Users,
          href: '/admin/students',
        },
        {
          id: 'teachers',
          label: 'Teachers',
          icon: Users2,
          hasSubmenu: true,
          submenu: [
            {
              id: 'all-teachers', label: 'All Teachers', icon: Users2, href: '/admin/teachers/all',
            },
            {
              id: 'attendance', label: 'Attendance', icon: CalendarCheck, href: '/admin/teachers/attendance',
            },
            {
              id: 'salary', label: 'Salary', icon: Wallet, href: '/admin/teachers/salary',
            },
          ]
        },
        {
          id: 'fees',
          label: 'Fees Management',
          icon: DollarSign,
          href: '/admin/fees',
        },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'schoolSetting',
          label: 'School Settings',
          icon: School,
          hasSubmenu: true,
          submenu: [
            { id: 'school-setting', label: 'School Setting', icon: Calendar, href: '/admin/settings/school-setting' },
            { id: 'academic-year', label: 'Academic Year', icon: Calendar, href: '/admin/settings/academic-year' },

            {
              id: 'gallery', label: 'Gallery', icon: Image, href: '/admin/settings/gallery',
            },
            { id: 'about-us', label: 'About Us', icon: Info, href: '/admin/settings/about' },
            { id: 'leadership', label: 'Leadership', icon: Users2, href: '/admin/settings/leadership', count: 8 },
            { id: 'events', label: 'Event Calendar', icon: Calendar, href: '/admin/settings/events', count: 5 },
            { id: 'inquiry', label: 'Inquiry Management', icon: MessageSquare, href: '/admin/settings/inquiry', badge: '3' },
          ]
        },
        {
          id: 'appearance',
          label: 'Appearance',
          icon: Palette,
          hasSubmenu: true,
          submenu: [
            { id: 'colors', label: 'Colors', icon: Palette, href: '/admin/settings/appearance/colors' },
            { id: 'typography', label: 'Typography', icon: BookOpen, href: '/admin/settings/appearance/typography' },
            { id: 'layout', label: 'Layout', icon: Layers, href: '/admin/settings/appearance/layout' },
          ]
        },
        {
          id: 'change-password',
          label: 'Change Password',
          icon: Key,
          href: '/admin/change-password'
        },
      ]
    }
  ];

  const renderSubmenu = (parentId, submenu, level = 0) => {
    if (!expandedMenus[parentId]) return null;

    return (
      <div className="mt-1 space-y-0.5 overflow-hidden animate-slideDown">
        {submenu.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={handleLinkClick} // Added click handler for submenu items
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg
                transition-all duration-200 group
                ${sidebarCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
              style={{ paddingLeft: level === 0 ? '2.75rem' : '3.75rem' }}
            >
              <Icon size={16} className="shrink-0" />

              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-sm whitespace-nowrap">{item.label}</span>
                  {item.count && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{item.count}</span>
                  )}
                  {item.badge === 'New' && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-500 text-white rounded">
                      New
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed mode */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                  {item.count && <span className="ml-1 text-gray-400">({item.count})</span>}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarCollapse(true))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-screen
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          flex flex-col
          ${sidebarCollapsed ? 'w-20' : 'w-78'}
          ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} lg:translate-x-0
          shadow-xl
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!sidebarCollapsed ? (
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Edu<span className="text-blue-600">Manage</span>
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-xl font-bold text-blue-600">E</span>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Admin User</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              {/* Section Title */}
              {!sidebarCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  const hasSubmenu = item.hasSubmenu;
                  const isExpanded = expandedMenus[item.id];

                  return (
                    <div key={item.id}>
                      {/* Main Item */}
                      {!hasSubmenu ? (
                        <Link
                          to={item.href}
                          onClick={handleLinkClick} // Added click handler for main menu items
                          className={`
                            relative flex items-center gap-3 px-3 py-2 rounded-lg
                            transition-all duration-200
                            ${sidebarCollapsed ? 'justify-center' : ''}
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                            group
                          `}
                        >
                          <Icon size={20} />

                          {!sidebarCollapsed && (
                            <span className="flex-1 text-sm">{item.label}</span>
                          )}

                          {/* Tooltip for collapsed mode */}
                          {sidebarCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                              {item.label}
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div
                          onClick={() => toggleSubMenu(item.id)}
                          className={`
                            relative flex items-center gap-3 px-3 py-2 rounded-lg
                            cursor-pointer
                            ${sidebarCollapsed ? 'justify-center' : ''}
                            ${isExpanded
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                            group
                          `}
                        >
                          <Icon size={20} />

                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1 text-sm">{item.label}</span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </>
                          )}

                          {/* Tooltip for collapsed mode */}
                          {sidebarCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                              {item.label}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Submenu */}
                      {hasSubmenu && renderSubmenu(item.id, item.submenu)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          {/* Settings */}
          <Link
            to="/admin/settings"
            onClick={handleLinkClick} // Added click handler for Settings
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg mb-1
              transition-all duration-200
              ${sidebarCollapsed ? 'justify-center' : ''}
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
              group relative
            `}
          >
            <Settings size={20} />
            {!sidebarCollapsed && <span className="text-sm">Settings</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                Settings
              </div>
            )}
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              dispatch(logout());
              if (isMobile) {
                dispatch(toggleSidebarCollapse(true));
              }
            }}
            className={`
              flex items-center w-full gap-3 px-3 py-2 rounded-lg
              transition-all duration-200
              ${sidebarCollapsed ? 'justify-center' : ''}
              text-gray-700 dark:text-gray-300 
              hover:bg-red-50 dark:hover:bg-red-900/20 
              hover:text-red-600 dark:hover:text-red-400
              group relative
            `}
          >
            <LogOut size={20} />

            {!sidebarCollapsed && (
              <span className="text-sm">Logout</span>
            )}

            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(209 213 219);
          border-radius: 20px;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(55 65 81);
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(75 85 99);
        }
      `}</style>
    </>
  );
};

export default TailwindSidebar;