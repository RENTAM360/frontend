"use client";

import {
  useState,
  useMemo,
  ReactNode,
  MouseEventHandler,
  useEffect,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { PageHeader } from "@/context/page-header-context";
import { useRouter } from "next/navigation";
import {
  useGetAdminActiveStatusQuery,
  useGetAdminSuspendedUsersQuery,
  useGetAdminTotalUsersQuery,
  useGetAdminUsersQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from "@/lib/redux/api/adminApi";
import { AnimatedLogo } from "@/components/loading-logo";
import { enqueueSnackbar } from "notistack";

// Mock user data
// const mockUsers = [
//   {
//     id: 1,
//     name: "ThankGod Ogbonna",
//     username: "thankimedia",
//     email: "Thankimedia@gmail.com",
//     phone: "08107355412",
//     date: "01-Oct-2014",
//     status: "active",
//   },
//   {
//     id: 2,
//     name: "John Smith",
//     username: "johnsmith",
//     email: "john.smith@example.com",
//     phone: "08107355413",
//     date: "15-Nov-2015",
//     status: "active",
//   },
//   {
//     id: 3,
//     name: "Sarah Johnson",
//     username: "sarahj",
//     email: "sarah.johnson@example.com",
//     phone: "08107355414",
//     date: "22-Mar-2016",
//     status: "inactive",
//   },
//   {
//     id: 4,
//     name: "Michael Brown",
//     username: "mikebrown",
//     email: "michael.brown@example.com",
//     phone: "08107355415",
//     date: "10-Jul-2017",
//     status: "suspended",
//   },
//   {
//     id: 5,
//     name: "Emily Davis",
//     username: "emilyd",
//     email: "emily.davis@example.com",
//     phone: "08107355416",
//     date: "05-Feb-2018",
//     status: "active",
//   },
//   {
//     id: 6,
//     name: "David Wilson",
//     username: "davidw",
//     email: "david.wilson@example.com",
//     phone: "08107355417",
//     date: "18-Sep-2019",
//     status: "inactive",
//   },
//   {
//     id: 7,
//     name: "Jessica Taylor",
//     username: "jessicat",
//     email: "jessica.taylor@example.com",
//     phone: "08107355418",
//     date: "30-Apr-2020",
//     status: "suspended",
//   },
//   {
//     id: 8,
//     name: "Daniel Martinez",
//     username: "danielm",
//     email: "daniel.martinez@example.com",
//     phone: "08107355419",
//     date: "12-Dec-2021",
//     status: "active",
//   },
// ]

export default function UsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data: totalUsers } = useGetAdminTotalUsersQuery();
  const { data: activeStatus } = useGetAdminActiveStatusQuery();
  const { data: suspendedStatus } = useGetAdminSuspendedUsersQuery();
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetAdminUsersQuery({
    filter:
      activeTab !== "all"
        ? activeTab.toLowerCase().replace(" users", "")
        : undefined,
    search: debouncedSearch || undefined,
    page,
    limit,
  });
  const users = usersData?.data?.users ?? [];
  const total = usersData?.data?.total ?? 0;
  const totalPages = total
    ? Math.ceil(total / limit)
    : page + (users.length === limit ? 1 : 0);

  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();

  const userCounts = useMemo(() => {
    return {
      total: totalUsers?.data.thisMonth ?? 0,
      active: activeStatus?.data.active.thisMonth ?? 0,
      inactive: activeStatus?.data.inActive.thisMonth ?? 0,
      suspended: suspendedStatus?.data.thisMonth ?? 0,
      lastMonthTotal: totalUsers?.data.lastMonth ?? 0,
      lastMonthActive: activeStatus?.data.active.lastMonth ?? 0,
      lastMonthInactive: activeStatus?.data.inActive.lastMonth ?? 0,
      lastMonthSuspended: suspendedStatus?.data.lastMonth ?? 0,
    };
  }, [totalUsers, activeStatus, suspendedStatus]);

  const handleSuspendToggle = async (userId: string, status: string) => {
    if (!userId) {
      enqueueSnackbar({ variant: "error", message: "User ID is missing" });
      return;
    }
    try {
      if (status === "suspended") {
        await unsuspendUser(userId).unwrap();
        enqueueSnackbar({ variant: "success", message: "User unsuspended" });
        refetch();
      } else {
        await suspendUser(userId).unwrap();
        enqueueSnackbar({ variant: "success", message: "User suspended" });
        refetch();
      }
    } catch (err) {
      enqueueSnackbar({ variant: "error", message: "Operation failed" });
    }
  };

  // Handle row click to navigate to user profile
  const handleRowClick = (userId: string | number) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <section className="">
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold uppercase">USERS</h1>
          <p className="text-sm text-gray-500">
            Find all platform customers here
          </p>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={userCounts.total.toLocaleString()}
          percentage={`${
            userCounts.total - userCounts.lastMonthTotal >= 0 ? "+" : ""
          }${(
            ((userCounts.total - userCounts.lastMonthTotal) /
              (userCounts.lastMonthTotal || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={userCounts.lastMonthTotal.toLocaleString()}
        />
        <StatsCard
          title="Active Users"
          value={userCounts.active.toLocaleString()}
          percentage={`${
            userCounts.active - userCounts.lastMonthActive >= 0 ? "+" : ""
          }${(
            ((userCounts.active - userCounts.lastMonthActive) /
              (userCounts.lastMonthActive || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={userCounts.lastMonthActive.toLocaleString()}
        />
        <StatsCard
          title="Inactive Users"
          value={userCounts.inactive.toLocaleString()}
          percentage={`${
            userCounts.inactive - userCounts.lastMonthInactive >= 0 ? "+" : ""
          }${(
            ((userCounts.inactive - userCounts.lastMonthInactive) /
              (userCounts.lastMonthInactive || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={userCounts.lastMonthInactive.toLocaleString()}
        />
        <StatsCard
          title="Suspended Users"
          value={userCounts.suspended.toLocaleString()}
          percentage={`${
            userCounts.suspended - userCounts.lastMonthSuspended >= 0 ? "+" : ""
          }${(
            ((userCounts.suspended - userCounts.lastMonthSuspended) /
              (userCounts.lastMonthSuspended || 1)) *
            100
          ).toFixed(2)}%`}
          lastMonth="Last Month"
          lastMonthValue={userCounts.lastMonthSuspended.toLocaleString()}
        />
      </div>

      {/* Users Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === "all"
            ? `All Users (${total})`
            : `${activeTab} (${total})`}
        </h2>

        <div className="md:flex justify-between items-center mb-4">
          <div className="flex space-x-2 rounded-lg w-fit bg-[#F6F6F6]">
            <TabButton
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              View all
            </TabButton>
            <TabButton
              active={activeTab === "Active Users"}
              onClick={() => setActiveTab("Active Users")}
            >
              Active Users
            </TabButton>
            <TabButton
              active={activeTab === "Inactive Users"}
              onClick={() => setActiveTab("Inactive Users")}
            >
              Inactive Users
            </TabButton>
            <TabButton
              active={activeTab === "Suspended"}
              onClick={() => setActiveTab("Suspended")}
            >
              Suspended
            </TabButton>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, email, address"
              className="w-[300px] pl-9 shadow-none py-4 rounded-lg border-[#EAEAEA]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-md border">
            <div className="w-full overflow-x-auto max-w-full">
              <table className="min-w-[900px] text-sm text-gray-700">
                {/* Table Header */}
                <thead
                  className="bg-gray-50 border-b text-gray-500 font-medium"
                  style={{ fontSize: "14px" }}
                >
                  <tr>
                    <th className="text-left p-4 w-[25%]">Full Name</th>
                    <th className="text-left p-4 w-[16.6%]">Email</th>
                    <th className="text-left p-4 w-[16.6%]">Phone Number</th>
                    <th className="text-left p-4 w-[16.6%]">Date Joined</th>
                    <th className="text-left p-4 w-[8.3%]">Activity</th>
                    <th className="text-right p-4 w-[16.6%]">Suspend</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <AnimatedLogo />
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        onClick={() => handleRowClick(user._id)}
                        className="border-b hover:bg-gray-50 cursor-pointer text-[12px]"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src="/user-avatar.png"
                                alt={user.firstName}
                              />
                              <AvatarFallback>
                                {`${user.firstName?.[0] || ""}${
                                  user.lastName?.[0] || ""
                                }`.toUpperCase() || "NA"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              {user.email && (
                                <p className="text-gray-500 text-[10px]">
                                  @{user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.phone}</td>
                        <td className="p-4">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.status === "active"
                                  ? "bg-[#17b266]"
                                  : user.status === "inactive"
                                  ? "bg-yellow-400"
                                  : user.status === "suspended"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span>
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {user.status === "suspended" ? (
                            <Button
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuspendToggle(user._id, user.status);
                              }}
                            >
                              Resume
                            </Button>
                          ) : (
                            <Button
                              className="bg-[#17b266] hover:bg-[#149655] text-white text-xs px-3 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuspendToggle(user._id, user.status);
                              }}
                            >
                              Suspend
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {users.length > 0 && (
              <div className="flex justify-end items-center p-4 border-t">
                <div className="text-sm text-gray-500 mr-4">
                  Page {page} of {totalPages}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    &lt; Prev
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={`px-2 ${page === i + 1 ? "bg-gray-200" : ""}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next &gt;
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Component for stats cards
function StatsCard({
  title,
  value,
  percentage,
  lastMonth,
  lastMonthValue,
}: {
  title: string;
  value: string | number;
  percentage: string;
  lastMonth: string;
  lastMonthValue: string;
}) {
  // Determine if the trend is negative
  const isNegative = percentage.toString().startsWith("-");

  return (
    <Card className="overflow-hidden shadow-none border border-[#EAEAEA]">
      <CardContent className="p-0">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-500">{title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                isNegative
                  ? "text-red-600 bg-red-50"
                  : "text-[#17b266] bg-[#17b266]/10"
              }`}
            >
              {percentage}
            </span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 flex items-center justify-between border-t border-gray-50">
          <span className="text-xs text-gray-500">{lastMonth}</span>
          <span
            className={`text-xs ${
              lastMonthValue.startsWith("N")
                ? "text-[#17b266]"
                : "text-gray-500"
            }`}
          >
            {lastMonthValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface TabButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

// Component for tab buttons
function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      className={`px-2 md:px-4 m-1 text-xs rounded-lg py-2 md:text-sm ${
        active ? "bg-white text-[#000000] font-medium" : "text-[#97A2AC]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// interface User {
//   id: string | number
//   name: string
//   username: string
//   email: string
//   phone: string
//   date: string
//   status: "active" | "inactive" | "suspended" | string
// }

// interface UserRowProps {
//   user: User
//   onClick: MouseEventHandler<HTMLDivElement>
// }

// Component for user rows
// function UserRow({ user, onClick }: UserRowProps) {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-[#17b266]"
//       case "inactive":
//         return "bg-yellow-400"
//       case "suspended":
//         return "bg-red-500"
//       default:
//         return "bg-gray-400"
//     }
//   }

//   const getStatusText = (status: string) => {
//     return status.charAt(0).toUpperCase() + status.slice(1)
//   }

//   const handleSuspendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation() // Prevent row click when clicking the button
//     // Handle suspend action
//     console.log(`Suspend user ${user._id}`)
//   }

//   return (
//     <div
//       className="grid grid-cols-12 gap-6 p-4 border-b hover:bg-gray-50 cursor-pointer"
//       style={{ fontSize: "12px" }}
//       onClick={onClick}
//     >
//       <div className="col-span-3 flex items-center gap-3">
//         <Avatar>
//           <AvatarImage src="/user-avatar.png" alt={user.firstName} />
//           <AvatarFallback>{`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "NA"}</AvatarFallback>
//         </Avatar>
//         <div>
//           <p className="font-medium">{user.firstName} {user.lastName}</p>
//           {user.email && (
//             <p className="text-gray-500" style={{ fontSize: "10px" }}>
//               @{user.email}
//             </p>
//           )}
//         </div>
//       </div>
//       <div className="col-span-2 flex items-center">
//         <span className="truncate">{user.email}</span>
//       </div>
//       <div className="col-span-2 flex items-center">
//         <span>{user.phone}</span>
//       </div>
//       <div className="col-span-2 flex items-center">
//         <span>
//           {new Date(user.createdAt).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           })}
//         </span>
//       </div>
//       <div className="col-span-1 flex items-center">
//         <div className="flex items-center gap-2">
//           <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
//           <span>{getStatusText(user.status)}</span>
//         </div>
//       </div>
//       <div className="col-span-2 flex items-center justify-end">
//         {user.status === "suspended" ? (
//           <Button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1" onClick={handleSuspendClick}>
//             Resume
//           </Button>
//         ) : (
//           <Button className="bg-[#17b266] hover:bg-[#149655] text-white text-xs px-3 py-1" onClick={handleSuspendClick}>
//             Suspend
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }
