"use client";

import { useState } from "react";
import { 
  useGetAllTickets, 
  useReplyToTicket, 
  SupportTicket 
} from "@/src/hooks/useSupport";
import { 
  MessageSquare, AlertTriangle, CheckCircle, 
  Clock, Send, Search, User, Filter
} from "lucide-react";
import { format } from "date-fns";

export default function AdminSupportPage() {
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  const { data: tickets, isLoading } = useGetAllTickets({
    type: filterType || undefined,
    status: filterStatus || undefined,
    limit: 100
  });

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { mutate: replyToTicket, isPending: isReplying } = useReplyToTicket();

  const handleReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    
    replyToTicket(
      { id: selectedTicket._id, replyMessage },
      {
        onSuccess: () => {
          setSelectedTicket(null);
          setReplyMessage("");
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-setu-900">Support & Reports</h1>
          <p className="text-sm text-setu-500 mt-1">Manage user inquiries and platform safety reports.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-white border border-setu-200 rounded-lg p-1 w-full sm:w-auto">
          <button 
            onClick={() => setFilterType("")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!filterType ? "bg-setu-100 text-setu-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            All Types
          </button>
          <button 
            onClick={() => setFilterType("contact")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === "contact" ? "bg-setu-100 text-setu-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            Contact
          </button>
          <button 
            onClick={() => setFilterType("report")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filterType === "report" ? "bg-red-100 text-red-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            Reports
          </button>
        </div>

        <div className="flex bg-white border border-setu-200 rounded-lg p-1 w-full sm:w-auto">
          <button 
            onClick={() => setFilterStatus("")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!filterStatus ? "bg-setu-100 text-setu-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            All Status
          </button>
          <button 
            onClick={() => setFilterStatus("open")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterStatus === "open" ? "bg-amber-100 text-amber-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            <Clock className="w-3.5 h-3.5" /> Open
          </button>
          <button 
            onClick={() => setFilterStatus("resolved")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${filterStatus === "resolved" ? "bg-setu-100 text-setu-800" : "text-setu-500 hover:text-setu-700"}`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Resolved
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
        {/* Ticket List */}
        <div className="bg-white rounded-xl border border-setu-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-setu-500">Loading tickets...</div>
          ) : !tickets?.length ? (
            <div className="p-8 text-center text-setu-500">No tickets found matching your criteria.</div>
          ) : (
            <div className="divide-y divide-setu-100">
              {tickets.map((ticket: SupportTicket) => (
                <div 
                  key={ticket._id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer hover:bg-setu-50 transition-colors ${selectedTicket?._id === ticket._id ? "bg-setu-50 border-l-4 border-setu-500" : "border-l-4 border-transparent"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {ticket.type === "report" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3" /> Report
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                          <MessageSquare className="w-3 h-3" /> Contact
                        </span>
                      )}
                      
                      {ticket.status === "resolved" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-setu-100 text-setu-700">
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                          Open
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-setu-400 font-medium">
                      {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-setu-900 mb-1 truncate">{ticket.subject}</h3>
                  <p className="text-xs text-setu-600 line-clamp-1 mb-2">{ticket.message}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-setu-500">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-medium">{ticket.name}</span>
                    <span className="text-setu-300">•</span>
                    <span>{ticket.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Details Panel */}
        {selectedTicket ? (
          <div className="bg-white rounded-xl border border-setu-200 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-6">
            <div className="p-5 border-b border-setu-100">
              <div className="flex items-center justify-between mb-3">
                {selectedTicket.type === "report" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
                    <AlertTriangle className="w-4 h-4" /> Issue Report
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                    <MessageSquare className="w-4 h-4" /> Contact Request
                  </span>
                )}
                <span className="text-xs font-medium text-setu-500">
                  {format(new Date(selectedTicket.createdAt), "PPp")}
                </span>
              </div>
              <h2 className="text-lg font-bold text-setu-900 mb-3 leading-snug">{selectedTicket.subject}</h2>
              
              <div className="bg-setu-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-setu-500 font-medium">From:</span>
                  <span className="text-setu-900 font-semibold">{selectedTicket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-setu-500 font-medium">Email:</span>
                  <a href={`mailto:${selectedTicket.email}`} className="text-setu-600 font-semibold hover:underline">{selectedTicket.email}</a>
                </div>
                {selectedTicket.campaignUrl && (
                  <div className="flex justify-between">
                    <span className="text-setu-500 font-medium">Reference:</span>
                    <a href={selectedTicket.campaignUrl.startsWith('http') ? selectedTicket.campaignUrl : `https://${selectedTicket.campaignUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline truncate max-w-[200px]">
                      {selectedTicket.campaignUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-setu-400 mb-2">Original Message</h4>
                <div className="bg-white border border-setu-100 rounded-xl p-4 text-sm text-setu-800 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {selectedTicket.message}
                </div>
              </div>

              {selectedTicket.status === "resolved" && selectedTicket.replyMessage && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-setu-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> 
                    Admin Reply & Resolution
                  </h4>
                  <div className="bg-setu-50 border border-setu-200 rounded-xl p-4 text-sm text-setu-800 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.replyMessage}
                  </div>
                  <p className="text-xs text-setu-500 mt-2 text-right">
                    Resolved by {selectedTicket.resolvedBy?.name || "Admin"} on {selectedTicket.resolvedAt ? format(new Date(selectedTicket.resolvedAt), "PP") : "Unknown"}
                  </p>
                </div>
              )}
            </div>

            {selectedTicket.status === "open" && (
              <div className="p-5 border-t border-setu-100 bg-gray-50">
                <label className="block text-xs font-bold uppercase tracking-wider text-setu-700 mb-2">
                  Write Reply & Resolve
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your response here... An email will automatically be sent to the user, and the ticket will be marked as resolved."
                  className="w-full px-3 py-2 border border-setu-200 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-setu-500/20 focus:border-setu-500 resize-none bg-white"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyMessage.trim() || isReplying}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-setu-700 hover:bg-setu-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {isReplying ? "Sending..." : "Send Reply & Resolve Ticket"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-setu-200 shadow-sm h-[400px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-setu-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-setu-300" />
            </div>
            <h3 className="text-lg font-bold text-setu-900 mb-1">Select a Ticket</h3>
            <p className="text-sm text-setu-500 max-w-xs">Click on any ticket from the list to view its details and write a reply.</p>
          </div>
        )}
      </div>
    </div>
  );
}
