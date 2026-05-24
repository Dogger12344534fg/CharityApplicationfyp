'use client';

import { useMemo, useState } from 'react';
import { Users, UserCircle, UserX, UserCog,
  MapPin, Lock, Layers, Info,
  Target, TrendingUp, DollarSign,
  Globe, ExternalLink,
  CalendarPlus, CalendarClock,
  ShieldCheck, ShieldAlert,
  Megaphone, FolderX,
  Clock, MessageSquare,
  AlertCircle,
  Eye, Search, X} from 'lucide-react';
import { useDebounce } from '@/src/hooks/useDebounce';
import { toast } from 'sonner';
import { DashboardCard } from '@/src/components/dashboard/DashboardCard';
import { Badge } from '@/src/components/dashboard/Badge';
import { Modal } from '@/src/components/dashboard/Modal';
import ActionButton from '@/src/components/dashboard/ActionButton';
import {
  useGetAllTeamsAdmin,
  useApproveTeam,
  useRejectTeam,
  useSuspendTeam,
  useUnsuspendTeam,
  useDeleteTeam,
  type Team
} from '@/src/hooks/useTeam';

interface TeamRow {
  id: string
  name: string
  creator: string
  email: string
  location: string
  status: string
  statusBadge: React.ReactNode
  privacy: string
  createdDate: string
}

interface TeamDetail {
  id: string
  name: string
  description: string
  avatar?: string
  creator: { name: string; email: string }
  location: string
  privacy: string
  category: string
  goalAmount: number
  raisedAmount: number
  website?: string
  status: string
  reason?: string
  badge?: string
  memberCount: number
  campaignCount: number
  members: { name: string; email: string; role: string }[]
  campaigns: { title: string; status: string; raisedAmount: number; goalAmount: number }[]
  approvedBy?: { name: string; email: string }
  approvedAt?: string
  createdDate: string
  updatedAt: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-orange-100 text-orange-800',
  rejected: 'bg-red-100 text-red-800',
}


