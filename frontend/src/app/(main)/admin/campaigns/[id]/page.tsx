"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
	useGetComments,
	useDeleteComment,
	useTogglePinComment,
	type Comment,
} from "@/src/hooks/useComment";
import { useGetCampaignById } from "@/src/hooks/useCampaign";
import {
	ArrowLeft, MapPin, Calendar, Users, AlertCircle, FileText,
	Image as ImageIcon, CheckCircle, XCircle, MessageSquare,
	Trash2, Pin, PinOff, Eye, EyeOff, ChevronLeft, ChevronRight,
	Download, ExternalLink, Phone, Wallet,
} from "lucide-react";
import Badge from "@/src/components/dashboard/Badge";
import Modal from "@/src/components/dashboard/Modal";


const getStatusBadge = (status: string) => {
	switch (status) {
		case "active":
			return "info";
		case "completed":
			return "success";
		case "rejected":
			return "error";
		case "pending":
			return "pending";
		case "suspended":
			return "warning";
		default:
			return "info";
	}
};

const formatStatus = (status: string) =>
	status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

function CommentCard({
	comment,
	campaignId,
	hidden,
	onToggleHide,
}: {
	comment: Comment;
	campaignId: string;
	hidden: boolean;
	onToggleHide: (id: string) => void;
}) {
	const deleteComment = useDeleteComment(campaignId);
	const togglePin = useTogglePinComment(campaignId);

	return (
		<div className={`rounded-xl border p-4 transition-all ${hidden ? "opacity-50 bg-setu-50 border-dashed border-setu-200" : "bg-white border-setu-100"} ${comment.pinned ? "border-l-4 border-l-setu-500" : ""}`}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 min-w-0">
					{comment.author?.avatar?.url ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={comment.author.avatar.url} alt={comment.author.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
					) : (
						<div className="w-9 h-9 rounded-full bg-setu-200 flex items-center justify-center shrink-0 text-setu-600 font-bold text-sm">
							{comment.author?.name?.[0]?.toUpperCase() ?? "?"}
						</div>
					)}
					<div className="min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<span className="font-semibold text-setu-900 text-sm">{comment.author?.name ?? "Unknown"}</span>
							{comment.pinned && <span className="text-xs bg-setu-100 text-setu-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin size={10} /> Pinned</span>}
							{hidden && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={10} /> Hidden</span>}
						</div>
						<p className="text-xs text-setu-400 mt-0.5">{new Date(comment.createdAt).toLocaleString()}</p>
						{comment.text && <p className="text-sm text-setu-700 mt-2 whitespace-pre-wrap">{comment.text}</p>}
						{comment.media?.length > 0 && (
							<div className="flex gap-2 mt-2 flex-wrap">
								{comment.media.map((m, i) =>
									m.type === "image" ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img key={i} src={m.url} alt="media" className="w-20 h-20 object-cover rounded-lg border border-setu-100" />
									) : (
										<video key={i} src={m.url} className="w-20 h-20 object-cover rounded-lg border border-setu-100" />
									)
								)}
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<button
						onClick={() => togglePin.mutate(comment._id)}
						disabled={togglePin.isPending}
						title={comment.pinned ? "Unpin" : "Pin"}
						className="p-1.5 rounded-lg text-setu-400 hover:text-setu-700 hover:bg-setu-100 transition-colors disabled:opacity-50"
					>
						{comment.pinned ? <PinOff size={15} /> : <Pin size={15} />}
					</button>
					<button
						onClick={() => onToggleHide(comment._id)}
						title={hidden ? "Show" : "Hide"}
						className="p-1.5 rounded-lg text-setu-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
					>
						{hidden ? <Eye size={15} /> : <EyeOff size={15} />}
					</button>
					<button
						onClick={() => deleteComment.mutate(comment._id)}
						disabled={deleteComment.isPending}
						title="Delete"
						className="p-1.5 rounded-lg text-setu-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
					>
						<Trash2 size={15} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default function CampaignDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const [commentPage, setCommentPage] = useState(1);
	const [hiddenComments, setHiddenComments] = useState<Set<string>>(new Set());
	const [docPreview, setDocPreview] = useState<{ url: string; name: string; type: string } | null>(null);

	const { data, isLoading, isError, error } = useGetCampaignById(id);
	const { data: commentsData, isLoading: commentsLoading } = useGetComments(id, { page: commentPage, limit: 10 });

	const toggleHide = (commentId: string) => {
		setHiddenComments((prev) => {
			const next = new Set(prev);
			next.has(commentId) ? next.delete(commentId) : next.add(commentId);
			return next;
		});
	};

	const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
    // Fallback: open in new tab if fetch fails
    window.open(url, "_blank");
  }
};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<div className="w-10 h-10 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
				<p className="text-setu-600 font-medium">Loading campaign details...</p>
			</div>
		);
	}

	if (isError || !data?.data) {
		return (
			<div className="space-y-6">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-setu-600 hover:text-setu-800 transition-colors"
				>
					<ArrowLeft size={20} />
					<span>Back</span>
				</button>
				<div className="bg-red-50 border border-red-200 p-6 rounded-xl">
					<p className="text-red-600 font-semibold text-lg">Error Loading Campaign</p>
					<p className="text-red-500 mt-2">{error?.message || "Failed to load campaign details."}</p>
				</div>
			</div>
		);
	}

	const campaign = data.data;

	const percentFunded = campaign.goalAmount
		? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
		: 0;

	return (
		<div className="space-y-8 animate-fade-in-up pb-12">
			{/* Header area */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-4">
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-setu-500 hover:text-setu-800 transition-colors"
					>
						<ArrowLeft size={18} />
						<span className="font-medium">Back to Campaigns</span>
					</button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-display font-bold text-setu-900">
								{campaign.title}
							</h1>
							{campaign.urgent && (
								<Badge variant="error" size="sm">Urgent</Badge>
							)}
						</div>
						<p className="text-setu-500 mt-2 flex items-center gap-4">
							<span className="flex items-center gap-1.5 bg-setu-50 px-3 py-1 rounded-full text-sm">
								<Badge variant={getStatusBadge(campaign.status)} size="sm">
									{formatStatus(campaign.status)}
								</Badge>
							</span>
							<span className="flex items-center gap-1.5 text-sm">
								Category: <span className="font-medium text-setu-700">{campaign.category?.name || "N/A"}</span>
							</span>
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column (Main Details) */}
				<div className="lg:col-span-2 space-y-8">
					{/* Status Reasons (if rejected or suspended) */}
					{campaign.status === "rejected" && campaign.rejectionReason && (
						<div className="bg-red-50 border border-red-200 p-5 rounded-xl flex items-start gap-3">
							<XCircle className="text-red-500 shrink-0 mt-0.5" />
							<div>
								<p className="font-semibold text-red-800">Rejection Reason</p>
								<p className="text-red-700 mt-1">{campaign.rejectionReason}</p>
							</div>
						</div>
					)}
					
					{campaign.status === "suspended" && campaign.suspendedReason && (
						<div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl flex items-start gap-3">
							<AlertCircle className="text-yellow-600 shrink-0 mt-0.5" />
							<div>
								<p className="font-semibold text-yellow-800">Suspension Reason</p>
								<p className="text-yellow-700 mt-1">{campaign.suspendedReason}</p>
							</div>
						</div>
					)}

					<div className="bg-white rounded-2xl border border-setu-100 p-6 sm:p-8 shadow-sm">
						<h2 className="text-xl font-bold text-setu-900 mb-4">Description</h2>
						<p className="text-setu-700 whitespace-pre-wrap leading-relaxed">
							{campaign.description}
						</p>
					</div>

					{/* Documents & Media */}
					<div className="bg-white rounded-2xl border border-setu-100 p-6 sm:p-8 shadow-sm">
						<h2 className="text-xl font-bold text-setu-900 mb-6 border-b border-setu-100 pb-4">Media & Verification Documents</h2>
						
						<div className="space-y-8">
							{/* Cover Image */}
							{campaign.images?.url && (
								<div>
									<h3 className="text-sm font-semibold text-setu-500 uppercase tracking-wider mb-3 flex items-center gap-2">
										<ImageIcon size={16} /> Cover Image
									</h3>
									<div className="relative aspect-video rounded-xl overflow-hidden bg-setu-50 border border-setu-100">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={campaign.images.url}
											alt="Campaign Cover"
											className="w-full h-full object-cover"
										/>
									</div>
								</div>
							)}

							{/* Documents */}
<div>
  <h3 className="text-sm font-semibold text-setu-500 uppercase tracking-wider mb-3 flex items-center gap-2">
    <FileText size={16} /> Verification Documents
  </h3>
  {campaign.documents && campaign.documents.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {campaign.documents.map((doc) => (
        <div
          key={doc._id}
          className="flex items-center gap-3 p-4 rounded-xl border border-setu-200 hover:border-setu-400 hover:bg-setu-50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-setu-100 text-setu-600 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="font-medium text-setu-900 truncate">{doc.name || "Document"}</p>
            <p className="text-xs text-setu-500 capitalize">{(doc.type || "other").replace("_", " ")}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setDocPreview({ url: doc.url, name: doc.name || "Document", type: doc.type || "other" })}
              title="Preview"
              className="p-1.5 rounded-lg text-setu-400 hover:text-setu-700 hover:bg-setu-100 transition-colors"
            >
              <Eye size={16} />
            </button>
      <button
  onClick={() => downloadFile(doc.url, doc.name || "document")}
  title="Download"
  className="p-1.5 rounded-lg text-setu-400 hover:text-setu-700 hover:bg-setu-100 transition-colors"
>
  <Download size={16} />
</button>

          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-setu-500 italic bg-setu-50 p-4 rounded-xl text-sm border border-dashed border-setu-200">
      No verification documents provided.
    </p>
  )}
</div>
						</div>
					</div>
				</div>

				{/* Right Column (Meta Information) */}
				<div className="space-y-6">
					{/* Funding Card */}
					<div className="bg-white rounded-2xl border border-setu-100 p-6 shadow-sm">
						<h3 className="font-bold text-setu-900 mb-4">Funding Progress</h3>
						
						<div className="mb-2">
							<span className="text-3xl font-display font-bold text-green-600">
								Rs. {campaign.raisedAmount.toLocaleString()}
							</span>
							<span className="text-sm text-setu-500 ml-2">
								raised of Rs. {campaign.goalAmount.toLocaleString()}
							</span>
						</div>

						<div className="bg-setu-100 rounded-full h-3 mb-2 overflow-hidden">
							<div
								className="bg-green-500 h-full rounded-full transition-all duration-500"
								style={{ width: `${percentFunded}%` }}
							/>
						</div>
						
						<div className="flex justify-between text-sm text-setu-500 font-medium">
							<span>{Math.round(percentFunded)}% Funded</span>
							<span className="flex items-center gap-1">
								<Users size={14} /> {campaign.donorsCount} Donors
							</span>
						</div>
					</div>

					{/* Information Card */}
					<div className="bg-white rounded-2xl border border-setu-100 p-6 shadow-sm">
						<h3 className="font-bold text-setu-900 mb-5">Campaign Details</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<MapPin className="text-setu-400 shrink-0 mt-0.5" size={18} />
								<div>
									<p className="text-sm font-medium text-setu-900">Location</p>
									<p className="text-sm text-setu-600">
										{campaign.location?.name || "Unknown"}
										{campaign.location?.city && `, ${campaign.location.city}`}
									</p>
								</div>
							</div>
							
							<div className="flex items-start gap-3">
								<Calendar className="text-setu-400 shrink-0 mt-0.5" size={18} />
								<div>
									<p className="text-sm font-medium text-setu-900">Duration</p>
									<p className="text-sm text-setu-600">
										{new Date(campaign.startDate).toLocaleDateString()}
										{campaign.endDate ? ` — ${new Date(campaign.endDate).toLocaleDateString()}` : " (Ongoing)"}
									</p>
								</div>
							</div>
							
							<div className="border-t border-setu-100 pt-4 mt-4">
								<p className="text-sm text-setu-500 mb-1">Created By</p>
								<p className="font-medium text-setu-900">
									{campaign.createdBy?.name || "Unknown User"}
								</p>
								{campaign.createdBy?.email && (
									<p className="text-xs text-setu-500">{campaign.createdBy.email}</p>
								)}
								<p className="text-xs text-setu-400 mt-1">
									Created: {new Date(campaign.createdAt).toLocaleDateString()}
								</p>
							</div>

							{campaign.approvedBy && (
								<div className="border-t border-setu-100 pt-4">
									<p className="text-sm text-setu-500 mb-1 flex items-center gap-1">
										<CheckCircle size={14} className="text-green-500" />
										Approved By
									</p>
									<p className="font-medium text-setu-900">
										{campaign.approvedBy.name || "Admin"}
									</p>
									{campaign.approvedAt && (
										<p className="text-xs text-setu-400 mt-1">
											On: {new Date(campaign.approvedAt).toLocaleDateString()}
										</p>
									)}
								</div>
							)}

							{/* Payout Details — admin only */}
							{(campaign.phoneNumber || campaign.esewaId) && (
								<div className="border-t border-amber-100 pt-4 mt-2 bg-amber-50 rounded-xl p-4 -mx-1">
									<p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
										🔒 Payout Details
									</p>
									{campaign.phoneNumber && (
										<div className="flex items-start gap-3 mb-2">
											<Phone size={16} className="text-amber-600 shrink-0 mt-0.5" />
											<div>
												<p className="text-xs font-medium text-setu-500">Phone Number</p>
												<p className="text-sm font-semibold text-setu-900">{campaign.phoneNumber}</p>
											</div>
										</div>
									)}
									{campaign.esewaId && (
										<div className="flex items-start gap-3">
											<Wallet size={16} className="text-amber-600 shrink-0 mt-0.5" />
											<div>
												<p className="text-xs font-medium text-setu-500">eSewa ID</p>
												<p className="text-sm font-semibold text-setu-900">{campaign.esewaId}</p>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Reactions Card */}
					{campaign.reactions && (
						<div className="bg-white rounded-2xl border border-setu-100 p-6 shadow-sm">
							<h3 className="font-bold text-setu-900 mb-4">Reactions</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-setu-50 rounded-xl p-3 text-center border border-setu-100">
									<p className="text-2xl mb-1">❤️</p>
									<p className="text-xl font-bold text-setu-900">{campaign.reactions.love || 0}</p>
									<p className="text-xs font-medium text-setu-500 uppercase tracking-wide">Love</p>
								</div>
								<div className="bg-setu-50 rounded-xl p-3 text-center border border-setu-100">
									<p className="text-2xl mb-1">🙏</p>
									<p className="text-xl font-bold text-setu-900">{campaign.reactions.support || 0}</p>
									<p className="text-xs font-medium text-setu-500 uppercase tracking-wide">Support</p>
								</div>
								<div className="bg-setu-50 rounded-xl p-3 text-center border border-setu-100">
									<p className="text-2xl mb-1">😢</p>
									<p className="text-xl font-bold text-setu-900">{campaign.reactions.sad || 0}</p>
									<p className="text-xs font-medium text-setu-500 uppercase tracking-wide">Sad</p>
								</div>
								<div className="bg-setu-50 rounded-xl p-3 text-center border border-setu-100">
									<p className="text-2xl mb-1">🤝</p>
									<p className="text-xl font-bold text-setu-900">{campaign.reactions.grateful || 0}</p>
									<p className="text-xs font-medium text-setu-500 uppercase tracking-wide">Grateful</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Comments Section */}
			<div className="bg-white rounded-2xl border border-setu-100 p-6 sm:p-8 shadow-sm">
				<div className="flex items-center gap-2 mb-6 border-b border-setu-100 pb-4">
					<MessageSquare size={20} className="text-setu-500" />
					<h2 className="text-xl font-bold text-setu-900">Comments</h2>
					{commentsData?.pagination?.total !== undefined && (
						<span className="ml-auto text-sm text-setu-500">{commentsData.pagination.total} total</span>
					)}
				</div>

				{commentsLoading ? (
					<div className="flex justify-center py-8">
						<div className="w-8 h-8 border-4 border-setu-200 border-t-setu-600 rounded-full animate-spin" />
					</div>
				) : commentsData?.comments?.length === 0 ? (
					<p className="text-setu-500 italic text-sm text-center py-8 bg-setu-50 rounded-xl border border-dashed border-setu-200">
						No comments yet.
					</p>
				) : (
					<>
						<div className="space-y-3">
							{commentsData?.comments?.map((comment) => (
								<CommentCard
									key={comment._id}
									comment={comment}
									campaignId={id}
									hidden={hiddenComments.has(comment._id)}
									onToggleHide={toggleHide}
								/>
							))}
						</div>

						{commentsData?.pagination && commentsData.pagination.totalPages > 1 && (
							<div className="flex items-center justify-between mt-6 pt-4 border-t border-setu-100">
								<button
									onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
									disabled={commentPage === 1}
									className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-setu-600 hover:bg-setu-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft size={16} /> Previous
								</button>
								<span className="text-sm text-setu-500">
									Page {commentPage} of {commentsData.pagination.totalPages}
								</span>
								<button
									onClick={() => setCommentPage((p) => Math.min(commentsData.pagination.totalPages, p + 1))}
									disabled={commentPage === commentsData.pagination.totalPages}
									className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-setu-600 hover:bg-setu-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
								>
									Next <ChevronRight size={16} />
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Document Preview Modal */}
<Modal
  isOpen={!!docPreview}
  onClose={() => setDocPreview(null)}
  title={docPreview?.name ?? "Document Preview"}
  size="xl"
  footer={
    <div className="flex gap-3">
    <button
  onClick={() => downloadFile(docPreview!.url, docPreview!.name)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-setu-600 text-white hover:bg-setu-700 font-medium transition-colors text-sm"
>
  <Download size={15} /> Download
</button>

<a
        href={docPreview?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors text-sm"
      >
        <ExternalLink size={15} /> Open in new tab
      </a>
      <button
        onClick={() => setDocPreview(null)}
        className="px-4 py-2 rounded-lg border border-setu-200 text-setu-700 hover:bg-setu-50 font-medium transition-colors text-sm ml-auto"
      >
        Close
      </button>
    </div>
  }
>
  {docPreview && (
    <div className="w-full rounded-xl overflow-hidden border border-setu-100 bg-setu-50">
      {/* Image preview */}
      {/\.(png|jpe?g|gif|webp|svg)$/i.test(docPreview.url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={docPreview.url}
          alt={docPreview.name}
          className="w-full max-h-[65vh] object-contain"
        />
      ) : /\.pdf$/i.test(docPreview.url) ? (
        /* PDF preview */
        <iframe
          src={docPreview.url}
          title={docPreview.name}
          className="w-full h-[65vh]"
          style={{ border: "none" }}
        />
      ) : (
        /* Fallback for unsupported formats */
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-setu-500">
          <FileText size={48} className="text-setu-300" />
          <div className="text-center">
            <p className="font-medium text-setu-700">Preview not available</p>
            <p className="text-sm text-setu-400 mt-1">
              This file type cannot be previewed in the browser.
            </p>
          </div>
          <a
            href={docPreview.url}
            download={docPreview.name}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-setu-600 text-white hover:bg-setu-700 font-medium transition-colors text-sm mt-2"
          >
            <Download size={15} /> Download to view
          </a>
        </div>
      )}
    </div>
  )}
</Modal>
		</div>
	);
}
