"use client";

import { useMemo, useState } from "react";
import { 
  Package, 
  BarChart3, 
  CheckCircle, 
  Truck, 
  Clock, 
  AlertCircle,
  Eye,
  Search,
  X,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Banknote,
  Maximize2
} from "lucide-react";
import { useDebounce } from '@/src/hooks/useDebounce';
import { toast } from 'sonner';
import { DashboardCard } from "@/src/components/dashboard/DashboardCard";
import { Badge } from "@/src/components/dashboard/Badge";
import { Modal } from "@/src/components/dashboard/Modal";
import ActionButton from '@/src/components/dashboard/ActionButton';
import {
  useGetAllGoodsDonations,
  useGetGoodsDonationStats,
  useVerifyGoodsDonation,
  useRejectGoodsDonation,
  useSchedulePickup,
  useMarkAsCollected,
  useMarkAsDelivered,
  useMarkAsCompleted,
  useUpdateAdminNotes,
  useDeleteGoodsDonation,
  type GoodsDonation
} from '@/src/hooks/useGoods';

interface GoodsDonationRow {
  id: string;
  donorName: string;
  donorEmail: string;
  campaignTitle: string;
  totalItems: number;
  totalValue: number;
  city: string;
  deliveryMethod: string;
  status: string;
  statusBadge: React.ReactNode;
  createdDate: string;
}

interface GoodsDonationDetail extends GoodsDonation {
  // Additional computed fields for display
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-purple-100 text-purple-800',
  collected: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
};

