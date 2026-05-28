"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  BarChart2,
  Search,
  X,
  Zap,
  CreditCard,
  Wallet,
} from "lucide-react";
import DashboardCard from "@/src/components/dashboard/DashboardCard";
import DataTable from "@/src/components/dashboard/DataTable";
import Badge from "@/src/components/dashboard/Badge";
import { useGetAllPayments } from "@/src/hooks/usePayment";
import { useDebounce } from "@/src/hooks/useDebounce";

const COMMISSION_RATE = 0.05;

type EarningRow = {
  id: string;
  paymentId: string;
  donorName: string;
  campaignTitle: string;
  donationAmount: number;
  commission: number;
  method: string;
  status: string;
  date: string;
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case "esewa":
      return <Zap size={16} />;
    case "bank_transfer":
      return <Wallet size={16} />;
    case "cash":
      return <DollarSign size={16} />;
    default:
      return <CreditCard size={16} />;
  }
};

const getMethodLabel = (method: string) =>
  method
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error, refetch } = useGetAllPayments({
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
  });

  const rawPayments = data?.payments || [];
  const stats = data?.stats;

  const completedPayments = rawPayments.filter((p) => p.status === "completed");

  const earnings: EarningRow[] = completedPayments.map((p) => ({
    id: p.transactionUuid || "N/A",
    paymentId: p._id,
    donorName: p.anonymous ? "Anonymous" : p.donor?.name || "Unknown",
    campaignTitle: p.campaign?.title || "Unknown Campaign",
    donationAmount: p.amount,
    commission: Math.round(p.amount * COMMISSION_RATE * 100) / 100,
    method: p.gateway || "unknown",
    status: p.status,
    date: p.paidAt || p.createdAt,
  }));

  const totalRevenue = stats?.totalRevenue || 0;
  const completedCount = stats?.completedCount || 0;
  const methodRevenue: Record<string, number> = stats?.methodRevenue || {};
  const trends = stats?.trends || { revenue: 0, completedCount: 0 };

  const totalCommission = Math.round(totalRevenue * COMMISSION_RATE * 100) / 100;
  const avgCommission = completedCount > 0 ? Math.round((totalCommission / completedCount) * 100) / 100 : 0;

  const columns = [
    {
      key: "id" as const,
      label: "Transaction ID",
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-xs text-setu-600">{value}</span>
      ),
    },
    {
      key: "donorName" as const,
      label: "Donor",
      sortable: true,
    },
    {
      key: "campaignTitle" as const,
      label: "Campaign",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-setu-700 truncate max-w-xs">{value}</span>
      ),
    },
    {
      key: "donationAmount" as const,
      label: "Donation Amount",
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-setu-700">₨{value.toLocaleString()}</span>
      ),
    },
    {
      key: "commission" as const,
      label: "Commission (5%)",
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-green-700">₨{value.toLocaleString()}</span>
      ),
    },
    {
      key: "method" as const,
      label: "Payment Method",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <span className="text-setu-500">{getMethodIcon(value)}</span>
          <span className="text-sm text-setu-700">{getMethodLabel(value)}</span>
        </div>
      ),
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <Badge variant="success" size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "date" as const,
      label: "Date",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-setu-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (isError && !isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-setu-900">Inventory & Earnings</h1>
            <p className="text-setu-500 mt-2">Platform commission earnings at 5% per completed transaction</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 h-10 bg-setu-600 text-white rounded-lg font-semibold hover:bg-setu-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="bg-white rounded-lg border border-red-100 p-6">
          <p className="text-red-600 font-semibold">Failed to load earnings data.</p>
          <p className="text-sm text-red-500/90 mt-1">{error?.message || "Please try again."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-display font-bold text-setu-900">Inventory & Earnings</h1>
        <p className="text-setu-500 mt-2">
          Platform commission earnings — 5% on every completed donation transaction
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Platform Earnings"
          value={`₨${(totalCommission / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          trend={{
            value: Math.abs(trends.revenue),
            direction: trends.revenue >= 0 ? "up" : "down",
          }}
          color="green"
        />
        <DashboardCard
          title="Total Donations Processed"
          value={`₨${(totalRevenue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          trend={{
            value: Math.abs(trends.revenue),
            direction: trends.revenue >= 0 ? "up" : "down",
          }}
          color="setu"
        />
        <DashboardCard
          title="Completed Transactions"
          value={isLoading ? "..." : completedCount}
          icon={CheckCircle}
          trend={{
            value: Math.abs(trends.completedCount),
            direction: trends.completedCount >= 0 ? "up" : "down",
          }}
          color="blue"
        />
        <DashboardCard
          title="Avg. Commission / Transaction"
          value={`₨${avgCommission.toLocaleString()}`}
          icon={BarChart2}
          trend={{ value: 5, direction: "up" }}
          color="gold"
        />
      </div>

      {/* Commission breakdown highlight */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">
              Total Platform Commission Earned
            </p>
            <p className="text-4xl font-display font-bold text-green-800">
              ₨{totalCommission.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">
              5% of ₨{totalRevenue.toLocaleString()} total donations processed
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 border border-green-200 rounded-xl px-5 py-3">
            <TrendingUp size={28} className="text-green-600" />
            <div>
              <p className="text-xs text-green-700 font-medium">Commission Rate</p>
              <p className="text-2xl font-bold text-green-800">5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by method */}
      {Object.keys(methodRevenue).length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-setu-100 shadow-sm">
          <h3 className="text-lg font-semibold text-setu-900 mb-4">Commission by Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(methodRevenue).map(([method, amount]) => {
              const methodCommission = Math.round((amount as number) * COMMISSION_RATE * 100) / 100;
              return (
                <div
                  key={method}
                  className="flex items-center justify-between p-4 bg-setu-50 rounded-lg border border-setu-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-setu-500">{getMethodIcon(method)}</span>
                    <div>
                      <p className="text-sm font-medium text-setu-800">{getMethodLabel(method)}</p>
                      <p className="text-xs text-setu-500">₨{(amount as number).toLocaleString()} donations</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-700">₨{methodCommission.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + Table */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-setu-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-setu-400" />
          <input
            type="text"
            placeholder="Search by donor, campaign, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-setu-400 hover:text-setu-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="text-sm text-setu-500">
          {isLoading ? "Searching..." : (
            <>Showing <span className="font-bold text-setu-900">{earnings.length}</span> completed transactions</>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white rounded-lg border border-setu-100">
          <div className="w-10 h-10 rounded-full bg-setu-50 border border-setu-100 flex items-center justify-center text-setu-500">
            ...
          </div>
          <p className="text-sm text-setu-600 font-medium">Loading earnings data...</p>
        </div>
      ) : (
        <DataTable
          data={earnings}
          columns={columns}
          searchableFields={["donorName", "campaignTitle", "id"]}
          title="Commission Earnings — Completed Transactions"
        />
      )}
    </div>
  );
}
