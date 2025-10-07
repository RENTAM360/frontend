"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin, Phone, CreditCard, Mail, Trash2, ChevronRight, Check } from "lucide-react"
import { PageHeader } from "@/context/page-header-context"
import Image from "next/image"
import { Report, useGetReportByIdQuery, useGetReportsQuery, useSuspendUserMutation } from "@/lib/redux/api/adminApi"
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi"

// Mock reports data
// const reportsData = [
//   {
//     id: 1,
//     reporterName: "Thankgod ogbonna",
//     reportedUserItem: "Samson Freedom",
//     reason: "Item not as described",
//     status: "Pending",
//     date: "27, Apr, 2025",
//     reportMessage:
//       "I paid for the rental, but the equipment was either not delivered as promised, was fake, or the renter disappeared after the payment was made.",
//     reportedUser: {
//       id: 1,
//       name: "Thankgod ogbonna",
//       username: "thankimedia",
//       email: "Thankimedia@gmail.com",
//       phone: "09124639133",
//       verified: true,
//       location: "Nigeria",
//       joinDate: "June 2024",
//       address: "7 Woji Port harcourt",
//       bankAccount: "Bank account, 7077900016, FCMB",
//       bankName: "Thankgod ogbonna",
//       bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
//       coverImage: "/report-coverImg.svg",
//       profileImage: "/report-profile.svg",
//     },
//   },
//   {
//     id: 2,
//     reporterName: "Thankgod ogbonna",
//     reportedUserItem: "Samson Freedom",
//     reason: "Item not as described",
//     status: "Pending",
//     date: "27, Apr, 2025",
//     reportMessage:
//       "I paid for the rental, but the equipment was either not delivered as promised, was fake, or the renter disappeared after the payment was made.",
//     reportedUser: {
//       id: 1,
//       name: "Thankgod ogbonna",
//       username: "thankimedia",
//       email: "Thankimedia@gmail.com",
//       phone: "09124639133",
//       verified: true,
//       location: "Nigeria",
//       joinDate: "June 2024",
//       address: "7 Woji Port harcourt",
//       bankAccount: "Bank account, 7077900016, FCMB",
//       bankName: "Thankgod ogbonna",
//       bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
//       coverImage: "/report-coverImg.svg",
//       profileImage: "/report-profile.svg",
//     },
//   },
//   // Add more reports with the same structure...
//   ...Array.from({ length: 8 }, (_, i) => ({
//     id: i + 3,
//     reporterName: "Thankgod ogbonna",
//     reportedUserItem: "Samson Freedom",
//     reason: "Item not as described",
//     status: i % 3 === 0 ? "Resolved" : "Pending",
//     date: "27, Apr, 2025",
//     reportMessage:
//       "I paid for the rental, but the equipment was either not delivered as promised, was fake, or the renter disappeared after the payment was made.",
//     reportedUser: {
//       id: 1,
//       name: "Thankgod ogbonna",
//       username: "thankimedia",
//       email: "Thankimedia@gmail.com",
//       phone: "09124639133",
//       verified: true,
//       location: "Nigeria",
//       joinDate: "June 2024",
//       address: "7 Woji Port harcourt",
//       bankAccount: "Bank account, 7077900016, FCMB",
//       bankName: "Thankgod ogbonna",
//       bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
//       coverImage: "/report-coverImg.svg",
//       profileImage: "/report-profile.svg",
//     },
//   })),
// ]

