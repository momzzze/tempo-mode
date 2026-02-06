import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('day');

  // Month navigation state
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (isInitialLoading) {
          setIsLoading(true);
        }

        // ============================================
        // LOAD REAL DATA FROM API
        // ============================================

        // Load today's total stats
        const todayData = (await sessionApi.getTodayStats()) as {
          data: StatsData;
        };
        console.log('Today stats:', todayData.data);
        setTodayMinutes(todayData.data.summary.totalMinutes);

        // Load hourly stats for today (Day tab: hours 0-23)
        const hourlyData = (await sessionApi.getHourlyStats()) as {
          data: Array<{
            hour: number;
            totalMinutes: number;
            sessionCount: number;
          }>;
        };
        console.log('Hourly data:', hourlyData.data);

        // Day: X-axis = hours (0-23), Y-axis = minutes
        const dayChart: ChartData[] = [];
        for (let hour = 0; hour < 24; hour++) {
          const hourData = hourlyData.data.find((h) => h.hour === hour);
          dayChart.push({
            label: hour.toString(),
            minutes: hourData ? hourData.totalMinutes : 0,
          });
        }
        setDayChartData(dayChart);

        // Load week stats (Week tab: weekday names Mon-Sun)
        const weekData = (await sessionApi.getWeekStats()) as {
          data: StatsData;
        };
        console.log('Week data:', weekData.data);
        console.log('Week dailyBreakdown:', weekData.data.dailyBreakdown);

        const today = new Date();
        const weekChart: ChartData[] = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to Mon-Sun
          const dateStr = date.toISOString().split('T')[0];
          console.log(`Looking for week date: ${dateStr}`);
          const dayData = weekData.data.dailyBreakdown.find((d) => {
            const apiDate = d.date.split('T')[0]; // Extract date part from timestamp
            console.log(`  Comparing with: ${apiDate}`);
            return apiDate === dateStr;
          });
          weekChart.push({
            label: dayNames[dayIndex],
            minutes: dayData
              ? parseInt(dayData.totalMinutes.toString(), 10)
              : 0,
          });
        }
        console.log('Week chart data:', weekChart);
        setWeekChartData(weekChart);
        setWeekMinutes(weekData.data.summary.totalMinutes);

        // Load month stats (Month tab: days 1-31) - use selected month/year
        const monthData = (await sessionApi.getMonthStats()) as {
          data: StatsData;
        };
        console.log('Month data:', monthData.data);
        console.log('Month dailyBreakdown:', monthData.data.dailyBreakdown);

        const daysInMonth = new Date(
          selectedYear,
          selectedMonth + 1,
          0
        ).getDate();
        const monthChart: ChartData[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(selectedYear, selectedMonth, day);
          const dateStr = date.toISOString().split('T')[0];
          const dayData = monthData.data.dailyBreakdown.find(
            (d) => d.date.split('T')[0] === dateStr // Extract date part from timestamp
          );
          monthChart.push({
            label: day.toString(),
            minutes: dayData
              ? parseInt(dayData.totalMinutes.toString(), 10)
              : 0,
          });
        }
        console.log('Month chart data:', monthChart);
        setMonthChartData(monthChart);
        setMonthMinutes(monthData.data.summary.totalMinutes);
      } catch (error) {
        console.error('Failed to load statistics:', error);
        toast.error('Failed to load statistics');
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    loadStats();
  }, [selectedMonth, selectedYear]);

  // Month navigation functions
  const goToPreviousMonth = () => {
    setActiveTab('month');
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    setActiveTab('month');
    const now = new Date();
    const isCurrentMonth =
      selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    if (isCurrentMonth) return; // Don't go beyond current month

    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const formatTime = (minutes: number) => {
    if (!minutes || isNaN(minutes)) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      if (!value || isNaN(value)) return null;
      return (
        <div className="bg-black/80 border border-white/20 rounded p-2 text-white text-sm">
          <p>{formatTime(value)}</p>
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
        barCategoryGap="20%"
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
          tickFormatter={(value) => {
            if (!value || isNaN(value)) return '0h';
            return `${Math.round(value / 60)}h`;
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Bar
          dataKey="minutes"
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          maxBarSize={80}
          activeBar={{ fill: '#047857' }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.minutes > 0
                  ? index % 2 === 0
                    ? '#10b981'
                    : '#059669'
                  : 'transparent'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen w-5/6 mx-auto text-white">
      {/* Layout: ads on sides with main content in center */}
      <div className="flex">
        {/* Left ad space */}
        <div className="hidden lg:flex flex-shrink-0 w-[clamp(16px,4vw,72px)]" />

        {/* Main content - full width with padding */}
        <div className="flex-1 px-[clamp(16px,4vw,72px)] py-8">
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
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
                  {dayChartData.length > 0 ? (
                    <ChartBar data={dayChartData} />
                  ) : (
                    <div className="text-center text-white/50 py-12">
                      Loading...
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="week" className="mt-6">
                  <div className="text-sm text-white/60 mb-4">Last 7 days</div>
                  {weekChartData.length > 0 ? (
                    <ChartBar data={weekChartData} />
                  ) : (
                    <div className="text-center text-white/50 py-12">
                      Loading...
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="month" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={goToPreviousMonth}
                      className="!text-white/60 hover:!text-white hover:!bg-white/10"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <div className="text-sm text-white/60">
                      {new Date(selectedYear, selectedMonth).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={goToNextMonth}
                      disabled={
                        selectedMonth === new Date().getMonth() &&
                        selectedYear === new Date().getFullYear()
                      }
                      className="!text-white/60 hover:!text-white hover:!bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                  {monthChartData.length > 0 ? (
                    <ChartBar data={monthChartData} />
                  ) : (
                    <div className="text-center text-white/50 py-12">
                      Loading...
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>

        {/* Right ad space */}
        <div className="hidden lg:flex flex-shrink-0 w-[clamp(16px,4vw,72px)]" />
      </div>
    </div>
  );
}
