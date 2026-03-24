import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from "recharts";

import {
  Users,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Star,
  Target,
  DollarSign,
  Activity,
  ChevronRight,
  MoreVertical,
  Download,
  Filter,
  Palette,
  Sun,
  Moon,
  Leaf,
  Flame,
  Zap,
  Droplets
} from "lucide-react";

import { useState, useEffect } from 'react';

// Theme configurations
const themes = [
  { id: 'light', name: 'Light', icon: Sun, color: 'var(--color-primary)' },
  { id: 'dark', name: 'Dark', icon: Moon, color: 'var(--color-primary)' },
  { id: 'sunset', name: 'Sunset', icon: Flame, color: 'rgb(249 115 22)' },
  { id: 'forest', name: 'Forest', icon: Leaf, color: 'rgb(34 197 94)' },
  { id: 'amber', name: 'Amber', icon: Droplets, color: 'rgb(245 158 11)' },
  { id: 'neon', name: 'Neon', icon: Zap, color: 'rgb(20 184 166)' },
  { id: 'carbon', name: 'Carbon', icon: Zap, color: 'rgb(75 85 99)' }
];

// Chart colors using CSS variables
const chartColors = {
  primary: "rgb(var(--color-primary))",
  secondary: "rgb(var(--color-secondary))",
  purple: "rgb(var(--color-purple))",
  pink: "rgb(var(--color-pink))",
  orange: "rgb(var(--color-orange))",
  success: "rgb(var(--color-success))",
  info: "rgb(var(--color-info))",
  warning: "rgb(var(--color-warning))",
  danger: "rgb(var(--color-danger))",
  text: "rgb(var(--color-text))",
  muted: "rgb(var(--color-muted))",
  border: "rgb(var(--color-border))",
  surface: "rgb(var(--color-surface))",
  surfaceHover: "rgb(var(--color-surface-hover))"
};

// Enhanced data with more metrics
const studentData = [
  { month: "Jan", students: 400, target: 380, previous: 350 },
  { month: "Feb", students: 480, target: 420, previous: 400 },
  { month: "Mar", students: 520, target: 500, previous: 480 },
  { month: "Apr", students: 600, target: 550, previous: 520 },
  { month: "May", students: 650, target: 620, previous: 600 },
  { month: "Jun", students: 700, target: 680, previous: 650 }
];

const feeData = [
  { month: "Jan", collected: 24000, pending: 4000, target: 25000 },
  { month: "Feb", collected: 30000, pending: 3500, target: 28000 },
  { month: "Mar", collected: 28000, pending: 5000, target: 30000 },
  { month: "Apr", collected: 35000, pending: 4500, target: 32000 },
  { month: "May", collected: 42000, pending: 3000, target: 38000 },
  { month: "Jun", collected: 46000, pending: 2500, target: 42000 }
];

const attendanceData = [
  { day: "Mon", attendance: 92, previous: 89, average: 90 },
  { day: "Tue", attendance: 89, previous: 88, average: 89 },
  { day: "Wed", attendance: 94, previous: 90, average: 91 },
  { day: "Thu", attendance: 91, previous: 92, average: 90 },
  { day: "Fri", attendance: 96, previous: 91, average: 92 },
  { day: "Sat", attendance: 85, previous: 82, average: 84 }
];

const departmentData = [
  { name: "Science", students: 350, teachers: 15, performance: 92 },
  { name: "Commerce", students: 280, teachers: 12, performance: 88 },
  { name: "Arts", students: 220, teachers: 10, performance: 85 },
  { name: "Sports", students: 150, teachers: 8, performance: 94 }
];

const performanceData = [
  { subject: "Mathematics", score: 85, average: 78, max: 100 },
  { subject: "Science", score: 88, average: 80, max: 100 },
  { subject: "English", score: 82, average: 75, max: 100 },
  { subject: "Social Studies", score: 79, average: 72, max: 100 },
  { subject: "Computer", score: 92, average: 82, max: 100 }
];

const recentActivities = [
  { id: 1, activity: "New student enrollment", time: "2 hours ago", type: "enrollment", status: "completed" },
  { id: 2, activity: "Fee payment received", time: "3 hours ago", type: "payment", status: "completed" },
  { id: 3, activity: "Teacher meeting scheduled", time: "5 hours ago", type: "meeting", status: "pending" },
  { id: 4, activity: "Exam results published", time: "1 day ago", type: "exam", status: "completed" },
  { id: 5, activity: "Parent-teacher meeting", time: "2 days ago", type: "meeting", status: "completed" }
];

const genderData = [
  { name: "Male", value: 1400, percentage: 55 },
  { name: "Female", value: 1140, percentage: 45 }
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[rgb(var(--color-surface))] p-4 rounded-xl shadow-lg border border-[rgb(var(--color-border))]">
        <p className="font-semibold text-[rgb(var(--color-text))] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[rgb(var(--color-muted))]">{entry.name}:</span>
            <span className="font-medium text-[rgb(var(--color-text))]">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              {entry.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // useEffect(() => {
  //   // Apply theme to document element
  //   const root = document.documentElement;
  //   if (currentTheme === 'light') {
  //     root.classList.remove('dark');
  //     root.removeAttribute('data-theme');
  //   } else if (currentTheme === 'dark') {
  //     root.classList.add('dark');
  //     root.removeAttribute('data-theme');
  //   } else {
  //     root.classList.remove('dark');
  //     root.setAttribute('data-theme', currentTheme);
  //   }
  // }, [currentTheme]);

  const ThemeIcon = themes.find(t => t.id === currentTheme)?.icon || Sun;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] transition-colors duration-300">
      {/* Header with Theme Switcher */}
      <div className="sticky top-0 z-10 bg-[rgb(var(--color-surface))] backdrop-blur-xl border-b border-[rgb(var(--color-border))]">
   
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Students"
            value="2,540"
            trend="+12.5%"
            trendLabel="vs last month"
            iconBg="bg-[rgb(var(--color-primary))]"
          />
          <StatCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Teaching Staff"
            value="85"
            trend="+5.2%"
            trendLabel="vs last month"
            iconBg="bg-[rgb(var(--color-secondary))]"
          />
          <StatCard
            icon={<IndianRupee className="w-6 h-6" />}
            title="Monthly Revenue"
            value="₹4.6L"
            trend="+8.1%"
            trendLabel="vs last month"
            iconBg="bg-[rgb(var(--color-warning))]"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Avg Attendance"
            value="94.2%"
            trend="+2.3%"
            trendLabel="vs last month"
            iconBg="bg-[rgb(var(--color-info))]"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Growth Chart */}
          <ChartCard
            title="Student Growth Analysis"
            action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}
            className="lg:col-span-2"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={studentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="target"
                    fill="url(#studentGradient)"
                    stroke="transparent"
                    name="Target"
                  />
                  <Bar
                    dataKey="previous"
                    fill={chartColors.border}
                    radius={[4, 4, 0, 0]}
                    name="Previous Year"
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke={chartColors.primary}
                    strokeWidth={3}
                    dot={{ r: 6, fill: chartColors.primary, strokeWidth: 2, stroke: chartColors.surface }}
                    activeDot={{ r: 8, fill: chartColors.primary }}
                    name="Current Year"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Fee Collection Chart */}
          <ChartCard title="Fee Collection Overview" action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="collectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.warning} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartColors.warning} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="collected" fill="url(#collectedGradient)" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="pending" fill="url(#pendingGradient)" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <ChartCard title="Weekly Attendance Trend" action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.info} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.info} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke={chartColors.info}
                    strokeWidth={3}
                    fill="url(#attendanceGradient)"
                    name="This Week"
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke={chartColors.muted}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Average"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Department Performance */}
          <ChartCard title="Department Performance" action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <PolarGrid gridType="circle" stroke={chartColors.border} />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                    stroke={chartColors.border}
                  />
                  <Radar
                    name="Performance"
                    dataKey="performance"
                    stroke={chartColors.primary}
                    fill={chartColors.primary}
                    fillOpacity={0.5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Gender Distribution */}
          <ChartCard title="Student Demographics" action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? chartColors.info : chartColors.pink}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Gender Stats */}
              <div className="flex justify-center gap-8 mt-4">
                {genderData.map((item, index) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: index === 0 ? chartColors.info : chartColors.pink }}
                      />
                      <span className="text-sm font-medium text-[rgb(var(--color-text))]">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold text-[rgb(var(--color-text))]">{item.value}</p>
                    <p className="text-xs text-[rgb(var(--color-muted))]">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <ChartCard title="Subject Performance Analysis" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="subject"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartColors.muted, fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="score"
                    fill={chartColors.primary}
                    radius={[0, 4, 4, 0]}
                    name="School Score"
                  />
                  <Bar
                    dataKey="average"
                    fill={chartColors.muted}
                    radius={[0, 4, 4, 0]}
                    name="National Average"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Recent Activities */}
          <ChartCard title="Recent Activities" action={<MoreVertical className="w-5 h-5 text-[rgb(var(--color-muted))]" />}>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-[rgb(var(--color-surface-hover))] rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                    ${activity.type === 'enrollment' ? 'bg-[rgb(var(--color-success))] bg-opacity-10 text-[rgb(var(--color-success))]' : ''}
                    ${activity.type === 'payment' ? 'bg-[rgb(var(--color-info))] bg-opacity-10 text-[rgb(var(--color-info))]' : ''}
                    ${activity.type === 'meeting' ? 'bg-[rgb(var(--color-purple))] bg-opacity-10 text-[rgb(var(--color-purple))]' : ''}
                    ${activity.type === 'exam' ? 'bg-[rgb(var(--color-warning))] bg-opacity-10 text-[rgb(var(--color-warning))]' : ''}
                  `}>
                    {activity.type === 'enrollment' && <Users className="w-5 h-5" />}
                    {activity.type === 'payment' && <DollarSign className="w-5 h-5" />}
                    {activity.type === 'meeting' && <Calendar className="w-5 h-5" />}
                    {activity.type === 'exam' && <Award className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[rgb(var(--color-text))]">{activity.activity}</p>
                    <p className="text-xs text-[rgb(var(--color-muted))]">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full
                    ${activity.status === 'completed' ? 'bg-[rgb(var(--color-success))]' : 'bg-[rgb(var(--color-warning))]'}
                  `} />
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Target className="w-5 h-5" />}
            label="Achievement Rate"
            value="94%"
            change="+5%"
            color="primary"
          />
          <MetricCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Passing Rate"
            value="88%"
            change="+3%"
            color="secondary"
          />
          <MetricCard
            icon={<Star className="w-5 h-5" />}
            label="Top Performers"
            value="342"
            change="+12"
            color="warning"
          />
          <MetricCard
            icon={<Clock className="w-5 h-5" />}
            label="Avg Study Hours"
            value="6.5 hrs"
            change="+0.5"
            color="info"
          />
        </div>
      </div>
    </div>
  );
}

