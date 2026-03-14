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
  Legend
} from "recharts";

import {
  Users,
  GraduationCap,
  IndianRupee,
  TrendingUp
} from "lucide-react";
const chartColors = {
  primary: "rgb(var(--color-primary))",
  secondary: "rgb(var(--color-secondary))",
  purple: "rgb(var(--color-purple))",
  pink: "rgb(var(--color-pink))",
  orange: "rgb(var(--color-orange))",
  success: "rgb(var(--color-success))",
  info: "rgb(var(--color-info))"
};
const studentData = [
  { month: "Jan", students: 400 },
  { month: "Feb", students: 480 },
  { month: "Mar", students: 520 },
  { month: "Apr", students: 600 },
  { month: "May", students: 650 },
  { month: "Jun", students: 700 }
];

const feeData = [
  { month: "Jan", fees: 24000 },
  { month: "Feb", fees: 30000 },
  { month: "Mar", fees: 28000 },
  { month: "Apr", fees: 35000 },
  { month: "May", fees: 42000 },
  { month: "Jun", fees: 46000 }
];

const attendanceData = [
  { day: "Mon", attendance: 92 },
  { day: "Tue", attendance: 89 },
  { day: "Wed", attendance: 94 },
  { day: "Thu", attendance: 91 },
  { day: "Fri", attendance: 96 }
];

const departmentData = [
  { name: "Science", value: 35 },
  { name: "Commerce", value: 25 },
  { name: "Arts", value: 20 },
  { name: "Sports", value: 20 }
];
const genderData = [
  { name: "Male", value: 1400 },
  { name: "Female", value: 1140 }
];
const GENDER_COLORS = [
  "rgb(var(--color-info))",
  "rgb(var(--color-pink))"
];

const COLORS = [
  "rgb(var(--color-primary))",
  "rgb(var(--color-secondary))",
  "rgb(var(--color-purple))",
  "rgb(var(--color-orange))"
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[rgb(var(--color-bg))] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
          School Dashboard
        </h1>
        <span className="text-[rgb(var(--color-muted))] text-sm">
          Analytics Overview
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          icon={<Users />}
          title="Total Students"
          value="2,540"
          color="bg-indigo-500"
        />

        <StatCard
          icon={<GraduationCap />}
          title="Teachers"
          value="85"
          color="bg-green-500"
        />

        <StatCard
          icon={<IndianRupee />}
          title="Monthly Fees"
          value="₹46,000"
          color="bg-amber-500"
        />

        <StatCard
          icon={<TrendingUp />}
          title="Attendance"
          value="94%"
          color="bg-cyan-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 llg:grid-cols-3 gap-8">

        {/* Student Growth */}
        <ChartCard title="Student Growth">

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>

              <Line
                type="monotone"
                dataKey="students"
  stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </ChartCard>


        {/* Fee Collection */}
        <ChartCard title="Fee Collection">

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>

              <Bar
                dataKey="fees"
fill={chartColors.secondary}
                radius={[8,8,0,0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </ChartCard>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Attendance */}
        <ChartCard title="Weekly Attendance">

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>

              <Area
                type="monotone"
                dataKey="attendance"
        stroke={chartColors.info}
fill={chartColors.info}
                fillOpacity={0.3}
              />

            </AreaChart>
          </ResponsiveContainer>

        </ChartCard>

        {/* Departments */}
        <ChartCard title="Department Distribution">

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip/>
              <Legend/>

            </PieChart>
          </ResponsiveContainer>

        </ChartCard>
{/* Gender Distribution */}
<ChartCard title="Gender Distribution">

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>

      <Pie
        data={genderData}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
        innerRadius={60}
        label
      >
        {genderData.map((entry, index) => (
          <Cell
            key={index}
            fill={GENDER_COLORS[index % GENDER_COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>
  </ResponsiveContainer>

</ChartCard>
      </div>

    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-[rgb(var(--color-surface))]rounded-xl shadow-md hover:shadow-lg transition p-5 flex items-center justify-between">

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>

      <div className={`p-3 rounded-lg text-white ${color}`}>
        {icon}
      </div>

    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[rgb(var(--color-surface))] rounded-xl shadow-md p-6">

      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        {title}
      </h2>

      {children}

    </div>
  );
}