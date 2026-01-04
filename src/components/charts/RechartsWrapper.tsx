import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  [key: string]: string | number;
}

interface SeriesConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface BaseChartProps {
  data: ChartData[];
  series: SeriesConfig[];
  xAxisKey: string;
  height?: number;
}

// Stacked Area Chart (for investor flow)
export function StackedAreaChart({
  data,
  series,
  xAxisKey,
  height = 400,
}: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey={xAxisKey} stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
        <Legend />
        {series.map((s) => (
          <Area
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stackId="1"
            fill={s.color}
            stroke={s.color}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Stacked Bar Chart (for activity breakdown)
export function StackedBarChart({
  data,
  series,
  xAxisKey,
  height = 400,
}: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey={xAxisKey} stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
        <Legend />
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            stackId="1"
            fill={s.color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Multi-line chart (for value over time)
export function MultiLineChart({
  data,
  series,
  xAxisKey,
  height = 400,
}: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey={xAxisKey} stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip />
        <Legend />
        {series.map((s) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Activity bar chart with colored bars based on action type
interface ActivityChartData {
  quarter: string;
  opened: number;
  closed: number;
  added: number;
  reduced: number;
  held: number;
}

export function ActivityBarChart({
  data,
  height = 400,
}: {
  data: ActivityChartData[];
  height?: number;
}) {
  const series: SeriesConfig[] = [
    { dataKey: "opened", name: "Opened", color: "#22c55e" },
    { dataKey: "added", name: "Added", color: "#3b82f6" },
    { dataKey: "held", name: "Held", color: "#a855f7" },
    { dataKey: "reduced", name: "Reduced", color: "#f97316" },
    { dataKey: "closed", name: "Closed", color: "#ef4444" },
  ];

  return (
    <StackedBarChart
      data={data}
      series={series}
      xAxisKey="quarter"
      height={height}
    />
  );
}
