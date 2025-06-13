// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Search } from "lucide-react"
// import { PageHeader } from "@/context/page-header-context"
// import { useRouter } from "next/navigation"

// // Mock user data
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

// export default function UsersPage() {
//     const router = useRouter()
//     const [activeTab, setActiveTab] = useState("all")
//     const [searchQuery, setSearchQuery] = useState("")

//   // Filter users based on active tab and search query
//   const filteredUsers = useMemo(() => {
//     let filtered = [...mockUsers]

//     // Filter by tab
//     if (activeTab !== "all") {
//       filtered = filtered.filter((user) => user.status === activeTab.toLowerCase().replace(" users", ""))
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (user) =>
//           user.name.toLowerCase().includes(query) ||
//           user.email.toLowerCase().includes(query) ||
//           user.username.toLowerCase().includes(query) ||
//           user.phone.includes(query),
//       )
//     }

//     return filtered
//   }, [activeTab, searchQuery])

//   // Count users by status for the stats cards
//   const userCounts = useMemo(() => {
//     const total = mockUsers.length
//     const active = mockUsers.filter((user) => user.status === "active").length
//     const inactive = mockUsers.filter((user) => user.status === "inactive").length
//     const suspended = mockUsers.filter((user) => user.status === "suspended").length

//     return { total, active, inactive, suspended }
//   }, [])

//   // Handle row click to navigate to user profile
//   const handleRowClick = (userId) => {
//     router.push(`/admin/users/${userId}`)
//   }

//   return (
//     <>
//       <PageHeader>
//         <div>
//           <h1 className="text-2xl font-bold uppercase">USERS</h1>
//           <p className="text-sm text-gray-500">Find all platform customers here</p>
//         </div>
//       </PageHeader>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Users"
//           value={userCounts.total.toLocaleString()}
//           percentage="+23%"
//           lastMonth="Last Month"
//           lastMonthValue="18,345"
//         />
//         <StatsCard
//           title="Active Users"
//           value={userCounts.active.toLocaleString()}
//           percentage="+23%"
//           lastMonth="Last Month"
//           lastMonthValue="500"
//         />
//         <StatsCard
//           title="Inactive Users"
//           value={userCounts.inactive.toLocaleString()}
//           percentage="+23%"
//           lastMonth="Last Month"
//           lastMonthValue="500"
//         />
//         <StatsCard
//           title="Suspended Users"
//           value={userCounts.suspended.toLocaleString()}
//           percentage="+23%"
//           lastMonth="Last Month"
//           lastMonthValue="500"
//         />
//       </div>

//       {/* Users Table */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">
//           {activeTab === "all" ? `All Users (${userCounts.total})` : `${activeTab} (${filteredUsers.length})`}
//         </h2>

//         <div className="flex justify-between items-center mb-4">
//           <div className="flex space-x-2 rounded-lg bg-[#F6F6F6]">
//             <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
//               View all
//             </TabButton>
//             <TabButton active={activeTab === "Active Users"} onClick={() => setActiveTab("Active Users")}>
//               Active Users
//             </TabButton>
//             <TabButton active={activeTab === "Inactive Users"} onClick={() => setActiveTab("Inactive Users")}>
//               Inactive Users
//             </TabButton>
//             <TabButton active={activeTab === "Suspended"} onClick={() => setActiveTab("Suspended")}>
//               Suspend
//             </TabButton>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               type="search"
//               placeholder="Search by name, email, address"
//               className="w-[300px] pl-9 shadow-none py-4 rounded-lg border-[#EAEAEA]"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="bg-white rounded-md border">
//           {/* Table Header */}
//           <div className="grid grid-cols-12 gap-6 p-4 border-b font-medium text-gray-500" style={{ fontSize: "14px" }}>
//             <div className="col-span-2">Full Name</div>
//             <div className="col-span-3">Email</div>
//             <div className="col-span-2">Phone Number</div>
//             <div className="col-span-2">Date Joined</div>
//             <div className="col-span-1">Activity</div>
//             <div className="col-span-2 text-right">Suspend</div>
//           </div>

