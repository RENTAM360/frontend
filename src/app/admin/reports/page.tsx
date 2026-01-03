"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  Mail,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/context/page-header-context";
import Image from "next/image";
import {
  Report,
  useDeleteUserMutation,
  useGetReportByIdQuery,
  useGetReportsQuery,
  useResolveReportMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from "@/lib/redux/api/adminApi";
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi";
import { enqueueSnackbar } from "notistack";
import Lottie from "lottie-react";
import successAnimation from "@/assets/animations/Success.json";
import { useMessagingContext } from "@/context/messaging-context";
import { socketService } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { Conversation } from "@/types/messaging";

export default function ReportsPage() {
  // const [searchQuery] = useState("")
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  // const [setReporterId] = useState<string | null>(null);
  const [reportedId, setReportedId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { joinConversation } = useMessagingContext();

  const { data: reportsData, refetch: refetchReports } = useGetReportsQuery({
    page: 1,
    limit: 10,
  });
  const reports = reportsData?.data?.reports ?? [];

  const { data: reportDetails } = useGetReportByIdQuery(selectedReportId!, {
    skip: !selectedReportId,
  });

  const reportDetail = reportDetails?.data?.report ?? null;
  // console.log(reportDetails)

  useEffect(() => {
    if (reportDetail) {
      // setReporterId(reportDetail.reporter?._id ?? null);
      setReportedId(reportDetail.reported?._id ?? null);
    } else {
      // setReporterId(null);
      setReportedId(null);
    }
  }, [reportDetail]);

  const { data: reportedProfile, refetch } = useGetOtherUserProfileQuery(
    reportedId!,
    {
      skip: !reportedId,
    }
  );

  const user = reportedProfile?.data?.user;

  const [resolveReport] = useResolveReportMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [unSuspendUser, { isLoading: isUnsuspending }] =
    useUnsuspendUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // console.log("Reporter:", reporterProfile);
  // console.log("Reported:", reportedProfile);

  // Filter reports based on search and status
  const filteredReports = reports?.filter((report: Report) => {
    const matchesStatus =
      statusFilter === "all" ||
      report.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  const handleViewDetails = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleCloseDetails = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedReportId(null);
      setIsClosing(false);
    }, 300);
  };

  const handleResolve = async () => {
    if (!selectedReportId) return;
    await resolveReport(selectedReportId).unwrap();
    setShowSuccessModal(true);
    refetchReports();
  };

  const handleSuspend = async (userId: string) => {
    try {
      await suspendUser(userId).unwrap();
      enqueueSnackbar("User suspended successfully", { variant: "success" });
      refetch();
    } catch {
      enqueueSnackbar("Failed to suspend user", { variant: "error" });
    }
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      await unSuspendUser(userId).unwrap();
      enqueueSnackbar("User unsuspended successfully", { variant: "success" });
      refetch();
    } catch {
      enqueueSnackbar("Failed to unsuspend user", { variant: "error" });
    }
  };

  // const isSuspended = status === "suspended";
  // const isLoading = isSuspending || isUnsuspending;

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId).unwrap();
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      setSelectedReportId(null);
      refetch();
    } catch (error) {
      enqueueSnackbar("Failed to delete user", { variant: "error" });
    }
  };

  const handleMessage = () => {
    if (!user?._id || !user?.firstName) {
      console.error("Missing user data");
      return;
    }

    const receiverId = user._id;

    // Optional: store user data locally (similar to user-side)
    const existing = JSON.parse(
      localStorage.getItem("conversationUsers") || "{}"
    );
    existing[receiverId] = user;
    localStorage.setItem("conversationUsers", JSON.stringify(existing));

    // Join socket room
    socketService.joinChat(receiverId);

    // Construct conversation object
    const conv: Conversation = {
      receiverId,
      equipmentId: "",
      equipment: { name: "", media: [] },
      participant: {
        userId: receiverId,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar || "/user.svg",
      },
      conversationId: "",
      lastMessageRead: false,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };

    joinConversation(receiverId, "", conv);

    console.log("Admin started conversation:", conv);

    // Redirect to admin message thread
    router.push(`/admin/messages?conversation=${conv.receiverId}`);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSelectedReportId(null);
  };

  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-[#FBFBFB] rounded-md border">
          <div className="block overflow-x-auto w-full">
            <div className="min-w-[700px] w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-[#97A2AC] text-xs">
                <div className="col-span-2">Reporter&apos;s name</div>
                <div className="col-span-2">Reported User</div>
                <div className="col-span-2">Reason</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Action</div>
              </div>

              {/* Table Rows */}
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportRow
                    key={report._id}
                    report={report}
                    onViewDetails={() => handleViewDetails(report._id)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No reports found matching your criteria
                </div>
              )}

              {/* Pagination */}
              {filteredReports.length > 0 && (
                <div className="flex justify-end items-center p-4 border-t">
                  <div className="text-sm text-gray-500 mr-4">
                    Page 1 of {Math.ceil(filteredReports.length / 10)}
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="px-2">
                      &lt; Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 bg-gray-100"
                    >
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="px-2">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="px-2">
                      Next &gt;
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Report Details Panel */}
      {selectedReportId && (
        <>
          {/* Overlay - only covers the left side */}
          <div
            onClick={handleCloseDetails}
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            style={{ right: "400px" }}
          />

          {/* Slide-in Panel */}
          <div
            className={`fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col
              ${isClosing ? "translate-x-full" : "translate-x-0"}`}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Back Button */}
                <button
                  onClick={handleCloseDetails}
                  className="mb-4 hover:bg-gray-100 p-1 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Cover Image and Profile */}
                <div className="relative mb-10">
                  <div className="h-38 rounded-t-2xl rounded-b-[35px] overflow-hidden">
                    <Image
                      src="/cover1.jpg"
                      alt="Cover"
                      fill
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                      <Image
                        src={reportedProfile?.data?.user?.avatar || "/user.svg"}
                        alt={reportedProfile?.data?.user?.firstName || "User"}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6 mt-8">
                  <h3 className="text-xl font-bold">
                    {reportedProfile?.data?.user?.firstName}{" "}
                    {reportedProfile?.data?.user?.lastName}
                  </h3>
                  {reportedProfile?.data?.user?.isVerify && (
                    <div className="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded mt-1">
                      Verified
                    </div>
                  )}
                  <p className="text-gray-600 mt-3 text-sm">
                    {reportedProfile?.data?.user?.bio}
                  </p>

                  <div className="flex items-center flex-col justify-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{reportedProfile?.data?.user?.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        {reportedProfile?.data?.user?.createdAt
                          ? new Date(
                              reportedProfile.data.user.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    {reportedProfile?.data?.user && (
                      <Button
                        disabled={isSuspending || isUnsuspending}
                        className={`${
                          reportedProfile.data.user.status === "suspended"
                            ? "bg-yellow-400 hover:bg-none"
                            : "bg-[#F04438] hover:bg-red-600"
                        } text-white`}
                        onClick={() => {
                          const userId = reportedProfile.data.user._id;
                          if (!userId) return;

                          if (
                            reportedProfile.data.user.status === "suspended"
                          ) {
                            handleUnsuspend(userId);
                          } else {
                            handleSuspend(userId);
                          }
                        }}
                      >
                        {isSuspending || isUnsuspending
                          ? "Processing..."
                          : reportedProfile.data.user.status === "suspended"
                          ? "Unsuspend"
                          : "Suspend"}
                      </Button>
                    )}

                    <Button
                      className="bg-[#12B76A] hover:bg-[#149655] text-white"
                      onClick={handleMessage}
                    >
                      Message
                    </Button>
                    {reportDetails?.data?.report?.status !== "resolved" && (
                      <Button
                        variant="outline"
                        className="border-[#17b266] bg-[#E8F8F1] text-[#12B76A] hover:bg-[#17b266] hover:text-white"
                        onClick={handleResolve}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>

                {/* Report Message - Only show if not resolved */}
                {reportDetails?.data?.report?.status !== "resolved" && (
                  <div className="bg-[#FFF7F6] border border-[#FFB1AB] rounded-lg p-4 mb-6">
                    <h4 className="text-[#F04438] font-medium mb-2">
                      Report message
                    </h4>
                    <p className="text-[#F04438] text-sm">
                      {reportDetails?.data?.report?.reason}
                    </p>
                  </div>
                )}

                {/* Resolved Status Message */}
                {reportDetails?.data?.report?.status === "resolved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="text-[#12B76A] font-medium mb-2">Status</h4>
                    <p className="text-[#12B76A] text-sm">
                      This report has been resolved and appropriate actions have
                      been completed.
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4 pb-6">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <MapPin className="w-5 h-5 text-[#17b266]" />
                    <span className="text-[#000000]">
                      {reportedProfile?.data?.user?.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Phone className="w-5 h-5 text-[#17b266]" />
                    {reportedProfile?.data?.user?.address && (
                      <span className="text-[#000000]">
                        {reportedProfile?.data?.user?.phone}
                      </span>
                    )}
                  </div>
                  {reportDetails?.data?.bank &&
                    reportDetails.data.bank.length > 0 && (
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <CreditCard className="w-5 h-5 text-[#17b266]" />
                        <div>
                          <span className="text-[#000000]">
                            {reportDetails?.data?.bank}
                          </span>
                          <br />
                          <span className="text-gray-500 text-sm">
                            {reportDetails?.data?.bank}
                          </span>
                        </div>
                      </div>
                    )}
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Mail className="w-5 h-5 text-[#17b266]" />
                    <span className="text-[#000000]">
                      {reportedProfile?.data?.user?.email}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between py-4 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      const userId = reportedProfile?.data?.user?._id;
                      if (!userId) return;

                      if (
                        window.confirm(
                          "Are you sure you want to permanently delete this account? This action cannot be undone."
                        )
                      ) {
                        handleDelete(userId);
                      }
                    }}
                  >
                    <div className="flex ml-2 items-center gap-3">
                      <Trash2 className="w-5 h-5 text-[#17b266]" />
                      <span className="text-[#000000]">
                        Delete account permanently
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
                <Lottie
                  animationData={successAnimation}
                  loop={false}
                  autoplay={true}
                />
              </div>
            </div>

            {/* Success Message */}
            <p className="text-[#000000] text-base mb-8 leading-relaxed">
              The reported case has been reviewed and appropriate actions have
              been completed.
            </p>

            {/* Done Button */}
            <Button
              className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-4 text-base rounded-full"
              onClick={handleSuccessModalClose}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// Component for report rows
function ReportRow({
  report,
  onViewDetails,
}: {
  report: Report;
  onViewDetails: () => void;
}) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white my-1 border border-[#ECECEC] hover:bg-gray-50 text-xs">
      <div className="col-span-2 flex items-center">
        <span className="font-medium">
          {report?.reporter?.firstName} {report?.reporter?.firstName}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span>
          {report?.reported?.firstName} {report?.reported?.lastName}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span>{report?.reason}</span>
      </div>
      <div className="col-span-2 flex items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            report?.status
          )}`}
        >
          {report.status}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span>
          {new Date(report.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <Button
          className="bg-[#17b266] hover:bg-[#149655] text-white text-xs px-3 py-1"
          onClick={onViewDetails}
        >
          View details
        </Button>
      </div>
    </div>
  );
}