const transformToRow = (team: Team): TeamRow => ({
  id: team._id,
  name: team.name,
  creator: team.createdBy?.name || 'Unknown',
  email: team.createdBy?.email || 'N/A',
  location: team.location,
  status: team.status,
  statusBadge: (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[team.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
    </span>
  ),
  privacy: team.privacy.charAt(0).toUpperCase() + team.privacy.slice(1),
  createdDate: new Date(team.createdAt).toLocaleDateString(),
})

const transformToDetail = (team: Team): TeamDetail => ({
  id: team._id,
  name: team.name,
  description: team.description,
  avatar: team.avatar?.url,
  creator: {
    name: team.createdBy?.name || 'Unknown',
    email: team.createdBy?.email || 'N/A',
  },
  location: team.location,
  privacy: team.privacy,
  category: team.category,
  goalAmount: team.goalAmount,
  raisedAmount: team.raisedAmount,
  website: team.website || undefined,
  status: team.status,
  reason: (team as any).rejectionReason || (team as any).suspendedReason,
  badge: team.badge || undefined,
  memberCount: team.memberCount || 0,
  campaignCount: team.campaignCount || 0,
  members: team.members.map(m => ({
    name: m.user?.name || 'Unknown',
    email: m.user?.email || 'N/A',
    role: m.role
  })),
  campaigns: team.campaigns.map(c => ({
    title: c.title,
    status: c.status,
    raisedAmount: c.raisedAmount,
    goalAmount: c.goalAmount
  })),
  approvedBy: (team as any).approvedBy ? {
    name: (team as any).approvedBy.name,
    email: (team as any).approvedBy.email
  } : undefined,
  approvedAt: (team as any).approvedAt ? new Date((team as any).approvedAt).toLocaleString() : undefined,
  createdDate: new Date(team.createdAt).toLocaleDateString(),
  updatedAt: new Date(team.updatedAt).toLocaleDateString(),
})

export default function TeamsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all')
  const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'unsuspend' | 'delete' | null>(null)
  const [reasonInput, setReasonInput] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)

  const { data: teamsData, isLoading, isError, refetch } = useGetAllTeamsAdmin({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: debouncedSearch || undefined,
    limit: 100
  })

  console.log(teamsData);
  

  // We still need "all" counts even when filtered.
  // Ideally, we'd have a stats endpoint, but for now we fetch all if status is 'all'
  // or use the current returned total if filtered.
  // Improved: Fetch once for stats or derivation.
  const { data: allTeamsData } = useGetAllTeamsAdmin({ limit: 1000 })

  const teams = useMemo(() => teamsData?.teams || [], [teamsData])
  const teamRows = useMemo(() => teams.map(transformToRow), [teams])

  const statusCounts = useMemo(() => {
    const all = allTeamsData?.teams || []
    return {
      all: all.length,
      pending: all.filter((t: Team) => t.status === 'pending').length,
      active: all.filter((t: Team) => t.status === 'active').length,
      suspended: all.filter((t: Team) => t.status === 'suspended').length,
      rejected: all.filter((t: Team) => t.status === 'rejected').length,
    }
  }, [allTeamsData])

  const approveMutation = useApproveTeam()
  const rejectMutation = useRejectTeam()
  const suspendMutation = useSuspendTeam()
  const unsuspendMutation = useUnsuspendTeam()
  const deleteMutation = useDeleteTeam()

  const handleAction = (teamId: string, action: 'approve' | 'reject' | 'suspend' | 'unsuspend' | 'delete') => {
    const team = teams.find((t: Team) => t._id === teamId)
    if (!team) return

    setSelectedTeam(transformToDetail(team))
    setActionType(action)
    setReasonInput('')
    setIsModalOpen(true)
  }

  const confirmAction = () => {
    if (!selectedTeam) return

    if ((actionType === 'reject' || actionType === 'suspend') && !reasonInput.trim()) {
      toast.error('Please provide a reason')
      return
    }

    const payload = { id: selectedTeam.id }

    switch (actionType) {
      case 'approve':
        approveMutation.mutate(selectedTeam.id, {
          onSuccess: () => {
            toast.success('Team approved successfully')
            setIsModalOpen(false)
          }
        })
        break
      case 'reject':
        rejectMutation.mutate({ id: selectedTeam.id, rejectionReason: reasonInput }, {
          onSuccess: () => {
            toast.success('Team rejected successfully')
            setIsModalOpen(false)
          }
        })
        break
      case 'suspend':
        suspendMutation.mutate({ id: selectedTeam.id, suspendedReason: reasonInput }, {
          onSuccess: () => {
            toast.success('Team suspended successfully')
            setIsModalOpen(false)
          }
        })
        break
      case 'unsuspend':
        unsuspendMutation.mutate(selectedTeam.id, {
          onSuccess: () => {
            toast.success('Team unsuspended successfully')
            setIsModalOpen(false)
          }
        })
        break
      case 'delete':
        deleteMutation.mutate(selectedTeam.id, {
          onSuccess: () => {
            toast.success('Team deleted successfully')
            setIsModalOpen(false)
          }
        })
        break
    }
  }

  // Removed row calculation as it is now in useMemo

  const columns = [
    { key: 'name', label: 'Team Name', width: '25%' },
    { key: 'creator', label: 'Creator', width: '15%' },
    { key: 'location', label: 'Location', width: '15%' },
    { key: 'privacy', label: 'Privacy', width: '12%' },
    { key: 'status', label: 'Status', width: '15%', render: (row: TeamRow) => row.statusBadge },
    { key: 'createdDate', label: 'Created', width: '12%' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-setu-900 mb-2">Team Management</h1>
        <p className="text-setu-600">Review and manage all relief teams on the platform</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'all'
              ? 'border-setu-500 bg-setu-50'
              : 'border-setu-100 bg-white hover:border-setu-300'
          }`}
        >
          <p className="text-sm text-setu-600 mb-1">All Teams</p>
          <p className="text-2xl font-bold text-setu-900">{statusCounts.all}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('pending')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'pending'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-yellow-100 bg-white hover:border-yellow-300'
          }`}
        >
          <p className="text-sm text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{statusCounts.pending}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('active')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'active'
              ? 'border-green-500 bg-green-50'
              : 'border-green-100 bg-white hover:border-green-300'
          }`}
        >
          <p className="text-sm text-green-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-900">{statusCounts.active}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('suspended')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'suspended'
              ? 'border-orange-500 bg-orange-50'
              : 'border-orange-100 bg-white hover:border-orange-300'
          }`}
        >
          <p className="text-sm text-orange-600 mb-1">Suspended</p>
          <p className="text-2xl font-bold text-orange-900">{statusCounts.suspended}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('rejected')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'rejected'
              ? 'border-red-500 bg-red-50'
              : 'border-red-100 bg-white hover:border-red-300'
          }`}
        >
          <p className="text-sm text-red-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{statusCounts.rejected}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-setu-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-setu-400"
          />
          <input
            type="text"
            placeholder="Search teams by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-setu-400 hover:text-setu-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="text-sm text-setu-500">
          {isLoading ? (
            'Searching...'
          ) : (
            <>
              Showing <span className="font-bold text-setu-900">{teamRows.length}</span> results
            </>
          )}
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-lg border border-setu-100 overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-setu-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-setu-600 font-medium font-sans">Loading teams...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-setu-900 mb-2 font-display">Failed to load teams</h3>
              <p className="text-setu-600 mb-6 font-sans">We encountered an error while fetching the teams list. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="px-6 py-2 bg-setu-600 text-white rounded-lg hover:bg-setu-700 transition-colors font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-setu-50 border-b border-setu-100">
              <tr>
                {columns.map(col => (
                  <th key={col.key} style={{ width: col.width }} className="px-6 py-4 text-left text-xs font-semibold text-setu-700 uppercase tracking-wider font-sans">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-semibold text-setu-700 uppercase tracking-wider font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-setu-100 italic">
              {teamRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-setu-500 font-sans">
                    No teams found for this status.
                  </td>
                </tr>
              ) : (
                teamRows.map((row: TeamRow) => (
                  <tr key={row.id} className="hover:bg-setu-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const team = teams.find((t: Team) => t._id === row.id)
                          if (team) {
                            setSelectedTeam(transformToDetail(team))
                            setIsDetailModalOpen(true)
                          }
                        }}
                        className="font-semibold text-setu-700 hover:text-setu-900 cursor-pointer"
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.creator}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.location}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.privacy}</td>
                    <td className="px-6 py-4">{row.statusBadge}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.createdDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <ActionButton
                          icon={Eye}
                          label="View"
                          variant="view"
                          size="sm"
                          onClick={() => {
                            const team = teams.find((t: Team) => t._id === row.id)
                            if (team) {
                              setSelectedTeam(transformToDetail(team))
                              setIsDetailModalOpen(true)
                            }
                          }}
                        />
                        {row.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(row.id, 'approve')}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(row.id, 'reject')}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {row.status === 'active' && (
                          <button
                            onClick={() => handleAction(row.id, 'suspend')}
                            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 rounded transition-colors font-semibold"
                          >
                            Suspend
                          </button>
                        )}
                        {row.status === 'suspended' && (
                          <>
                            <button
                              onClick={() => handleAction(row.id, 'unsuspend')}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors font-semibold"
                            >
                              Unsuspend
                            </button>
                            <button
                              onClick={() => handleAction(row.id, 'delete')}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors font-semibold"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {row.status === 'rejected' && (
                          <button
                            onClick={() => handleAction(row.id, 'delete')}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal
  isOpen={isDetailModalOpen}
  onClose={() => {
    setIsDetailModalOpen(false)
    setSelectedTeam(null)
  }}
  title="Team Details"
  size="lg"
  footer={
    <button
      onClick={() => setIsDetailModalOpen(false)}
      className="px-6 py-2 bg-setu-100 text-setu-700 rounded-lg hover:bg-setu-200 transition-all font-semibold border border-setu-200"
    >
      Close
    </button>
  }
>
  {selectedTeam && (
    <div className="overflow-y-auto max-h-[65vh] pr-1 custom-scrollbar">
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header / Avatar Section */}
        <div className="flex items-center gap-4 pb-5 border-b border-setu-100">
          <div className="w-16 h-16 rounded-xl bg-setu-50 border border-setu-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {selectedTeam.avatar ? (
              <img src={selectedTeam.avatar} alt={selectedTeam.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-7 h-7 text-setu-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-display font-bold text-setu-900 truncate">
                {selectedTeam.name}
              </h3>
              {selectedTeam.badge && (
                <Badge variant="info" size="sm" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {selectedTeam.badge}
                </Badge>
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${statusColors[selectedTeam.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
                {selectedTeam.status.charAt(0).toUpperCase() + selectedTeam.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-setu-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-setu-400" /> {selectedTeam.location}
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-setu-400" /> {selectedTeam.privacy.charAt(0).toUpperCase() + selectedTeam.privacy.slice(1)}
              </span>
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-setu-400" /> {selectedTeam.category}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-setu-50/50 rounded-lg p-4 border border-setu-100/50">
          <h4 className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> About Team
          </h4>
          <p className="text-sm text-setu-700 leading-relaxed italic">
            {selectedTeam.description || "No description provided."}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border border-setu-100 flex flex-col items-center text-center">
            <Users className="w-4 h-4 text-setu-400 mb-1" />
            <p className="text-xl font-bold text-setu-900">{selectedTeam.memberCount}</p>
            <p className="text-[10px] font-semibold text-setu-400 uppercase tracking-wider">Members</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-setu-100 flex flex-col items-center text-center">
            <Target className="w-4 h-4 text-setu-400 mb-1" />
            <p className="text-xl font-bold text-setu-900">{selectedTeam.campaignCount}</p>
            <p className="text-[10px] font-semibold text-setu-400 uppercase tracking-wider">Campaigns</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-setu-100 flex flex-col items-center text-center">
            <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
            <p className="text-xl font-bold text-setu-900">
              {selectedTeam.goalAmount > 0 ? Math.round((selectedTeam.raisedAmount / selectedTeam.goalAmount) * 100) : 0}%
            </p>
            <p className="text-[10px] font-semibold text-setu-400 uppercase tracking-wider">Funded</p>
          </div>
        </div>

        {/* Fundraising Bar */}
        <div className="bg-white rounded-lg p-4 border border-setu-100">
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <h4 className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Fundraising
              </h4>
              <p className="text-xl font-bold text-setu-900 font-display">₨{selectedTeam.raisedAmount.toLocaleString()}</p>
            </div>
            <p className="text-xs text-setu-500">Goal: ₨{selectedTeam.goalAmount.toLocaleString()}</p>
          </div>
          <div className="w-full bg-setu-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, selectedTeam.goalAmount > 0 ? (selectedTeam.raisedAmount / selectedTeam.goalAmount) * 100 : 0)}%` }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg p-3 border border-setu-100">
            <p className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> Creator
            </p>
            <p className="text-sm font-semibold text-setu-900 truncate">{selectedTeam.creator.name}</p>
            <p className="text-[11px] text-setu-500 truncate">{selectedTeam.creator.email}</p>
          </div>
          <div className="rounded-lg p-3 border border-setu-100">
            <p className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Website
            </p>
            {selectedTeam.website ? (
              <a href={selectedTeam.website} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-sm text-setu-300">—</p>
            )}
          </div>
          <div className="rounded-lg p-3 border border-setu-100">
            <p className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <CalendarPlus className="w-3 h-3" /> Created
            </p>
            <p className="text-sm font-semibold text-setu-900">{selectedTeam.createdDate}</p>
          </div>
          <div className="rounded-lg p-3 border border-setu-100">
            <p className="text-[10px] font-bold text-setu-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <CalendarClock className="w-3 h-3" /> Updated
            </p>
            <p className="text-sm font-semibold text-setu-900">{selectedTeam.updatedAt}</p>
          </div>
        </div>

        {/* Members & Campaigns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Members */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-setu-500 uppercase tracking-widest flex justify-between items-center">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Team Members</span>
              <span className="text-setu-300">{selectedTeam.members.length} total</span>
            </h4>
            <div className="bg-white border border-setu-100 rounded-lg overflow-hidden max-h-[150px] overflow-y-auto custom-scrollbar">
              {selectedTeam.members.length > 0 ? (
                <div className="divide-y divide-setu-50">
                  {selectedTeam.members.map((member, i) => (
                    <div key={i} className="px-3 py-2.5 hover:bg-setu-50/50 transition-colors flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-setu-800 truncate">{member.name}</p>
                        <p className="text-[11px] text-setu-500 truncate">{member.email}</p>
                      </div>
                      <Badge variant="info" size="sm" className="capitalize text-[10px] h-5 border-setu-200 text-setu-600 bg-white">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-setu-400 text-sm flex flex-col items-center gap-2">
                  <UserX className="w-5 h-5 text-setu-300" />
                  No members found.
                </div>
              )}
            </div>
          </div>

          {/* Campaigns */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-setu-500 uppercase tracking-widest flex justify-between items-center">
              <span className="flex items-center gap-1"><Megaphone className="w-3 h-3" /> Linked Campaigns</span>
              <span className="text-setu-300">{selectedTeam.campaigns.length} total</span>
            </h4>
            <div className="bg-white border border-setu-100 rounded-lg overflow-hidden max-h-[150px] overflow-y-auto custom-scrollbar">
              {selectedTeam.campaigns.length > 0 ? (
                <div className="divide-y divide-setu-50">
                  {selectedTeam.campaigns.map((campaign, i) => (
                    <div key={i} className="px-3 py-2.5 hover:bg-setu-50/50 transition-colors flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-setu-800 truncate flex-1">{campaign.title}</p>
                        <Badge variant={campaign.status === 'active' ? 'success' : 'pending'} size="sm" className="capitalize text-[9px] px-1.5 h-4">
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="w-full bg-setu-50 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-setu-300 h-full rounded-full"
                          style={{ width: `${Math.min(100, campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-setu-400 text-sm flex flex-col items-center gap-2">
                  <FolderX className="w-5 h-5 text-setu-300" />
                  No campaigns linked.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Audit */}
        {(selectedTeam.approvedBy || selectedTeam.reason) && (
          <div className="bg-orange-50/30 rounded-lg p-4 border border-orange-100/50">
            <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Audit Trail
            </h4>
            <div className="space-y-3">
              {selectedTeam.approvedBy && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase mb-0.5 flex items-center gap-1">
                      <UserCog className="w-3 h-3" /> Handled By
                    </p>
                    <p className="text-sm font-semibold text-orange-800">{selectedTeam.approvedBy.name}</p>
                    <p className="text-[11px] text-orange-600/80">{selectedTeam.approvedBy.email}</p>
                  </div>
                  {selectedTeam.approvedAt && (
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase mb-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated At
                      </p>
                      <p className="text-sm font-semibold text-orange-800">{selectedTeam.approvedAt}</p>
                    </div>
                  )}
                </div>
              )}
              {selectedTeam.reason && (
                <div className="pt-2 border-t border-orange-100/50">
                  <p className="text-[10px] font-bold text-orange-400 uppercase mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Reason / Comment
                  </p>
                  <div className="bg-white/80 border border-orange-100 rounded-lg p-3 text-sm text-orange-900 leading-relaxed">
                    {selectedTeam.reason}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )}
</Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTeam(null)
          setActionType(null)
          setReasonInput('')
        }}
        title={
          actionType === 'approve'
            ? 'Approve Team'
            : actionType === 'reject'
            ? 'Reject Team'
            : actionType === 'suspend'
            ? 'Suspend Team'
            : actionType === 'unsuspend'
            ? 'Unsuspend Team'
            : 'Delete Team'
        }
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsModalOpen(false)
                setSelectedTeam(null)
                setActionType(null)
                setReasonInput('')
              }}
              className="px-4 py-2 border border-setu-300 text-setu-700 rounded hover:bg-setu-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`px-4 py-2 text-white rounded transition-colors ${
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject' || actionType === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionType === 'suspend'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : actionType === 'suspend' ? 'Suspend' : actionType === 'unsuspend' ? 'Unsuspend' : 'Delete'}
            </button>
          </div>
        }
      >
        {selectedTeam && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-setu-700 mb-2">
                {actionType === 'approve'
                  ? `Approve team "${selectedTeam.name}"? This will make the team active and visible on the platform.`
                  : actionType === 'reject'
                  ? `Reject team "${selectedTeam.name}"? This action cannot be undone.`
                  : actionType === 'suspend'
                  ? `Suspend team "${selectedTeam.name}"? The team will be removed from public listings.`
                  : actionType === 'unsuspend'
                  ? `Unsuspend team "${selectedTeam.name}"? The team will be restored and visible again.`
                  : `Delete team "${selectedTeam.name}"? This action is permanent and cannot be undone. All team data will be permanently removed.`}
              </p>
            </div>

            {(actionType === 'reject' || actionType === 'suspend') && (
              <div>
                <label className="block text-sm font-medium text-setu-700 mb-2">Reason</label>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Enter the reason for this action..."
                  className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                  rows={4}
                />
              </div>
            )}

            {actionType === 'delete' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-red-800 mb-1">Warning: Permanent Deletion</p>
                    <p className="text-sm text-red-700">
                      This action will permanently delete the team and all associated data. This includes:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                      <li>Team profile and information</li>
                      <li>Member associations</li>
                      <li>Campaign links (campaigns will remain but be unlinked)</li>
                      <li>Team history and audit trail</li>
                    </ul>
                    <p className="text-sm text-red-700 mt-2 font-medium">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
