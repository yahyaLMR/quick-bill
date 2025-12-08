import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  IconCurrencyDollar, 
  IconFileInvoice, 
  IconUsers, 
  IconActivity, 
  IconPlus,
  IconArrowUpRight,
  IconTrendingUp,
  IconAlertCircle
} from '@tabler/icons-react';
import api from '../src/lib/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    outstandingAmount: 0,
    activeInvoices: 0,
    totalClients: 0,
    revenueTrend: 0,
    overdueCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState('DH');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invoicesRes, clientsRes, settingsRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/clients'),
          api.get('/settings')
        ]);

        const invoices = invoicesRes.data || [];
        const clients = clientsRes.data || [];
        const settings = settingsRes.data || {};

        if (settings.currency) {
          setCurrency(settings.currency);
        }

        // Calculate Stats
        const totalRevenue = invoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

        const outstandingAmount = invoices
          .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
          .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

        const activeInvoices = invoices.filter(
          inv => inv.status === 'pending' || inv.status === 'overdue'
        ).length;

        // Calculate Trends
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        let currentMonthRevenue = 0;
        let lastMonthRevenue = 0;
        let overdueCount = 0;

        invoices.forEach(inv => {
            const invDate = new Date(inv.date || inv.createdAt);
            const amount = Number(inv.total) || 0;
            
            if (inv.status === 'paid') {
                if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
                    currentMonthRevenue += amount;
                } else if (invDate.getMonth() === lastMonth && invDate.getFullYear() === lastMonthYear) {
                    lastMonthRevenue += amount;
                }
            }
            if (inv.status === 'overdue') overdueCount++;
        });

        let revenueTrend = 0;
        if (lastMonthRevenue > 0) {
            revenueTrend = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            revenueTrend = 100;
        }

        setStats({
          totalRevenue,
          outstandingAmount,
          activeInvoices,
          totalClients: clients.length,
          revenueTrend,
          overdueCount
        });

        // Recent Activity (Top 5 most recent)
        const sortedInvoices = [...invoices].sort((a, b) => 
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
        setRecentActivity(sortedInvoices.slice(0, 5));

        // Chart Data (Last 6 months revenue)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = d.toLocaleString('default', { month: 'short' });
          last6Months.push({ key: monthKey, label: monthLabel, value: 0 });
        }

        invoices.forEach(inv => {
          if (inv.status === 'paid') {
            const d = new Date(inv.date || inv.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthData = last6Months.find(m => m.key === key);
            if (monthData) {
              monthData.value += (Number(inv.total) || 0);
            }
          }
        });

        setChartData(last6Months);
        setLoading(false);
      } catch (err) {
        Navigate("/login");
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return `${Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500">
        <IconAlertCircle size={48} className="mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="flex gap-3">
          <Link 
            to="/invoice-form" 
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <IconPlus size={18} />
            Create Invoice
          </Link>
          <Link 
            to="/clients" 
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <IconUsers size={18} />
            Add Client
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<IconCurrencyDollar size={24} className="text-green-600" />}
          trend={`${stats.revenueTrend > 0 ? '+' : ''}${stats.revenueTrend.toFixed(1)}% from last month`}
          trendUp={stats.revenueTrend >= 0}
        />
        <SummaryCard 
          title="Outstanding Amount" 
          value={formatCurrency(stats.outstandingAmount)} 
          icon={<IconActivity size={24} className="text-orange-600" />}
          trend={`${stats.overdueCount} invoices overdue`}
          trendUp={false}
        />
        <SummaryCard 
          title="Active Invoices" 
          value={stats.activeInvoices} 
          icon={<IconFileInvoice size={24} className="text-blue-600" />}
          subtext="Pending payment"
        />
        <SummaryCard 
          title="Total Clients" 
          value={stats.totalClients} 
          icon={<IconUsers size={24} className="text-purple-600" />}
          subtext="Active customers"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Revenue Overview</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <IconTrendingUp size={16} />
              <span>Last 6 Months</span>
            </div>
          </div>
          
          <div className="flex h-64 items-end justify-between gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="group relative flex w-full flex-col items-center gap-2">
                <div 
                  className="w-full max-w-10 rounded-t-md bg-blue-500 transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                  style={{ height: `${(data.value / maxChartValue) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                    {formatCurrency(data.value)}
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((invoice) => (
                <div key={invoice._id || invoice.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                    }`}>
                      <IconFileInvoice size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{invoice.clientName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {invoice.number} • {new Date(invoice.date || invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">{formatCurrency(invoice.total)}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            )}
          </div>
          <div className="mt-6">
            <Link to="/invoices" className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View All Invoices
              <IconArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, trend, trendUp, subtext }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className={`flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <IconTrendingUp size={16} className="mr-1" /> : <IconAlertCircle size={16} className="mr-1" />}
            {trend}
          </span>
        )}
        {subtext && (
          <span className="text-gray-500 dark:text-gray-400">{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
