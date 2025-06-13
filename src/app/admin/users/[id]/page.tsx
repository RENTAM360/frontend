"use client"

import { useState } from "react"
import { PageHeader } from "@/context/page-header-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  CreditCard,
  Edit3,
  FileText,
  Trash2,
  ChevronRight,
  Star,
  ArrowUpLeft,
  ChevronDown,
  ThumbsUp,
  MessageCircle,
  Paperclip,
  Send,
} from "lucide-react"
import { getOwnerReviews } from "@/lib/data"
import { ReviewsPageClient } from "@/components/reviews-page-client"

// Mock user data
const userData = {
  id: 1,
  name: "Thankgod ogbonna",
  username: "thankimedia",
  email: "Thankimedia@gmail.com",
  phone: "09124639133",
  date: "June 2024",
  status: "active",
  verified: true,
  location: "Nigeria",
  address: "7 Woji Port harcourt",
  bankAccount: "Bank account, 7077900016, FCMB",
  bankName: "Thankgod ogbonna",
  nin: "NIN, 76968368993970",
  bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
}

// Mock wallet data
const walletData = {
  availableBalance: 100000,
  totalBalance: 100000,
  transactions: [
    {
      id: 1,
      type: "withdraw",
      amount: 100000,
      date: "06 march, 2025",
      status: "completed",
    },
    {
      id: 2,
      type: "withdraw",
      amount: 100000,
      date: "06 march, 2025",
      status: "completed",
    },
  ],
}

// Mock bank accounts data
const bankAccountsData = [
  {
    id: 1,
    bankName: "Guaranty Trust Bank",
    accountNumber: "7077900016",
    accountName: "solomon Abuh",
    logo: "/gtb.svg",
  },
  {
    id: 2,
    bankName: "Guaranty Trust Bank",
    accountNumber: "7077900016",
    accountName: "solomon Abuh",
    logo: "/gtb.svg",
  },
]

// Mock reviews data
// Owner data
const ownerData = {
  id: 1,
  name: "Thankgod Ogbonna",
  profileImage: "/diverse-group-profile.png",
}

// Reviews data 
const reviewsData = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "David ugo",
      profileImage: "/du.svg",
    },
    text: "Good rent and great customer service",
    date: "28/05/25",
    likes: 0,
    replies: [],
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "victor john",
      profileImage: "/vj.svg",
    },
    text: "Good rent and great customer service",
    date: "28/05/25",
    likes: 0,
    replies: [
      {
        id: "reply1",
        user: {
          id: 1,
          name: "Thankgod ogbonna",
          profileImage: "/tg2.svg",
        },
        text: "OOh cool that sound great",
        date: "28/05/25",
        isOwner: true,
      },
      {
        id: "reply2",
        user: {
          id: "user3",
          name: "Wow cool",
          profileImage: "/tg.svg",
        },
        text: "Wow cool",
        date: "28/05/25",
        isOwner: false,
      },
    ],
  },
  {
    id: "3",
    user: {
      id: "user4",
      name: "Femi abu",
      profileImage: "/fa.svg",
    },
    text: "Got a Monitor Mount from him, it came really quickly and was as seen. Fits my monitor",
    date: "28/05/25",
    likes: 0,
    image: "/monitor-mount.svg",
    replies: [],
  },
]

