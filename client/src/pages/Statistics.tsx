import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sessionApi } from '@/api/client';
import { toast } from '@/components/toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartData {
  label: string;
  minutes: number;
}

interface StatsData {
  summary: {
    totalMinutes: number;
    sessionCount: number;
    averageSessionMinutes: number;
  };
  dailyBreakdown: Array<{
    date: string;
    totalMinutes: number;
    sessionCount: number;
  }>;
}

export default function Statistics() {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [dayChartData, setDayChartData] = useState<ChartData[]>([]);
  const [weekChartData, setWeekChartData] = useState<ChartData[]>([]);
  const [monthChartData, setMonthChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);

        // Load today stats
        const todayData = (await sessionApi.getTodayStats()) as {
          data: StatsData;
        };
        setTodayMinutes(todayData.data.summary.totalMinutes);

        // Load week stats
        const weekData = (await sessionApi.getWeekStats()) as {
          data: StatsData;
        };
        setWeekMinutes(weekData.data.summary.totalMinutes);

        // Prepare week chart data
        const weekChart: ChartData[] = weekData.data.dailyBreakdown
          .reverse()
          .map((d) => {
            const date = new Date(d.date + 'T00:00:00');
            const dayName = date.toLocaleDateString('en-US', {
              weekday: 'short',
            });
            return {
              label: dayName,
              minutes: d.totalMinutes,
            };
          });
        setWeekChartData(weekChart);

        // Load month stats
        const monthData = (await sessionApi.getMonthStats()) as {
          data: StatsData;
        };
        setMonthMinutes(monthData.data.summary.totalMinutes);

        // Prepare month chart data
        const monthChart: ChartData[] = monthData.data.dailyBreakdown.map(
          (d) => {
            const date = new Date(d.date + 'T00:00:00');
            const day = date.getDate();
            return {
              label: day.toString(),
              minutes: d.totalMinutes,
            };
          }
        );
        setMonthChartData(monthChart);

        // Load hourly stats for today
        const hourlyData = (await sessionApi.getHourlyStats()) as {
          data: Array<{
            hour: number;
            totalMinutes: number;
            sessionCount: number;
          }>;
        };

        // Prepare day chart data (4-hour spans)
        const daySpans = [
          { label: '00-04', min: 0, max: 3 },
          { label: '04-08', min: 4, max: 7 },
          { label: '08-12', min: 8, max: 11 },
          { label: '12-16', min: 12, max: 15 },
          { label: '16-20', min: 16, max: 19 },
          { label: '20-24', min: 20, max: 23 },
        ];

        const dayChart: ChartData[] = daySpans.map((span) => {
          const spanTotal = hourlyData.data
            .filter((h) => h.hour >= span.min && h.hour <= span.max)
            .reduce((sum, h) => sum + h.totalMinutes, 0);
          return {
            label: span.label,
            minutes: spanTotal,
          };
        });
        setDayChartData(dayChart);
      } catch (error) {
        console.error('Failed to load statistics:', error);
        toast.error('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/20 rounded p-2 text-white text-sm">
          <p>{formatTime(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const ChartBar = ({ data }: { data: ChartData[] }) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.1)"
        />
        <XAxis
          dataKey="label"
          stroke="rgba(255, 255, 255, 0.5)"
          tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
        />
        <YAxis
          stroke="rgba(255, 255, 255, 0.5)"
          tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
          tickFormatter={(value) => `${Math.round(value / 60)}h`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? '#10b981' : '#059669'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="!text-white/80 hover:!text-white hover:!bg-white/10"
          >
            <Link to="/app">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Focus Statistics</h1>
        </div>

        {/* Three Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10 p-6 text-center">
            <h2 className="text-sm text-white/60 mb-2">Today</h2>
            <p className="text-3xl font-bold text-white">
              {isLoading ? '...' : formatTime(todayMinutes)}
            </p>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6 text-center">
            <h2 className="text-sm text-white/60 mb-2">This Week</h2>
            <p className="text-3xl font-bold text-white">
              {isLoading ? '...' : formatTime(weekMinutes)}
            </p>
          </Card>

          <Card className="bg-white/5 border-white/10 p-6 text-center">
            <h2 className="text-sm text-white/60 mb-2">This Month</h2>
            <p className="text-3xl font-bold text-white">
              {isLoading ? '...' : formatTime(monthMinutes)}
            </p>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Card className="bg-white/5 border-white/10 p-6">
          {isLoading ? (
            <div className="text-center text-white/50 py-12">
              Loading statistics...
            </div>
          ) : (
            <Tabs defaultValue="day" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                <TabsTrigger
                  value="day"
                  className="data-[state=active]:bg-white/10"
                >
                  Day
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="data-[state=active]:bg-white/10"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="data-[state=active]:bg-white/10"
                >
                  Month
                </TabsTrigger>
              </TabsList>

              <TabsContent value="day" className="mt-6">
                <div className="text-sm text-white/60 mb-4">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                {dayChartData.some((d) => d.minutes > 0) ? (
                  <ChartBar data={dayChartData} />
                ) : (
                  <div className="text-center text-white/50 py-12">
                    No focus sessions today. Start your first session!
                  </div>
                )}
              </TabsContent>

              <TabsContent value="week" className="mt-6">
                <div className="text-sm text-white/60 mb-4">Last 7 days</div>
                {weekChartData.some((d) => d.minutes > 0) ? (
                  <ChartBar data={weekChartData} />
                ) : (
                  <div className="text-center text-white/50 py-12">
                    No focus sessions this week yet.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="month" className="mt-6">
                <div className="text-sm text-white/60 mb-4">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                {monthChartData.some((d) => d.minutes > 0) ? (
                  <ChartBar data={monthChartData} />
                ) : (
                  <div className="text-center text-white/50 py-12">
                    No focus sessions this month yet.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