//           {/* Table Rows */}
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => <UserRow key={user.id} user={user} onClick={() => handleRowClick(user.id)} />)
//           ) : (
//             <div className="p-8 text-center text-gray-500">No users found matching your criteria</div>
//           )}

//           {/* Pagination */}
//           {filteredUsers.length > 0 && (
//             <div className="flex justify-end items-center p-4 border-t">
//               <div className="text-sm text-gray-500 mr-4">Page 1 of {Math.ceil(filteredUsers.length / 5)}</div>
//               <div className="flex space-x-1">
//                 <Button variant="outline" size="sm" className="px-2">
//                   &lt; Prev
//                 </Button>
//                 <Button variant="outline" size="sm" className="px-2 bg-gray-100">
//                   1
//                 </Button>
//                 <Button variant="outline" size="sm" className="px-2">
//                   2
//                 </Button>
//                 {filteredUsers.length > 10 && (
//                   <>
//                     <Button variant="outline" size="sm" className="px-2 text-gray-400">
//                       ...
//                     </Button>
//                     <Button variant="outline" size="sm" className="px-2">
//                       {Math.ceil(filteredUsers.length / 5)}
//                     </Button>
//                   </>
//                 )}
//                 <Button variant="outline" size="sm" className="px-2">
//                   Next &gt;
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// // Component for stats cards
// function StatsCard({ title, value, percentage, lastMonth, lastMonthValue }) {
//   return (
//     <Card className="overflow-hidden shadow-none border border-[#EAEAEA]">
//       <CardContent className="p-0">
//         <div className="p-2">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-sm text-gray-500">{title}</h3>
//             <span className="text-xs text-[#17b266] bg-[#17b266]/10 px-2 py-0.5 rounded">{percentage}</span>
//           </div>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//         <div className="p-3 flex items-center justify-between">
//           <span className="text-xs text-gray-500">{lastMonth}</span>
//           <span className={`text-xs ${lastMonthValue.startsWith("N") ? "text-[#17b266]" : "text-gray-500"}`}>
//             {lastMonthValue}
//           </span>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Component for tab buttons
// function TabButton({ children, active, onClick }) {
//   return (
//     <button
//       className={`px-4 m-1 rounded-lg py-2 text-sm ${
//         active ? "bg-white text-[#000000] font-medium" : "text-[#97A2AC]"
//       }`}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   )
// }

// // Component for user rows
// function UserRow({ user, onClick }) {
//   const getStatusColor = (status) => {
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

//   const getStatusText = (status) => {
//     return status.charAt(0).toUpperCase() + status.slice(1)
//   }

//   const handleSuspendClick = (e) => {
//     e.stopPropagation() // Prevent row click when clicking the button
//     // Handle suspend action
//     console.log(`Suspend user ${user.id}`)
//   }

//   return (
//     <div
//       className="grid grid-cols-12 gap-6 p-4 border-b hover:bg-gray-50 cursor-pointer"
//       style={{ fontSize: "12px" }}
//       onClick={onClick}
//     >
//       <div className="col-span-2 flex items-center gap-3">
//         <Avatar>
//           <AvatarImage src="/user-avatar.png" alt={user.name} />
//           <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
//         </Avatar>
//         <div>
//           <p className="font-medium">{user.name}</p>
//           <p className="text-gray-500" style={{ fontSize: "10px" }}>
//            @{user.username}
//           </p>
//         </div>
//       </div>
//       <div className="col-span-3 flex items-center">
//         <span className="truncate">{user.email}</span>
//       </div>
//       <div className="col-span-2 flex items-center">
//         <span>{user.phone}</span>
//       </div>
//       <div className="col-span-2 flex items-center">
//         <span>{user.date}</span>
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