// Mock rentals data
const itemsData = [
  {
    id: 1,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
  {
    id: 2,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
  {
    id: 3,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
  {
    id: 4,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
  {
    id: 5,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
  {
    id: 6,
    title: "Excavator",
    category: "Construction tools",
    price: 50000,
    rating: 4.5,
    image: "/excavator.svg",
  },
]

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Items")

  const renderTabContent = () => {
    switch (activeTab) {
      case "Wallet":
        return <WalletContent />
      case "Items":
        return <ItemsContent />
        case "Bank":
        return <BankContent />
      case "Reviews":
        return <ReviewsContent />
      default:
        return <ItemsContent />
    }
  }

  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </PageHeader>

      <div className="mt-4 gap-3 flex">
        {/* Profile Header */}
        <div className="bg-white rounded-t-[20px] flex-1 rounded-[20px] overflow-hidden border">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-40">
              <img src="/profile-bg.svg" alt="Cover" className="w-full rounded-t-[20px] rounded-b-[30px] h-full object-cover" />
            </div>

            {/* Profile Picture */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
              <Avatar className="w-[79px] h-[79px] border-2 border-white">
                <AvatarImage src="/tg.svg" alt={userData.name} />
                <AvatarFallback>{userData.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6 px-6 text-center">
            <h2 className="text-base font-bold">{userData.name}</h2>
            {userData.verified && (
              <div className="inline-block bg-[#E8F8F1] font-light text-primary text-[9px] px-2 py-0.5 rounded mt-1">Verified</div>
            )}
            <p className="text-[#979797] mt-4 max-w-2xl text-xs mx-auto">{userData.bio}</p>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{userData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">Joined {userData.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button className="bg-red-500 hover:bg-red-600 text-xs text-white">Suspend</Button>
              <Button className="bg-[#17b266] hover:bg-[#149655] text-xs text-white">message</Button>
            </div>
          </div>

          {/* User Details */}
          <div className="border-t px-6 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><MapPin className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-black text-xs">{userData.address}</span>
              </div>
              <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><Phone className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-black text-xs">{userData.phone}</span>
              </div>
              <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><CreditCard className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-black text-xs">{userData.bankAccount}, {userData.bankName}</span>
                {/* <span className="text-gray-400 ml-1">{userData.bankName}</span> */}
              </div>
              <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><Edit3 className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-[#17b266] text-xs">Edit profile details</span>
              </div>
              <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><FileText className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-black text-xs">{userData.nin}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-2 items-center">
                  <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><Trash2 className="w-4 h-4 text-[#17b266]" /></div>
                  <span className="text-black text-xs">Delete account permanently</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white flex-2 rounded-[20px] border">
          <div className="flex bg-[#F6F6F6] m-2 p-1 rounded-lg text-xs w-[280px]">
            <TabButton active={activeTab === "Items"} onClick={() => setActiveTab("Items")}>
              Items
            </TabButton>
            <TabButton active={activeTab === "Wallet"} onClick={() => setActiveTab("Wallet")}>
              Wallet
            </TabButton>
             <TabButton active={activeTab === "Bank"} onClick={() => setActiveTab("Bank")}>
              Bank
            </TabButton>
            <TabButton active={activeTab === "Reviews"} onClick={() => setActiveTab("Reviews")}>
              Reviews
            </TabButton>
          </div>


          {/* Tab Content */}
          {renderTabContent()}
          
        </div>
      </div>
    </>
  )
}

// Bank Content Component
function BankContent() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Bank account</h3>

      <div className="space-y-4">
        {bankAccountsData.map((account) => (
          <BankAccountItem key={account.id} account={account} />
        ))}
      </div>
    </div>
  )
}

// Reviews Content Component
function ReviewsContent() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Review</h3>

      {reviewsData.length > 0 ? (
        <div className="space-y-6">
          {reviewsData.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6">
              <div className="bg-[#F8F8F8] p-3 mb-3 rounded-xl">
                {/* Review Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={review.user.profileImage || "/placeholder.svg"}
                      alt={review.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{review.user.name}</h3>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 mb-3">{review.text}</p>
              </div>

              {/* Review Image (if any) */}
              {review.image && (
                <div className="mb-3">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt="Review image"
                    className="rounded-lg max-w-[300px] h-auto"
                  />
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span>{review.date}</span>
                <button className="flex items-center gap-1 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  Like
                </button>
                <button className="flex items-center gap-1 hover:text-gray-700">
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>
                {review.likes > 0 && (
                  <div className="flex items-center gap-1 text-[#17b266]">
                    <ThumbsUp className="w-4 h-4 fill-[#17b266]" />
                    {review.likes}
                  </div>
                )}
              </div>

              {/* Replies */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 pl-10 space-y-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={reply.user.profileImage || "/placeholder.svg"}
                            alt={reply.user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{reply.user.name}</h4>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{reply.text}</p>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span>{reply.date}</span>
                        {reply.isOwner ? (
                          <button className="text-gray-500 hover:text-gray-700">Edit</button>
                        ) : (
                          <button className="text-gray-500 hover:text-gray-700">Like</button>
                        )}
                        <button className="text-gray-500 hover:text-gray-700">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="mt-4 pl-10">
                <div className="flex items-center gap-2 border rounded-sm p-2 bg-[#F8F8F8]">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 outline-none text-sm px-2 bg-transparent"
                  />
                  <button className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="bg-[#17b266] text-white rounded-full p-1.5">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No reviews yet</div>
      )}
    </div>
  )
}

function ItemsContent() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6">Items</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsData.map((item) => (
          <ItemsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

// Wallet Content Component
function WalletContent() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-6">Wallet</h3>

      {/* Balance Card */}
      <div className="bg-black text-white rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm mb-2">Available balance</p>
            <h2 className="text-2xl font-bold mb-2">₦100,000</h2>
            <p className="text-white/60 text-xs">₦100,000 (Total balance)</p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-100 px-6">Withdraw</Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium">History</h4>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer">
          <span className="text-sm">All</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {walletData.transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

// Component for bank account items
function BankAccountItem({ account }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white overflow-hidden">
          <img src={account.logo || "/placeholder.svg"} alt={account.bankName} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-sm">{account.bankName}</p>
        </div>
      </div>
      <div className="text-gray-600 text-xs">
        {account.accountNumber}, {account.accountName}
      </div>
    </div>
  )
}

// Component for tab buttons
function TabButton({ children, active, onClick }) {
  return (
    <button
      className={`px-3 py-3 rounded-lg text-sm ${
        active ? "bg-white text-black font-medium" : "text-[#979797]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Component for transaction items
function TransactionItem({ transaction }) {
  return (
    <div className="flex items-center  border border-[#EEEEEE] rounded-lg justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F5FBEACC] rounded-full flex items-center justify-center">
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.32824 21.3932C5.44391 20.8164 4.06005 19.8082 3.17665 18.3685C2.29326 16.9288 1.85156 15.4869 1.85156 14.0428C1.85156 12.5987 2.29326 11.1568 3.17665 9.71706C4.06005 8.27734 5.44354 7.26947 7.32714 6.69344V7.85536C6.03198 8.29341 4.97812 9.07824 4.16554 10.2099C3.35297 11.3415 2.94704 12.6191 2.94777 14.0428C2.9485 15.4664 3.35443 16.744 4.16554 17.8757C4.97666 19.0073 6.03089 19.7921 7.32824 20.2302V21.3932ZM16.0892 21.7086C13.9559 21.7086 12.1449 20.9639 10.6563 19.4745C9.16767 17.9852 8.42299 16.1746 8.42226 14.0428C8.42153 11.9109 9.1662 10.1003 10.6563 8.61099C12.1464 7.12163 13.957 6.37695 16.0881 6.37695C17.0824 6.37695 18.0279 6.55582 18.9244 6.91356C19.8224 7.2713 20.6237 7.77505 21.3282 8.42482L20.5539 9.19907C19.9655 8.65297 19.2953 8.22879 18.5433 7.92654C17.7913 7.62356 16.9729 7.47207 16.0881 7.47207C14.2629 7.47207 12.7115 8.11089 11.4338 9.38852C10.1562 10.6662 9.51737 12.2176 9.51737 14.0428C9.51737 15.868 10.1562 17.4194 11.4338 18.697C12.7115 19.9746 14.2629 20.6135 16.0881 20.6135C16.9729 20.6135 17.7913 20.4623 18.5433 20.1601C19.2953 19.8571 19.9651 19.4326 20.5529 18.8865L21.3282 19.6618C20.6237 20.3101 19.8228 20.8131 18.9255 21.1709C18.0282 21.5293 17.0828 21.7086 16.0892 21.7086ZM22.2382 17.6654L21.4629 16.8901L23.7626 14.5903H15.12V13.4952H23.7626L21.4629 11.1955L22.2382 10.4201L25.8609 14.0428L22.2382 17.6654Z" fill="#85CB33"/>
          </svg>

        </div>
        <div>
          <p className="font-medium capitalize">{transaction.type}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-red-500">₦{transaction.amount.toLocaleString()}</p>
      </div>
    </div>
  )
}

// Component for rental cards
function ItemsCard({ item }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="h-32">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full rounded-b-lg object-cover" />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-base">{item.title}</h4>
        <p className="text-sm text-[#979797]">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-sm">₦{item.price.toLocaleString()}</div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium text-sm">{item.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