export default function ReportsPage() {
  // const [searchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [reporterId, setReporterId] = useState<string | null>(null);
  const [reportedId, setReportedId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { data: reportsData } = useGetReportsQuery({ page: 1, limit: 10 });
  const reports = reportsData?.data?.reports ?? [];

  const { data: reportDetails } = useGetReportByIdQuery(selectedReportId!, {
    skip: !selectedReportId,
  });

  console.log(reportDetails)

  const reportDetail = reportDetails?.data?.report ?? null;

  useEffect(() => {
    if (reportDetail) {
      setReporterId(reportDetail.reporter?._id ?? null);
      setReportedId(reportDetail.reported?._id ?? null);
    } else {
      setReporterId(null);
      setReportedId(null);
    }
  }, [reportDetail]);

  const { data: reporterProfile } = useGetOtherUserProfileQuery(reporterId!, {
    skip: !reporterId,
  });
  const { data: reportedProfile } = useGetOtherUserProfileQuery(reportedId!, {
    skip: !reportedId,
  });


  // const [resolveReport] = useResolveReportMutation()
  const [suspendUser] = useSuspendUserMutation()
  // const [deleteUser] = useDeleteUserMutation()

  console.log("Reporter:", reporterProfile);
  console.log("Reported:", reportedProfile);


  // Filter reports based on search and status
  const filteredReports = reports?.filter((report: Report) => {
    const matchesStatus =
      statusFilter === "all" || report.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesStatus
  })

  const handleViewDetails = (reportId: string) => {
    console.log(reportId)
    setSelectedReportId(reportId)
  }

  const handleCloseDetails = () => {
   setSelectedReportId(null)
  }

  // const handleResolve = async () => {
  //   if (!selectedReportId) return
  //   await resolveReport(selectedReportId).unwrap()
  //   setShowSuccessModal(true)
  // }

  const handleSuspend = async (userId: string) => {
    await suspendUser(userId).unwrap()
  }

  // const handleDelete = async (userId: string) => {
  //   await deleteUser(userId).unwrap()
  //   setSelectedReportId(null)
  // }

  const handleMessage = () => {
    console.log("Send message to user")
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setSelectedReportId(null)
  }

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
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="w-[300px] pl-9 rounded-lg border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
        </div>

        {/* Reports Table */}
        <div className="bg-[#FBFBFB] rounded-md border">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-[#97A2AC] text-xs">
            <div className="col-span-2">Reporter name</div>
            <div className="col-span-2">Reported User/Item</div>
            <div className="col-span-2">Reason</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Action</div>
          </div>

          {/* Table Rows */}
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportRow key={report._id} report={report} onViewDetails={() => handleViewDetails(report._id)} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No reports found matching your criteria</div>
          )}

          {/* Pagination */}
          {filteredReports.length > 0 && (
            <div className="flex justify-end items-center p-4 border-t">
              <div className="text-sm text-gray-500 mr-4">Page 1 of {Math.ceil(filteredReports.length / 10)}</div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" className="px-2">
                  &lt; Prev
                </Button>
                <Button variant="outline" size="sm" className="px-2 bg-gray-100">
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

      {/* Slide-in Report Details Panel */}
      {reportDetails && (
        <>
          {/* Overlay - only covers the left side */}
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40" style={{ right: "400px" }} />

          {/* Slide-in Panel */}
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-50 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Back Button */}
                <button onClick={handleCloseDetails} className="mb-4 hover:bg-gray-100 p-1 rounded">
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Cover Image and Profile */}
                <div className="relative mb-10">
                  <div className="h-38 rounded-t-2xl rounded-b-[35px] overflow-hidden">
                    <Image src="/report-coverImg.svg" alt="Cover" width={100} height={100} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                      <Image
                        src={reportedProfile?.data?.user?.avatar || "/placeholder.svg"}
                        alt={reportedProfile?.data?.user?.firstName || "User"}
                        className="w-full h-full object-cover"
                        width={100} height={100}
                      />
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6 mt-8">
                  <h3 className="text-xl font-bold">{reportedProfile?.data?.user?.firstName} {reportedProfile?.data?.user?.lastName}</h3>
                  {reportedProfile?.data?.user?.isVerify && (
                    <div className="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded mt-1">
                      Verified
                    </div>
                  )}
                  <p className="text-gray-600 mt-3 text-sm">{reportedProfile?.data?.user?.bio}</p>

                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{reportedProfile?.data?.user?.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        {reportedProfile?.data?.user?.createdAt
                          ? new Date(reportedProfile.data.user.createdAt).toLocaleDateString("en-US", {
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
                    <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                        const userId = reportedProfile?.data?.user?._id;
                        if (userId) handleSuspend(userId);
                      }}>
                      Suspend
                    </Button>
                    <Button className="bg-[#17b266] hover:bg-[#149655] text-white" onClick={handleMessage}>
                      Message
                    </Button>
                    {/* {reportDetails.status !== "Resolved" && (
                      <Button
                        variant="outline"
                        className="border-[#17b266] text-[#17b266] hover:bg-[#17b266] hover:text-white"
                        onClick={handleResolve}
                      >
                        Resolve
                      </Button>
                    )} */}
                  </div>
                </div>

                {/* Report Message - Only show if not resolved */}
                {/* {reportDetails.status !== "Resolved" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="text-red-600 font-medium mb-2">Report message</h4>
                    <p className="text-red-600 text-sm">{reportDetails?.data?.report?.reason}</p>
                  </div>
                )} */}

                {/* Resolved Status Message */}
                {/* {reportDetails.status === "Resolved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="text-green-600 font-medium mb-2">Status</h4>
                    <p className="text-green-600 text-sm">
                      This report has been resolved and appropriate actions have been completed.
                    </p>
                  </div>
                )} */}

                {/* Contact Information */}
                <div className="space-y-4 pb-6">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <MapPin className="w-5 h-5 text-[#17b266]" />
                    <span className="text-gray-700">{reportedProfile?.data?.user?.address}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Phone className="w-5 h-5 text-[#17b266]" />
                    {reportedProfile?.data?.user?.address && <span className="text-gray-700">{reportedProfile?.data?.user?.phone}</span>}
                  </div>
                  {
                    reportDetails?.data?.bank && (
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <CreditCard className="w-5 h-5 text-[#17b266]" />
                        <div>
                          <span className="text-gray-700">{ reportDetails?.data?.bank}</span>
                          <br />
                          <span className="text-gray-500 text-sm">{ reportDetails?.data?.bank}</span>
                        </div>
                      </div>
                    )
                  }
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Mail className="w-5 h-5 text-[#17b266]" />
                    <span className="text-gray-700">{reportedProfile?.data?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t hover:bg-gray-50 rounded cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-[#17b266]" />
                      <span className="text-gray-700">Delete account permanently</span>
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
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center relative">
                <Check className="w-10 h-10 text-white" />
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-400"></div>
              </div>
            </div>

            {/* Success Message */}
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              The reported case has been reviewed and appropriate actions have been completed.
            </p>

            {/* Done Button */}
            <Button
              className="w-full bg-[#17b266] hover:bg-[#149655] text-white py-3 text-lg rounded-full"
              onClick={handleSuccessModalClose}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

// Component for report rows
function ReportRow({ report, onViewDetails }: { report: Report; onViewDetails: () => void }) {
  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "pending":
  //       return "text-orange-600 bg-orange-100"
  //     case "resolved":
  //       return "text-green-600 bg-green-100"
  //     default:
  //       return "text-gray-600 bg-gray-100"
  //   }
  // }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-white my-1 border border-[#ECECEC] hover:bg-gray-50 text-xs">
      <div className="col-span-2 flex items-center">
        <span className="font-medium">{report?.reporter?.firstName} {report?.reporter?.firstName}</span>
      </div>
      <div className="col-span-2 flex items-center">
        <span>{report?.reported?.firstName} {report?.reported?.lastName}</span>
      </div>
      <div className="col-span-2 flex items-center">
        <span>{report?.reason}</span>
      </div>
      {/* <div className="col-span-2 flex items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.status)}`}>
          {report.status}
        </span>
      </div> */}
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
        <Button className="bg-[#17b266] hover:bg-[#149655] text-white text-xs px-3 py-1" onClick={onViewDetails}>
          View details
        </Button>
      </div>
    </div>
  )
}