const transformToRow = (donation: GoodsDonation): GoodsDonationRow => ({
  id: donation._id,
  donorName: donation.donor?.name || 'Unknown',
  donorEmail: donation.donor?.email || 'N/A',
  campaignTitle: donation.campaign?.title || 'Unknown Campaign',
  totalItems: donation.totalItems,
  totalValue: donation.totalEstimatedValue,
  city: donation.pickupLocation?.city || 'N/A',
  deliveryMethod: donation.deliveryMethod,
  status: donation.status,
  statusBadge: (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[donation.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
    </span>
  ),
  createdDate: new Date(donation.createdAt).toLocaleDateString(),
});

export default function GoodsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'verified' | 'scheduled' | 'collected' | 'delivered' | 'completed' | 'rejected'>('all');
  const [selectedDonation, setSelectedDonation] = useState<GoodsDonationDetail | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject' | 'schedule' | 'collect' | 'deliver' | 'complete' | 'notes' | 'updateStatus' | 'delete' | 'viewMap' | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: donationsData, isLoading, isError, refetch } = useGetAllGoodsDonations({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: debouncedSearch || undefined,
    limit: 100
  });

  const { data: statsData } = useGetGoodsDonationStats();

  const donations = useMemo(() => donationsData?.donations || [], [donationsData]);
  const donationRows = useMemo(() => donations.map(transformToRow), [donations]);

  console.log(donations); 

  // Calculate stats from data
  const stats = useMemo(() => {
    if (!statsData?.data) {
      return {
        total: donations.length,
        pending: donations.filter(d => d.status === 'pending').length,
        verified: donations.filter(d => d.status === 'verified').length,
        completed: donations.filter(d => d.status === 'completed').length,
        totalValue: donations.reduce((sum, d) => sum + d.totalEstimatedValue, 0),
        totalItems: donations.reduce((sum, d) => sum + d.totalItems, 0),
      };
    }

    const statusStats = statsData.data.statusStats.reduce((acc, stat) => {
      acc[stat._id] = stat;
      return acc;
    }, {} as Record<string, any>);

    return {
      total: statsData.data.statusStats.reduce((sum, stat) => sum + stat.count, 0),
      pending: statusStats.pending?.count || 0,
      verified: statusStats.verified?.count || 0,
      completed: statusStats.completed?.count || 0,
      totalValue: statsData.data.statusStats.reduce((sum, stat) => sum + stat.totalValue, 0),
      totalItems: statsData.data.statusStats.reduce((sum, stat) => sum + stat.totalItems, 0),
    };
  }, [statsData, donations]);

  const verifyMutation = useVerifyGoodsDonation();
  const rejectMutation = useRejectGoodsDonation();
  const schedulePickupMutation = useSchedulePickup();
  const markCollectedMutation = useMarkAsCollected();
  const markDeliveredMutation = useMarkAsDelivered();
  const markCompletedMutation = useMarkAsCompleted();
  const updateNotesMutation = useUpdateAdminNotes();
  const deleteMutation = useDeleteGoodsDonation();

  const handleAction = (donationId: string, action: typeof actionType) => {
    const donation = donations.find(d => d._id === donationId);
    if (!donation) return;

    if (action === 'viewMap') {
      setSelectedDonation(donation);
      setIsMapModalOpen(true);
      return;
    }

    setSelectedDonation(donation);
    setActionType(action);
    setReasonInput('');
    setScheduledDate('');
    setCourierName('');
    setCourierPhone('');
    setTrackingNumber('');
    setAdminNotes(donation.adminNotes || '');
    setNewStatus(donation.status);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (!selectedDonation) return;

    switch (actionType) {
      case 'verify':
        verifyMutation.mutate(selectedDonation._id, {
          onSuccess: () => {
            toast.success('Donation verified successfully');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'reject':
        if (!reasonInput.trim()) {
          toast.error('Please provide a rejection reason');
          return;
        }
        rejectMutation.mutate({ id: selectedDonation._id, rejectionReason: reasonInput }, {
          onSuccess: () => {
            toast.success('Donation rejected');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'schedule':
        if (!scheduledDate) {
          toast.error('Please select a pickup date');
          return;
        }
        const courierInfo = courierName ? {
          name: courierName,
          phone: courierPhone,
          trackingNumber: trackingNumber || undefined
        } : undefined;
        
        schedulePickupMutation.mutate({ 
          id: selectedDonation._id, 
          data: { 
            scheduledPickupDate: scheduledDate,
            courierInfo 
          }
        }, {
          onSuccess: () => {
            toast.success('Pickup scheduled successfully');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'collect':
        markCollectedMutation.mutate({ id: selectedDonation._id }, {
          onSuccess: () => {
            toast.success('Marked as collected');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'deliver':
        markDeliveredMutation.mutate({ id: selectedDonation._id }, {
          onSuccess: () => {
            toast.success('Marked as delivered');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'complete':
        markCompletedMutation.mutate(selectedDonation._id, {
          onSuccess: () => {
            toast.success('Donation completed');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'notes':
        updateNotesMutation.mutate({ id: selectedDonation._id, adminNotes }, {
          onSuccess: () => {
            toast.success('Notes updated');
            setIsModalOpen(false);
          }
        });
        break;
      
      case 'updateStatus':
        if (!newStatus) {
          toast.error('Please select a status');
          return;
        }

        // If status hasn't changed, just close the modal
        if (newStatus === selectedDonation.status) {
          setIsModalOpen(false);
          return;
        }

        // Use appropriate mutation based on selected status
        switch (newStatus) {
          case 'pending':
            // Logic for setting back to pending if needed
            toast.error('Changing status back to pending is not supported via this action.');
            break;
          case 'verified':
            verifyMutation.mutate(selectedDonation._id, {
              onSuccess: () => {
                toast.success('Status updated to verified');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          case 'rejected':
            if (!reasonInput.trim()) {
              toast.error('Please provide a rejection reason');
              return;
            }
            rejectMutation.mutate({ id: selectedDonation._id, rejectionReason: reasonInput }, {
              onSuccess: () => {
                toast.success('Status updated to rejected');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          case 'scheduled':
            if (!scheduledDate) {
              toast.error('Please select a pickup date');
              return;
            }
            const courierInfo = courierName ? {
              name: courierName,
              phone: courierPhone,
              trackingNumber: trackingNumber || undefined
            } : undefined;
            
            schedulePickupMutation.mutate({ 
              id: selectedDonation._id, 
              data: { 
                scheduledPickupDate: scheduledDate,
                courierInfo 
              }
            }, {
              onSuccess: () => {
                toast.success('Status updated to scheduled');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          case 'collected':
            markCollectedMutation.mutate({ id: selectedDonation._id }, {
              onSuccess: () => {
                toast.success('Status updated to collected');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          case 'delivered':
            markDeliveredMutation.mutate({ id: selectedDonation._id }, {
              onSuccess: () => {
                toast.success('Status updated to delivered');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          case 'completed':
            markCompletedMutation.mutate(selectedDonation._id, {
              onSuccess: () => {
                toast.success('Status updated to completed');
                setIsModalOpen(false);
              },
              onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update status');
              }
            });
            break;
          default:
            toast.error('Status update not implemented for this status');
        }
        break;
      
      case 'delete':
        if (selectedDonation.status !== 'rejected') {
          toast.error('Only rejected donations can be deleted');
          return;
        }
        deleteMutation.mutate(selectedDonation._id, {
          onSuccess: () => {
            toast.success('Donation deleted successfully');
            setIsModalOpen(false);
          }
        });
        break;
    }
  };

  const columns = [
    { key: 'donorName', label: 'Donor', width: '20%' },
    { key: 'campaignTitle', label: 'Campaign', width: '20%' },
    { key: 'totalItems', label: 'Items', width: '10%' },
    { key: 'totalValue', label: 'Est. Value', width: '12%' },
    { key: 'city', label: 'City', width: '12%' },
    { key: 'status', label: 'Status', width: '15%', render: (row: GoodsDonationRow) => row.statusBadge },
    { key: 'createdDate', label: 'Created', width: '11%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-setu-900 mb-2">Goods Donations</h1>
        <p className="text-setu-600">Manage physical goods donations and logistics</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-6 gap-4">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'all'
              ? 'border-setu-500 bg-setu-50'
              : 'border-setu-100 bg-white hover:border-setu-300'
          }`}
        >
          <p className="text-sm text-setu-600 mb-1">All Donations</p>
          <p className="text-2xl font-bold text-setu-900">{stats.total}</p>
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
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('verified')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'verified'
              ? 'border-blue-500 bg-blue-50'
              : 'border-blue-100 bg-white hover:border-blue-300'
          }`}
        >
          <p className="text-sm text-blue-600 mb-1">Verified</p>
          <p className="text-2xl font-bold text-blue-900">{stats.verified}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('completed')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedStatus === 'completed'
              ? 'border-green-500 bg-green-50'
              : 'border-green-100 bg-white hover:border-green-300'
          }`}
        >
          <p className="text-sm text-green-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
        </div>

        <div className="p-4 rounded-lg border border-setu-100 bg-white">
          <p className="text-sm text-setu-600 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-setu-900">{stats.totalItems.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-lg border border-setu-100 bg-white">
          <p className="text-sm text-setu-600 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-setu-900">₨{stats.totalValue.toLocaleString()}</p>
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
            placeholder="Search donations by donor, campaign, or city..."
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
            'Loading...'
          ) : (
            <>
              Showing <span className="font-bold text-setu-900">{donationRows.length}</span> results
            </>
          )}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg border border-setu-100 overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-setu-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-setu-600 font-medium font-sans">Loading donations...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-setu-900 mb-2 font-display">Failed to load donations</h3>
              <p className="text-setu-600 mb-6 font-sans">We encountered an error while fetching the donations list. Please try again.</p>
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
            <tbody className="divide-y divide-setu-100">
              {donationRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-setu-500 font-sans">
                    No donations found for this status.
                  </td>
                </tr>
              ) : (
                donationRows.map((row: GoodsDonationRow) => (
                  <tr key={row.id} className="hover:bg-setu-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const donation = donations.find(d => d._id === row.id);
                          if (donation) {
                            setSelectedDonation(donation);
                            setIsDetailModalOpen(true);
                          }
                        }}
                        className="font-semibold text-setu-700 hover:text-setu-900 cursor-pointer text-left"
                      >
                        <div>{row.donorName}</div>
                        <div className="text-xs text-setu-500">{row.donorEmail}</div>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.campaignTitle}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.totalItems}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">₨{row.totalValue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-setu-600 font-sans">{row.city}</td>
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
                            const donation = donations.find(d => d._id === row.id);
                            if (donation) {
                              setSelectedDonation(donation);
                              setIsDetailModalOpen(true);
                            }
                          }}
                        />
                        
                        {/* Admin controls */}
                        <button
                          onClick={() => handleAction(row.id, 'updateStatus')}
                          className="px-3 py-1 text-xs bg-setu-100 text-setu-700 hover:bg-setu-200 rounded transition-colors font-semibold flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" /> Status
                        </button>

                        <button
                          onClick={() => handleAction(row.id, 'notes')}
                          className="px-3 py-1 text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 rounded transition-colors font-semibold flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Notes
                        </button>
                        
                        {/* Delete button for rejected donations */}
                        {row.status === 'rejected' && (
                          <ActionButton
                            variant="delete"
                            size="sm"
                            onClick={() => handleAction(row.id, 'delete')}
                          />
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
      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDonation(null);
        }}
        title="Goods Donation Details"
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
        {selectedDonation && (
          <div className="overflow-y-auto max-h-[80vh] pr-1 custom-scrollbar">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

              {/* Header Section */}
              <div className="flex items-start justify-between pb-4 border-b border-setu-100">
                <div>
                  <h3 className="text-lg font-display font-bold text-setu-900 mb-1">
                    Donation #{selectedDonation._id.slice(-8)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${statusColors[selectedDonation.status as keyof typeof statusColors] || 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
                      {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                    </span>
                    <span className="text-xs text-setu-500">
                      Created {new Date(selectedDonation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-setu-900">₨{selectedDonation.totalEstimatedValue.toLocaleString()}</p>
                  <p className="text-sm text-setu-500">{selectedDonation.totalItems} items</p>
                </div>
              </div>

              {/* Campaign & Donor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-setu-50/50 rounded-lg p-4 border border-setu-100/50">
                  <h4 className="text-xs font-bold text-setu-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> Donor Information
                  </h4>
                  <p className="font-semibold text-setu-900">{selectedDonation.donor?.name}</p>
                  <p className="text-sm text-setu-600">{selectedDonation.donor?.email}</p>
                  {selectedDonation.contactInfo?.phone && (
                    <p className="text-sm text-setu-600 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {selectedDonation.contactInfo.phone}
                    </p>
                  )}
                </div>
                <div className="bg-setu-50/50 rounded-lg p-4 border border-setu-100/50">
                  <h4 className="text-xs font-bold text-setu-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Package className="w-3 h-3" /> Campaign
                  </h4>
                  <p className="font-semibold text-setu-900">{selectedDonation.campaign?.title}</p>
                  <p className="text-sm text-setu-600">Status: {selectedDonation.campaign?.status}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="bg-white rounded-lg p-4 border border-setu-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-setu-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Pickup Location
                  </h4>
                  <button
                    onClick={() => handleAction(selectedDonation._id, 'viewMap')}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors font-semibold flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> View on Map
                  </button>
                </div>
                <p className="font-semibold text-setu-900">{selectedDonation.pickupLocation?.name}</p>
                <p className="text-sm text-setu-600">{selectedDonation.pickupLocation?.address}</p>
                <p className="text-sm text-setu-600">{selectedDonation.pickupLocation?.city}, {selectedDonation.pickupLocation?.state}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-setu-500">
                  <span>Delivery: {selectedDonation.deliveryMethod}</span>
                  {selectedDonation.preferredPickupTime && (
                    <span>Preferred: {new Date(selectedDonation.preferredPickupTime).toLocaleString()}</span>
                  )}
                  {selectedDonation.pickupLocation?.coordinates && (
                    <span>Coordinates: {selectedDonation.pickupLocation.coordinates[1]}, {selectedDonation.pickupLocation.coordinates[0]}</span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-setu-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Donated Items ({selectedDonation.items.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedDonation.items?.map((item, index) => (
                    <div key={item._id || index} className="bg-white border-2 border-setu-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group/item">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <div className="flex-1">
                            <h5 className="font-bold text-setu-900 text-xl group-hover/item:text-setu-600 transition-colors duration-300 leading-tight mb-2">
                              {item.name}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              <span className="capitalize bg-setu-100 text-setu-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">{item.category}</span>
                              <span className="capitalize bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">Condition: {item.condition}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="inline-block text-setu-900 px-3 py-1.5 rounded-xl mb-1">
                              <p className="font-bold text-lg">₨{item.estimatedValue.toLocaleString()}</p>
                            </div>
                            <p className="text-xs font-bold text-setu-500 uppercase tracking-tighter">{item.quantity} {item.unit}</p>
                          </div>
                        </div>
                        
                        {item.description && (
                          <div className="relative mb-5">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-setu-200 rounded-full" />
                            <p className="text-sm text-setu-600 pl-4 italic leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        )}
                        
                        {/* Item Images */}
                        {item.images && item.images.length > 0 ? (
                          <div className="mt-4 pt-4 border-t border-setu-50">
                            <p className="text-[11px] font-black text-setu-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Package className="w-3.5 h-3.5" /> Donated Item Evidence ({item.images.length})
                            </p>
                            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar snap-x">
                              {item.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative flex-shrink-0 group/img snap-start">
                                  {image.url ? (
                                    <div className="relative w-28 h-28">
                                      <img
                                        src={image.url.startsWith('http') ? image.url : `${process.env.NEXT_PUBLIC_API_URL}${image.url}`}
                                        alt={`${item.name} ${imgIndex + 1}`}
                                        className="w-full h-full object-cover rounded-xl border border-setu-100 transition-all duration-500 group-hover/img:scale-110 group-hover/img:rotate-1 shadow-sm"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://placehold.co/112x112/f8fafc/64748b?text=Item+Evidence';
                                        }}
                                      />
                                      <button 
                                        onClick={() => window.open(image.url.startsWith('http') ? image.url : `${process.env.NEXT_PUBLIC_API_URL}${image.url}`, '_blank')}
                                        className="absolute inset-0 bg-setu-900/60 opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl"
                                      >
                                        <Maximize2 className="w-6 h-6 text-white transform scale-75 group-hover/img:scale-100 transition-transform duration-300" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-28 h-28 bg-setu-50 rounded-xl flex items-center justify-center border-2 border-dashed border-setu-100">
                                      <Package className="w-8 h-8 text-setu-200" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-setu-50">
                            <div className="bg-setu-50/50 rounded-xl p-4 flex items-center gap-3 border border-dashed border-setu-100">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-setu-100 text-setu-300">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-setu-500 uppercase">No evidence attached</p>
                                    <p className="text-[10px] text-setu-400">Donor didn't provide images for this item.</p>
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics Timeline */}
              {(selectedDonation.scheduledPickupDate || selectedDonation.actualPickupDate || selectedDonation.deliveryDate) && (
                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Logistics Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    {selectedDonation.scheduledPickupDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-900">Scheduled: {new Date(selectedDonation.scheduledPickupDate).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedDonation.actualPickupDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-900">Collected: {new Date(selectedDonation.actualPickupDate).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedDonation.deliveryDate && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-900">Delivered: {new Date(selectedDonation.deliveryDate).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedDonation.courierInfo && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="font-semibold text-setu-900">Courier: {selectedDonation.courierInfo.name}</p>
                        <p className="text-sm text-setu-600">{selectedDonation.courierInfo.phone}</p>
                        {selectedDonation.courierInfo.trackingNumber && (
                          <p className="text-sm text-setu-600">Tracking: {selectedDonation.courierInfo.trackingNumber}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {(selectedDonation.donorNotes || selectedDonation.adminNotes || selectedDonation.rejectionReason) && (
                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100/50">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Notes & Comments
                  </h4>
                  <div className="space-y-3">
                    {selectedDonation.donorNotes && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Donor Notes:</p>
                        <p className="text-sm text-gray-800 bg-white p-3 rounded border">{selectedDonation.donorNotes}</p>
                      </div>
                    )}
                    {selectedDonation.adminNotes && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-800 bg-white p-3 rounded border">{selectedDonation.adminNotes}</p>
                      </div>
                    )}
                    {selectedDonation.rejectionReason && (
                      <div>
                        <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-800 bg-red-50 p-3 rounded border border-red-200">{selectedDonation.rejectionReason}</p>
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
          setIsModalOpen(false);
          setSelectedDonation(null);
          setActionType(null);
          setReasonInput('');
          setScheduledDate('');
          setCourierName('');
          setCourierPhone('');
          setTrackingNumber('');
          setAdminNotes('');
          setNewStatus('');
        }}
        title={
          actionType === 'verify'
            ? 'Verify Donation'
            : actionType === 'reject'
            ? 'Reject Donation'
            : actionType === 'schedule'
            ? 'Schedule Pickup'
            : actionType === 'collect'
            ? 'Mark as Collected'
            : actionType === 'deliver'
            ? 'Mark as Delivered'
            : actionType === 'complete'
            ? 'Complete Donation'
            : actionType === 'updateStatus'
            ? 'Update Status'
            : actionType === 'delete'
            ? 'Delete Donation'
            : 'Update Notes'
        }
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDonation(null);
                setActionType(null);
                setReasonInput('');
                setScheduledDate('');
                setCourierName('');
                setCourierPhone('');
                setTrackingNumber('');
                setAdminNotes('');
                setNewStatus('');
              }}
              className="px-4 py-2 border border-setu-300 text-setu-700 rounded hover:bg-setu-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              className={`px-4 py-2 text-white rounded transition-colors ${
                actionType === 'verify'
                  ? 'bg-green-600 hover:bg-green-700'
                  : actionType === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionType === 'schedule'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : actionType === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-setu-600 hover:bg-setu-700'
              }`}
            >
              {actionType === 'verify' ? 'Verify' : 
               actionType === 'reject' ? 'Reject' : 
               actionType === 'schedule' ? 'Schedule' : 
               actionType === 'collect' ? 'Mark Collected' : 
               actionType === 'deliver' ? 'Mark Delivered' : 
               actionType === 'complete' ? 'Complete' : 
               actionType === 'updateStatus' ? 'Update Status' :
               actionType === 'delete' ? 'Delete' : 'Update'}
            </button>
          </div>
        }
      >
        {selectedDonation && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-setu-700 mb-2">
                {actionType === 'verify'
                  ? `Verify goods donation from ${selectedDonation.donor?.name}? This will mark the donation as verified and ready for pickup scheduling.`
                  : actionType === 'reject'
                  ? `Reject goods donation from ${selectedDonation.donor?.name}? This action cannot be undone.`
                  : actionType === 'schedule'
                  ? `Schedule pickup for goods donation from ${selectedDonation.donor?.name}.`
                  : actionType === 'collect'
                  ? `Mark goods as collected from ${selectedDonation.donor?.name}?`
                  : actionType === 'deliver'
                  ? `Mark goods as delivered to the campaign?`
                  : actionType === 'complete'
                  ? `Complete this goods donation? This will update the campaign statistics.`
                  : actionType === 'updateStatus'
                  ? `Update the status of this donation. Current status: ${selectedDonation.status}`
                  : actionType === 'delete'
                  ? `Delete this rejected donation? This action cannot be undone.`
                  : `Update admin notes for this donation.`}
              </p>
            </div>

            {actionType === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-setu-700 mb-2">Rejection Reason</label>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Enter the reason for rejecting this donation..."
                  className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                  rows={4}
                />
              </div>
            )}

            {actionType === 'schedule' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-setu-700 mb-2">Scheduled Pickup Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                  />
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-setu-700 mb-3">Courier Information (Optional)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-setu-600 mb-1">Courier Name</label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="Courier name"
                        className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-setu-600 mb-1">Courier Phone</label>
                      <input
                        type="text"
                        value={courierPhone}
                        onChange={(e) => setCourierPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-setu-600 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Tracking number (optional)"
                      className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {actionType === 'notes' && (
              <div>
                <label className="block text-sm font-medium text-setu-700 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this donation..."
                  className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                  rows={4}
                />
              </div>
            )}

            {actionType === 'updateStatus' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-setu-700 mb-2">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                  >
                    <option value="">Select new status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="collected">Collected</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {newStatus === 'rejected' && (
                  <div>
                    <label className="block text-sm font-medium text-setu-700 mb-2">Rejection Reason</label>
                    <textarea
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      placeholder="Enter the reason for rejecting this donation..."
                      className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                      rows={3}
                    />
                  </div>
                )}

                {newStatus === 'scheduled' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-setu-700 mb-2">Scheduled Pickup Date & Time</label>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                      />
                    </div>
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-setu-700 mb-2">Courier Information (Optional)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-setu-600 mb-1">Courier Name</label>
                          <input
                            type="text"
                            value={courierName}
                            onChange={(e) => setCourierName(e.target.value)}
                            placeholder="Courier name"
                            className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-setu-600 mb-1">Courier Phone</label>
                          <input
                            type="text"
                            value={courierPhone}
                            onChange={(e) => setCourierPhone(e.target.value)}
                            placeholder="Phone number"
                            className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs text-setu-600 mb-1">Tracking Number</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Tracking number (optional)"
                          className="w-full px-3 py-2 border border-setu-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-setu-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {actionType === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-red-900">Confirm Deletion</h4>
                </div>
                <p className="text-sm text-red-700">
                  This will permanently delete the donation and all associated data. This action cannot be undone.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Map Modal */}
      <Modal
        isOpen={isMapModalOpen}
        onClose={() => {
          setIsMapModalOpen(false);
          setSelectedDonation(null);
        }}
        title="Pickup Location"
        size="lg"
        footer={
          <button
            onClick={() => setIsMapModalOpen(false)}
            className="px-6 py-2 bg-setu-100 text-setu-700 rounded-lg hover:bg-setu-200 transition-all font-semibold border border-setu-200"
          >
            Close
          </button>
        }
      >
        {selectedDonation && selectedDonation.pickupLocation && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar p-1">
            {/* Location Details */}
            <div className="bg-setu-50 rounded-2xl p-6 border-2 border-setu-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-setu-100/50 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-setu-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-setu-600" />
                </div>
                <div>
                  <h3 className="font-bold text-setu-950 text-lg mb-1">{selectedDonation.pickupLocation.name}</h3>
                  <div className="space-y-1 text-sm text-setu-700 font-medium leading-relaxed">
                    <p>{selectedDonation.pickupLocation.address}</p>
                    <p>{selectedDonation.pickupLocation.city}, {selectedDonation.pickupLocation.state}</p>
                    {selectedDonation.pickupLocation.coordinates && (
                      <p className="text-[11px] font-bold text-setu-400 mt-2 tracking-widest uppercase">
                        GPS: {selectedDonation.pickupLocation.coordinates[1].toFixed(6)}, {selectedDonation.pickupLocation.coordinates[0].toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container - Full View */}
            <div className="bg-white rounded-2xl border-2 border-setu-100 shadow-sm overflow-hidden min-h-[400px]">
              {selectedDonation.pickupLocation.coordinates && selectedDonation.pickupLocation.coordinates[0] !== 0 && selectedDonation.pickupLocation.coordinates[1] !== 0 ? (
                <div className="relative h-[450px]">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedDonation.pickupLocation.coordinates[0]-0.005}%2C${selectedDonation.pickupLocation.coordinates[1]-0.005}%2C${selectedDonation.pickupLocation.coordinates[0]+0.005}%2C${selectedDonation.pickupLocation.coordinates[1]+0.005}&layer=mapnik&marker=${selectedDonation.pickupLocation.coordinates[1]}%2C${selectedDonation.pickupLocation.coordinates[0]}`}
                    className="w-full h-full rounded-b-lg border-0 shadow-inner"
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="p-4 bg-setu-50/90 backdrop-blur-md flex justify-center gap-4 border-t border-setu-100">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${selectedDonation.pickupLocation.coordinates[1]}&mlon=${selectedDonation.pickupLocation.coordinates[0]}&zoom=17`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-setu-900 text-white rounded-2xl hover:bg-setu-950 shadow-xl shadow-setu-200 transition-all font-bold text-xs flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" /> Open Interactive Map
                    </a>
                    <a
                      href={`https://www.google.com/maps?q=${selectedDonation.pickupLocation.coordinates[1]},${selectedDonation.pickupLocation.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-white border-2 border-setu-100 text-setu-700 rounded-2xl hover:bg-setu-50 transition-all font-bold text-xs flex items-center gap-2"
                    >
                      <Maximize2 className="w-4 h-4" /> External View
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                    <MapPin className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="font-bold text-gray-700 mb-2">No Coordinates Available</h4>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    Location coordinates are not available for this pickup location. Please check the address details.
                  </p>
                </div>
              )}
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-5 border-2 border-blue-50 shadow-sm relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-50/50 rounded-full" />
                <h4 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-blue-50/50">
                    <span className="text-blue-600/70 font-semibold">Primary Phone</span>
                    <span className="text-blue-900 font-bold tracking-tight">{selectedDonation.contactInfo.phone}</span>
                  </div>
                  {selectedDonation.contactInfo.alternatePhone && (
                    <div className="flex items-center justify-between text-sm py-2 border-b border-blue-50/50">
                      <span className="text-blue-600/70 font-semibold">Alternate</span>
                      <span className="text-blue-900 font-bold">{selectedDonation.contactInfo.alternatePhone}</span>
                    </div>
                  )}
                  {selectedDonation.contactInfo.email && (
                    <div className="flex items-center justify-between text-sm py-2 border-b border-blue-50/50">
                      <span className="text-blue-600/70 font-semibold">Email</span>
                      <span className="text-blue-900 font-bold underline decoration-blue-200 active:text-blue-600 cursor-pointer">{selectedDonation.contactInfo.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-blue-600/70 font-semibold">Preference</span>
                    <span className="capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider">{selectedDonation.contactInfo.preferredContactMethod}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl p-5 border-2 border-purple-50 shadow-sm relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-50/50 rounded-full" />
                <h4 className="font-bold text-purple-900 text-sm mb-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  Logistics Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-purple-50/50">
                    <span className="text-purple-600/70 font-semibold">Method</span>
                    <span className="capitalize bg-purple-900 text-white px-3 py-1 rounded-full text-[10px] font-bold">{selectedDonation.deliveryMethod}</span>
                  </div>
                  {selectedDonation.preferredPickupTime && (
                    <div className="flex items-center justify-between text-sm py-2 border-b border-purple-50/50">
                      <span className="text-purple-600/70 font-semibold">Preferred Time</span>
                      <span className="text-purple-900 font-bold">{new Date(selectedDonation.preferredPickupTime).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedDonation.donorNotes && (
                    <div className="pt-2">
                      <span className="text-purple-600/70 text-xs font-semibold block mb-1">Donor Note:</span>
                      <div className="bg-purple-50/50 p-2 text-xs text-purple-800 italic rounded-xl border border-purple-100">
                        "{selectedDonation.donorNotes}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}