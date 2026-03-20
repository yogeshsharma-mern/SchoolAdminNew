import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Moon, Sun, Eye, EyeOff, School, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import apiPath from '../../api/apiPath';
import { loginSuccess } from '../../redux/features/auth/authslice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { apiPost } from '../../api/apiFetch';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
const dispatcher = useDispatch();
const navigate = useNavigate();
  // const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
const getTheme = () => localStorage.getItem("theme") || "light";
const [isDark, setIsDark] = useState(getTheme() === "dark");
  // Toggle theme and apply dark class to html element
const toggleTheme = () => {
  const newTheme = isDark ? "light" : "dark";

  setIsDark(!isDark);
  localStorage.setItem("theme", newTheme);

  if (newTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
const loginMutation = useMutation({
  mutationFn: ({ email, password }) =>
    apiPost(apiPath.adminLogin, { email, password }),

  onSuccess: (data) => {
    // if (!data?.success) {
    //   toast.error(data?.message || "Login failed");
    //   return;
    // }

    dispatcher(
      loginSuccess({
        admin: data?.data?.role,
        token: data?.data?.accessToken,
        schoolId:data?.data?._id
      })
    );

    toast.success("Login successful");
    navigate("/admin/dashboard");
  },

  onError: (error) => {
    toast.error(
      error?.response?.data?.message 
    );
  }
});
useEffect(() => {
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    setIsDark(true);
  } else {
    document.documentElement.classList.remove("dark");
    setIsDark(false);
  }
}, []);
  // Check for system preference on mount

  const handleSubmit = (e) => {
  e.preventDefault();

  if (loginMutation.isPending) return;
    // setIsLoading(true);
      loginMutation.mutate({email,password});
    // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false);
    //   alert('Login demo - no actual authentication');
    // }, 1500);
  };

  // Animation variants (simulated with CSS classes, but we'll use state for demo)
  const stats = [
    { icon: Users, label: 'Active Students', value: '2,450', color: 'primary' },
    { icon: BookOpen, label: 'Courses', value: '156', color: 'secondary' },
    { icon: TrendingUp, label: 'Attendance', value: '94%', color: 'success' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[rgb(var(--color-bg))] transition-colors duration-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[rgb(var(--color-primary)_/_0.1)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[rgb(var(--color-secondary)_/_0.1)] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgb(var(--color-primary)_/_0.03)] rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[rgb(var(--color-primary)_/_0.3)] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding & Info */}
        <div className="hidden lg:block space-y-8 animate-fadeInLeft">
          <div className="flex items-center gap-3 text-4xl font-bold text-[rgb(var(--color-text))] mb-4">
            <School size={48} className="text-[rgb(var(--color-primary))]" />
            <span>Edu<span className="text-[rgb(var(--color-primary))]">Manage</span></span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight text-[rgb(var(--color-text))]">
            Welcome Back,
            <br />
            <span className="text-[rgb(var(--color-primary))]">Administrator</span>
          </h1>
          
          <p className="text-xl text-[rgb(var(--color-muted))] max-w-md">
            Access your dashboard to manage students, courses, and monitor school performance.
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const delay = index * 200;
              return (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  style={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}
                >
                  <Icon className={`w-8 h-8 mb-2 text-[rgb(var(--color-${stat.color}))]`} />
                  <div className="text-2xl font-bold text-[rgb(var(--color-text))]">{stat.value}</div>
                  <div className="text-sm text-[rgb(var(--color-muted))]">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}
          <div className="pt-8 border-t border-[rgb(var(--color-border))]">
            <p className="text-[rgb(var(--color-muted))] italic">
              "This platform has transformed how we manage our school. Incredibly intuitive and powerful."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <p className="font-semibold text-[rgb(var(--color-text))]">Dr. Jane Doe</p>
                <p className="text-sm text-[rgb(var(--color-muted))]">Principal, Springfield High</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <div className="bg-[rgb(var(--color-surface))] rounded-2xl shadow-2xl p-8 border border-[rgb(var(--color-border))] animate-fadeInRight">
            {/* Header with theme toggle */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[rgb(var(--color-primary)_/_0.1)] rounded-lg">
                  <LogIn className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">Admin Login</h2>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[rgb(var(--color-muted))]">
                  Email Address
                </label>
                <div className={`
                  relative group transition-all duration-300
                  ${focusedField === 'email' ? 'scale-105' : ''}
                `}>
                  <Mail className={`
                    absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300
                    ${focusedField === 'email' 
                      ? 'text-[rgb(var(--color-primary))]' 
                      : 'text-[rgb(var(--color-muted))] group-hover:text-[rgb(var(--color-primary))]'
                    }
                  `} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-muted))] outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] transition-all duration-300"
                    placeholder="admin@school.edu"
                  />
                  {/* Animated border glow */}
                  <div className={`
                    absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-500
                    ${focusedField === 'email' 
                      ? 'opacity-100 shadow-[0_0_0_3px_rgb(var(--color-primary)_/_0.2)]' 
                      : 'opacity-0'
                    }
                  `} />
                </div>
              </div>

              {/* Password Field */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-[rgb(var(--color-muted))]">
    Password
  </label>

  <div className={`
    relative group transition-all duration-300
    ${focusedField === 'password' ? 'scale-105' : ''}
  `}>
    
    <Lock className={`
      absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300
      ${focusedField === 'password'
        ? 'text-[rgb(var(--color-primary))]'
        : 'text-[rgb(var(--color-muted))] group-hover:text-[rgb(var(--color-primary))]'
      }
    `} />

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onFocus={() => setFocusedField('password')}
      onBlur={() => setFocusedField(null)}
      required
      className="w-full pl-10 pr-12 py-3 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-muted))] outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] transition-all duration-300"
      placeholder="••••••••"
    />

    {/* Toggle Password */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))]"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>

  </div>
</div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] transition-all duration-300" />
                  <span className="text-[rgb(var(--color-muted))] group-hover:text-[rgb(var(--color-text))] transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] hover:underline transition-all duration-300 transform hover:scale-105"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
          disabled={loginMutation.isPending}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]
                  hover:shadow-lg hover:shadow-[rgb(var(--color-primary)_/_0.3)]
                  transform hover:-translate-y-0.5 transition-all duration-300
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  relative overflow-hidden group
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loginMutation.isPending  ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Login to Dashboard</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Additional links */}
            <div className="mt-6 text-center text-sm">
              <span className="text-[rgb(var(--color-muted))]">
                Protected by industry standard encryption
              </span>
            </div>

            {/* Mobile-only stats (visible only on small screens) */}
            <div className="mt-8 pt-6 border-t border-[rgb(var(--color-border))] lg:hidden">
              <div className="grid grid-cols-3 gap-2">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className="w-5 h-5 mx-auto mb-1 text-[rgb(var(--color-primary))]" />
                      <div className="text-sm font-semibold text-[rgb(var(--color-text))]">{stat.value}</div>
                      <div className="text-xs text-[rgb(var(--color-muted))]">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animations via style tag */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-30px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-10px) translateX(-20px); opacity: 0.5; }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;