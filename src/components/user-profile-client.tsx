"use client";

import { ReactNode, useState } from "react";
import { PageHeader } from "@/context/page-header-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  CreditCard,
  Trash2,
  ChevronRight,
  ChevronDown,
  Paperclip,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi";
import { useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi";
import {
  useDeleteUserMutation,
  useGetUserBanksQuery,
  useGetUserTransactionsQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from "@/lib/redux/api/adminApi";
import { enqueueSnackbar } from "notistack";
import { socketService } from "@/lib/socket";
import type { Conversation } from "@/types/messaging";
import { useRouter } from "next/navigation";
import { useMessagingContext } from "@/context/messaging-context";
// import { getOwnerReviews } from "@/lib/data"
// import { ReviewsPageClient } from "@/components/reviews-page-client"

interface UserProfileClientProps {
  userId: string;
}

export default function UserProfileClient({ userId }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState("Items");
  const router = useRouter();
  const { data: userProfile, refetch } = useGetOtherUserProfileQuery(userId!, {
    skip: !userId,
  });

  const { joinConversation } = useMessagingContext();
  const user = userProfile?.data?.user;
  // console.log(user)

  const [deleteUser] = useDeleteUserMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();

  const renderTabContent = () => {
    switch (activeTab) {
      case "Wallet":
        return <WalletContent userId={userId} />;
      case "Items":
        return <ItemsContent userId={userId} />;
      case "Bank":
        return <BankContent userId={userId} />;
      case "Reviews":
        return <ReviewsContent />;
      default:
        return <ItemsContent userId={userId} />;
    }
  };

  const handleSuspendToggle = async () => {
    if (!user?._id) {
      enqueueSnackbar({ variant: "error", message: "User ID is missing" });
      return;
    }
    try {
      if (user?.status === "suspended") {
        await unsuspendUser(user._id).unwrap();
        enqueueSnackbar({ variant: "success", message: "User unsuspended" });
        refetch();
      } else {
        await suspendUser(user?._id).unwrap();
        enqueueSnackbar({ variant: "success", message: "User suspended" });
        refetch();
      }
    } catch (err) {
      enqueueSnackbar({ variant: "error", message: "Operation failed" });
    }
  };

  const handleDeleteUser = async () => {
    if (!user?._id) return;

    const confirmDelete = confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(user._id).unwrap();
      enqueueSnackbar({ variant: "success", message: "User account deleted!" });
      window.location.href = "/admin/users";
    } catch (error) {
      enqueueSnackbar({ variant: "error", message: "Failed to delete user" });
      console.error(error);
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

    // Construct conversation object matching `Conversation` shape (equipment-less/direct chat)
    const conv: Conversation = {
      receiverId,
      equipmentId: "",
      equipment: { name: "", media: [] },
      participant: {
        userId: receiverId,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar || "/user.svg",
      },
      lastMessage: "",
      conversationId: "",
      lastMessageRead: false,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: [],
    };

    // Join as a direct/admin conversation (no equipment)
    joinConversation(receiverId, "", conv);

    console.log("Admin started conversation:", conv);

    // Redirect to admin message thread (use receiverId)
    router.push(`/admin/messages?conversation=${receiverId}`);
  };

  return (
    <>
      <PageHeader>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </PageHeader>

      <div className="mt-4 gap-3 md:flex">
        {/* Profile Header */}
        <div className="bg-white rounded-t-[20px] flex-1 rounded-[20px] overflow-hidden border">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-40">
              <Image
                src={user?.coverPhoto || "/cover1.jpg"}
                alt="Cover"
                fill
                className="w-full rounded-t-[20px] rounded-b-[30px] h-full object-cover"
              />
            </div>

            {/* Profile Picture */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
              <Avatar className="w-[79px] h-[79px] border-2 border-white">
                <AvatarImage
                  src={user?.avatar || "/user.svg"}
                  alt={user?.firstName}
                />
                <AvatarFallback>
                  {`${user?.firstName?.[0] || ""}${
                    user?.lastName?.[0] || ""
                  }`.toUpperCase() || "NA"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-6 px-6 text-center">
            <h2 className="text-base font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.isVerify && (
              <div className="inline-block bg-[#E8F8F1] font-light text-primary text-[9px] px-2 py-0.5 rounded mt-1">
                Verified
              </div>
            )}
            <p className="text-[#979797] mt-4 max-w-2xl text-xs mx-auto">
              {user?.bio}
            </p>

            <div className="flex items-center flex-col justify-center gap-4 mt-4 text-sm text-gray-500">
              {user?.address && (
                <div className="flex gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{user?.address}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-xs">
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                onClick={handleSuspendToggle}
                className="bg-red-500 hover:bg-red-600 text-xs text-white"
              >
                {user?.status === "suspended" ? "Unsuspend" : "Suspend"}
              </Button>
              <Button
                onClick={handleMessage}
                className="bg-[#17b266] hover:bg-[#149655] text-xs text-white"
              >
                message
              </Button>
            </div>
          </div>

          {/* User Details */}
          <div className="border-t px-6 py-4">
            <div className="max-w-2xl mx-auto">
              {user?.address && (
                <div className="flex gap-2 items-center py-3 border-b">
                  <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center">
                    <MapPin className="w-4 h-4 text-[#17b266]" />
                  </div>
                  <span className="text-black text-xs">{user?.address}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex gap-2 items-center py-3 border-b">
                  <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center">
                    <Phone className="w-4 h-4 text-[#17b266]" />
                  </div>
                  <span className="text-black text-xs">{user?.phone}</span>
                </div>
              )}
              {userProfile?.data?.account && (
                <div className="flex gap-2 items-center py-3">
                  <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center">
                    <CreditCard className="w-4 h-4 text-[#17b266]" />
                  </div>
                  <span className="text-black text-xs">
                    {userProfile?.data?.account?.accountNumber},{" "}
                    {userProfile?.data?.account?.bankName}
                  </span>
                  {/* <span className="text-gray-400 ml-1">{user.bankName}</span> */}
                </div>
              )}
              {/* <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><Edit3 className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-[#17b266] text-xs">Edit profile details</span>
              </div> */}
              {/* <div className="flex gap-2 items-center py-3 border-b">
                <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center"><FileText className="w-4 h-4 text-[#17b266]" /></div>
                <span className="text-black text-xs">{user.nin}</span>
              </div> */}
              <div
                onClick={handleDeleteUser}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex gap-2 items-center">
                  <div className="bg-[#F6FEF9] rounded-full p-2 flex justify-center items-center">
                    <Trash2 className="w-4 h-4 text-[#17b266]" />
                  </div>
                  <span className="text-black text-xs">
                    Delete account permanently
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 bg-white flex-2 rounded-[20px] border">
          <div className="flex bg-[#F6F6F6] m-2 p-1 rounded-lg text-xs w-[280px]">
            <TabButton
              active={activeTab === "Items"}
              onClick={() => setActiveTab("Items")}
            >
              Items
            </TabButton>
            <TabButton
              active={activeTab === "Wallet"}
              onClick={() => setActiveTab("Wallet")}
            >
              Wallet
            </TabButton>
            <TabButton
              active={activeTab === "Bank"}
              onClick={() => setActiveTab("Bank")}
            >
              Bank
            </TabButton>
            <TabButton
              active={activeTab === "Reviews"}
              onClick={() => setActiveTab("Reviews")}
            >
              Reviews
            </TabButton>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}

// Bank Content Component
function BankContent({ userId }: UserProfileClientProps) {
  const { data } = useGetUserBanksQuery(userId);
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Bank account</h3>

      <div className="space-y-4">
        {data?.data?.map((account) => (
          <BankAccountItem key={account.accountNumber} account={account} />
        ))}
      </div>
    </div>
  );
}

// Reviews Content Component
function ReviewsContent() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Review</h3>

      {/* {reviewsData.length > 0 ? (
        <div className="space-y-6">
          {reviewsData.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6">
              <div className="bg-[#F8F8F8] p-3 mb-3 rounded-xl">
                {/* Review Header */}
      {/* <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={review.user.profileImage || "/placeholder.svg"}
                      alt={review.user.name}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{review.user.name}</h3>
                  </div>
                </div> */}

      {/* Review Content */}
      {/* <p className="text-gray-700 mb-3">{review.text}</p>
              </div> */}

      {/* Review Image (if any) */}
      {/* {review.image && (
                <div className="mb-3">
                  <Image
                    src={review.image || "/placeholder.svg"}
                    alt="Review image"
                    className="rounded-lg max-w-[300px] h-auto"
                    width={300}
                    height={300}
                  />
                </div>
              )} */}

      {/* Review Actions */}
      {/* <div className="flex items-center text-sm text-gray-500 gap-4">
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
              </div> */}

      {/* Replies */}
      {/* {review.replies && review.replies.length > 0 && (
                <div className="mt-4 pl-10 space-y-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={reply.user.profileImage || "/placeholder.svg"}
                            alt={reply.user.name}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
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
              )} */}

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
    //     ))}
    //   </div>
    // ) : (
    //   <div className="text-center py-12 text-gray-500">No reviews yet</div>
    // )} */}
    // </div>
  );
}

function ItemsContent({ userId }: UserProfileClientProps) {
  const { data: userEquipments } = useGetEquipmentsQuery({ userId });
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6">Items</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1600px] justify-center 2xl:grid-cols-5 place-items-stretch scroll-smooth gap-2">
        {userEquipments?.equipments.map((item) => (
          <ItemsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// Wallet Content Component
function WalletContent({ userId }: UserProfileClientProps) {
  const { data } = useGetUserTransactionsQuery({ userId, page: 1, limit: 10 });
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
          {/* <Button className="bg-white text-black hover:bg-gray-100 px-6">
            Withdraw
          </Button> */}
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
        {data?.data?.history.map((transaction) => (
          <TransactionItem
            key={transaction._id}
            transaction={{
              type: transaction.type,
              date: new Date(transaction.createdAt).toLocaleDateString(),
              amount: transaction.totalPaid,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
}

// Component for bank account items
function BankAccountItem({ account }: { account: BankAccount }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white overflow-hidden">
          <Image
            src={"/placeholder.svg"}
            alt={account.bankName}
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        </div>
        <div>
          <p className="font-bold text-sm">{account.bankName}</p>
        </div>
      </div>
      <div className="text-gray-600 text-xs">
        {account.accountNumber}, {account.accountNumber}
      </div>
    </div>
  );
}

interface TabButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}
// Component for tab buttons
function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      className={`px-3 py-3 rounded-lg text-sm ${
        active ? "bg-white text-black font-medium" : "text-[#979797]"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Component for transaction items
function TransactionItem({
  transaction,
}: {
  transaction: { type: string; date: string; amount: number };
}) {
  return (
    <div className="flex items-center  border border-[#EEEEEE] rounded-lg justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F5FBEACC] rounded-full flex items-center justify-center">
          <svg
            width="27"
            height="28"
            viewBox="0 0 27 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.32824 21.3932C5.44391 20.8164 4.06005 19.8082 3.17665 18.3685C2.29326 16.9288 1.85156 15.4869 1.85156 14.0428C1.85156 12.5987 2.29326 11.1568 3.17665 9.71706C4.06005 8.27734 5.44354 7.26947 7.32714 6.69344V7.85536C6.03198 8.29341 4.97812 9.07824 4.16554 10.2099C3.35297 11.3415 2.94704 12.6191 2.94777 14.0428C2.9485 15.4664 3.35443 16.744 4.16554 17.8757C4.97666 19.0073 6.03089 19.7921 7.32824 20.2302V21.3932ZM16.0892 21.7086C13.9559 21.7086 12.1449 20.9639 10.6563 19.4745C9.16767 17.9852 8.42299 16.1746 8.42226 14.0428C8.42153 11.9109 9.1662 10.1003 10.6563 8.61099C12.1464 7.12163 13.957 6.37695 16.0881 6.37695C17.0824 6.37695 18.0279 6.55582 18.9244 6.91356C19.8224 7.2713 20.6237 7.77505 21.3282 8.42482L20.5539 9.19907C19.9655 8.65297 19.2953 8.22879 18.5433 7.92654C17.7913 7.62356 16.9729 7.47207 16.0881 7.47207C14.2629 7.47207 12.7115 8.11089 11.4338 9.38852C10.1562 10.6662 9.51737 12.2176 9.51737 14.0428C9.51737 15.868 10.1562 17.4194 11.4338 18.697C12.7115 19.9746 14.2629 20.6135 16.0881 20.6135C16.9729 20.6135 17.7913 20.4623 18.5433 20.1601C19.2953 19.8571 19.9651 19.4326 20.5529 18.8865L21.3282 19.6618C20.6237 20.3101 19.8228 20.8131 18.9255 21.1709C18.0282 21.5293 17.0828 21.7086 16.0892 21.7086ZM22.2382 17.6654L21.4629 16.8901L23.7626 14.5903H15.12V13.4952H23.7626L21.4629 11.1955L22.2382 10.4201L25.8609 14.0428L22.2382 17.6654Z"
              fill="#85CB33"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium capitalize">{transaction.type}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-red-500">
          ₦{transaction.amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
interface EquipmentCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    pricePerDay: number;
    rating: number;
    imageUrl: string;
    variant?: "default" | "profile" | "saved";
  };
}
// Component for rental cards
function ItemsCard({ item }: EquipmentCardProps) {
  return (
    <div className="rounded-lg h-full overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          priority
          fill
          alt={item.title}
          className="w-full h-full rounded-b-lg object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-base">{item.title}</h4>
        <p className="text-sm text-[#979797]">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium text-sm">
            ₦{item.pricePerDay.toLocaleString()}
          </div>
          {/* <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium text-sm">{item.rating}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