// Enhanced Stat Card Component with theme variables
function StatCard({ icon, title, value, trend, trendLabel, iconBg }) {
  const isPositive = trend?.startsWith('+');

  return (
    <div className="group relative bg-[rgb(var(--color-surface))] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgb(var(--color-surface-hover))] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[rgb(var(--color-muted))]">{title}</p>
            <h3 className="text-2xl font-bold text-[rgb(var(--color-text))]">{value}</h3>
            <div className="flex items-center gap-2">
              <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-[rgb(var(--color-success))]' : 'text-[rgb(var(--color-danger))]'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {trend}
              </span>
              <span className="text-xs text-[rgb(var(--color-muted))]">{trendLabel}</span>
            </div>
          </div>

          <div className={`p-3 ${iconBg} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 bg-[rgb(var(--color-border))] rounded-full overflow-hidden">
          <div
            className={`h-full ${iconBg} rounded-full transition-all duration-500 group-hover:opacity-80`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Enhanced Chart Card Component with theme variables
function ChartCard({ title, children, action, className = "" }) {
  return (
    <div className={`bg-[rgb(var(--color-surface))] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">{title}</h3>
          {action && (
            <button className="p-2 hover:bg-[rgb(var(--color-surface-hover))] rounded-lg transition-colors">
              {action}
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// Metric Card Component with theme variables
function MetricCard({ icon, label, value, change, color }) {
  const isPositive = change?.startsWith('+');
  const colorMap = {
    primary: 'bg-[rgb(var(--color-primary))] bg-opacity-10 text-[rgb(var(--color-primary))]',
    secondary: 'bg-[rgb(var(--color-secondary))] bg-opacity-10 text-[rgb(var(--color-secondary))]',
    warning: 'bg-[rgb(var(--color-warning))] bg-opacity-10 text-[rgb(var(--color-warning))]',
    info: 'bg-[rgb(var(--color-info))] bg-opacity-10 text-[rgb(var(--color-info))]'
  };

  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-[rgb(var(--color-muted))]">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[rgb(var(--color-text))]">{value}</span>
            <span className={`text-xs font-medium ${isPositive ? 'text-[rgb(var(--color-success))]' : 'text-[rgb(var(--color-danger))]'}`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}