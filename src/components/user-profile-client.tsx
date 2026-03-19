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
  Paperclip,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useGetOtherUserProfileQuery } from "@/lib/redux/api/authApi";
import { useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi";
import {
  useDeleteUserMutation,
  useGetUserWalletQuery,
  useGetRentedEquipmentQuery,
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
      case "Rentals":
        return <RentalsContent userId={userId} />;
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
      "Are you sure you want to permanently delete this user?",
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
      localStorage.getItem("conversationUsers") || "{}",
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
          <div className="flex bg-[#F6F6F6] m-2 p-1 rounded-lg text-xs w-[300px]">
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
              active={activeTab === "Rentals"}
              onClick={() => setActiveTab("Rentals")}
            >
              Rentals
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

// Rentals Content Component
function RentalsContent({ userId }: UserProfileClientProps) {
  const { data } = useGetRentedEquipmentQuery(userId);
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6">Rentals</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1600px] justify-center 2xl:grid-cols-5 place-items-stretch scroll-smooth gap-2">
        {data?.data?.map((item) => (
          <ItemsCard
            key={item._id}
            item={{
              id: item._id,
              title: item.equipment?.name || "Unknown",
              category: item.equipment?.category || "",
              pricePerDay: item.equipment?.pricePerDay || 0,
              rating: 0,
              imageUrl: item.equipment?.media?.[0]?.url || "",
            }}
          />
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
  const [activeTab, setActiveTab] = useState<"all" | "rentals" | "transactions">("all");
  const [filter, setFilter] = useState("All");
  const { data } = useGetUserWalletQuery(userId);

  const wallet = data?.data?.wallet;
  const transactions = data?.data?.history || [];

  const filtered = transactions
    .filter((t) => {
      const isRental = !!t.booking;
      if (activeTab === "rentals" && !isRental) return false;
      if (activeTab === "transactions" && isRental) return false;
      if (filter !== "All") {
        const f = filter.toLowerCase();
        const s = t.status.toLowerCase();
        if (f === "successful" && s !== "successful") return false;
        if (f === "pending" && s !== "pending") return false;
        if (f === "withdrawal" && s !== "withdrawal" && s !== "withdrawn") return false;
        if (f === "deposit" && s !== "deposit" && s !== "deposited") return false;
      }
      return true;
    });

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-6">Wallet</h3>

      {/* Balance Card */}
      <div className="bg-black text-white rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm md:text-lg mb-2">Available balance</p>
            <h3 className="text-2xl md:text-4xl font-bold mb-2">
              ₦{(wallet?.available || 0).toLocaleString()}
            </h3>
            <p className="text-xs md:text-sm opacity-80">
              ₦{(wallet?.total || 0).toLocaleString()} (Total balance)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">History</h3>
        <div className="flex gap-2">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as "all" | "rentals" | "transactions")}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="rentals">Rentals</option>
            <option value="transactions">Transactions</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Successful</option>
            <option>Pending</option>
            <option>Withdrawal</option>
            <option>Deposit</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((t) => {
            const isCredit = t.isCredit ?? false;
            const title = t.booking?.equipment?.name || t.text || t.status;
            const date = new Date(t.time || t.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });
            const status = t.status.toLowerCase();
            const statusLabel =
              t.transactionStatus === "pending" ? "Pending"
              : t.transactionStatus === "completed" ? "Completed"
              : status === "pending" ? "Pending"
              : status === "withdrawal" || status === "withdrawn" ? "Withdrawal"
              : status === "deposit" || status === "deposited" ? "Deposit"
              : status === "successful" ? "Successful"
              : t.status;
            const statusColor =
              status === "withdrawal" || status === "withdrawn"
                ? "text-[#F04438]"
                : status === "successful" || status === "deposit" || status === "deposited"
                ? "text-primary"
                : "text-[#FA812F]";

            return (
              <div key={t._id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isCredit ? "bg-green-50" : "bg-red-50"}`}>
                      <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={isCredit ? "" : "rotate-180"}>
                        <path d="M7.32824 21.3942C5.44391 20.8174 4.06005 19.8092 3.17665 18.3694C2.29326 16.9297 1.85156 15.4878 1.85156 14.0437C1.85156 12.5996 2.29326 11.1577 3.17665 9.71803C4.06005 8.27832 5.44354 7.27045 7.32714 6.69442V7.85634C6.03198 8.29438 4.97812 9.07922 4.16554 10.2108C3.35297 11.3425 2.94704 12.6201 2.94777 14.0437C2.9485 15.4674 3.35443 16.745 4.16554 17.8766C4.97666 19.0083 6.03089 19.7931 7.32824 20.2311V21.3942ZM16.0892 21.7095C13.9559 21.7095 12.1449 20.9649 10.6563 19.4755C9.16767 17.9862 8.42299 16.1756 8.42226 14.0437C8.42153 11.9119 9.1662 10.1013 10.6563 8.61197C12.1464 7.12261 13.957 6.37793 16.0881 6.37793C17.0824 6.37793 18.0279 6.5568 18.9244 6.91454C19.8224 7.27227 20.6237 7.77603 21.3282 8.4258L20.5539 9.20004C19.9655 8.65395 19.2953 8.22977 18.5433 7.92752C17.7913 7.62454 16.9729 7.47305 16.0881 7.47305C14.2629 7.47305 12.7115 8.11186 11.4338 9.3895C10.1562 10.6671 9.51737 12.2185 9.51737 14.0437C9.51737 15.8689 10.1562 17.4203 11.4338 18.698C12.7115 19.9756 14.2629 20.6144 16.0881 20.6144C16.9729 20.6144 17.7913 20.4633 18.5433 20.1611C19.2953 19.8581 19.9651 19.4335 20.5529 18.8874L21.3282 19.6628C20.6237 20.3111 19.8228 20.8141 18.9255 21.1718C18.0282 21.5303 17.0828 21.7095 16.0892 21.7095ZM22.2382 17.6664L21.4629 16.891L23.7626 14.5913H15.12V13.4962H23.7626L21.4629 11.1964L22.2382 10.4211L25.8609 14.0437L22.2382 17.6664Z" fill={isCredit ? "#85CB33" : "#EF4444"} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium capitalize">
                        {status === "withdrawn" ? "Withdrawal" : title}
                      </h4>
                      <p className="text-xs text-gray-500">{date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm capitalize ${statusColor}`}>{statusLabel}</p>
                    <p className="text-sm font-medium">₦{t.totalPaid?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">No transactions found.</div>
        )}
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
          src={
            item.imageUrl?.startsWith("https://") ||
            item.imageUrl?.startsWith("http://")
              ? item.imageUrl
              : "/placeholder.svg"
          }
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
