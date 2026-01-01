"use client";

import type React from "react";
import { ComponentType, Suspense, useEffect, useState } from "react";
import { Bell, X, Menu, LogOut } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeaderProvider } from "@/context/page-header-context";
import Image from "next/image";
import {
  NotificationProvider,
  useNotifications,
} from "@/context/notification-context";
import NotificationsDropdown from "@/components/notifications-dropdown";
import { useLogout } from "../utils/handleLogout";

const TransactionsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.66158 20.1116C9.45075 20.1116 9.24907 20.0199 9.11158 19.8366L8.18573 18.5991C7.99323 18.3424 7.73659 18.1957 7.46159 18.1774C7.18659 18.1591 6.91156 18.2874 6.69156 18.5166C5.36239 19.9374 4.35407 19.8183 3.86824 19.6349C3.37324 19.4424 2.53906 18.8099 2.53906 16.7749V6.45326C2.53906 2.38326 3.7124 1.14575 7.55323 1.14575H14.4741C18.3149 1.14575 19.4882 2.38326 19.4882 6.45326V10.3582C19.4882 10.7341 19.1766 11.0457 18.8007 11.0457C18.4249 11.0457 18.1132 10.7341 18.1132 10.3582V6.45326C18.1132 3.14409 17.5357 2.52075 14.4741 2.52075H7.55323C4.49156 2.52075 3.91406 3.14409 3.91406 6.45326V16.7749C3.91406 17.7374 4.1524 18.2691 4.3724 18.3516C4.5374 18.4157 4.98658 18.3241 5.68325 17.5816C6.18742 17.0499 6.84741 16.7657 7.53491 16.8024C8.21324 16.8391 8.85491 17.1966 9.28574 17.7741L10.2207 19.0116C10.4499 19.3141 10.3857 19.7449 10.0832 19.9741C9.94574 20.0749 9.79908 20.1116 9.66158 20.1116Z"
      fill="white"
    />
    <path
      d="M16.6833 20.3042C14.685 20.3042 13.0625 18.6817 13.0625 16.6833C13.0625 14.685 14.685 13.0625 16.6833 13.0625C18.6817 13.0625 20.3042 14.685 20.3042 16.6833C20.3042 18.6817 18.6817 20.3042 16.6833 20.3042ZM16.6833 14.4375C15.4458 14.4375 14.4375 15.4458 14.4375 16.6833C14.4375 17.9208 15.4458 18.9292 16.6833 18.9292C17.9208 18.9292 18.9292 17.9208 18.9292 16.6833C18.9292 15.4458 17.9208 14.4375 16.6833 14.4375Z"
      fill="white"
    />
    <path
      d="M20.1683 20.8541C19.9941 20.8541 19.8199 20.7899 19.6824 20.6524L18.7658 19.7357C18.4999 19.4699 18.4999 19.0299 18.7658 18.7641C19.0316 18.4982 19.4716 18.4982 19.7374 18.7641L20.6541 19.6807C20.9199 19.9466 20.9199 20.3866 20.6541 20.6524C20.5166 20.7899 20.3424 20.8541 20.1683 20.8541Z"
      fill="white"
    />
    <path
      d="M14.6654 7.10425H7.33203C6.9562 7.10425 6.64453 6.79258 6.64453 6.41675C6.64453 6.04091 6.9562 5.72925 7.33203 5.72925H14.6654C15.0412 5.72925 15.3529 6.04091 15.3529 6.41675C15.3529 6.79258 15.0412 7.10425 14.6654 7.10425Z"
      fill="white"
    />
    <path
      d="M13.75 10.7708H8.25C7.87417 10.7708 7.5625 10.4591 7.5625 10.0833C7.5625 9.70742 7.87417 9.39575 8.25 9.39575H13.75C14.1258 9.39575 14.4375 9.70742 14.4375 10.0833C14.4375 10.4591 14.1258 10.7708 13.75 10.7708Z"
      fill="white"
    />
  </svg>
);

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 18C2 16.46 2 15.69 2.347 15.124C2.541 14.807 2.807 14.541 3.124 14.347C3.689 14 4.46 14 6 14C7.54 14 8.31 14 8.876 14.347C9.193 14.541 9.459 14.807 9.653 15.124C10 15.689 10 16.46 10 18C10 19.54 10 20.31 9.653 20.877C9.459 21.193 9.193 21.459 8.876 21.653C8.311 22 7.54 22 6 22C4.46 22 3.69 22 3.124 21.653C2.80735 21.4593 2.54108 21.1934 2.347 20.877C2 20.31 2 19.54 2 18ZM14 18C14 16.46 14 15.69 14.347 15.124C14.541 14.807 14.807 14.541 15.124 14.347C15.689 14 16.46 14 18 14C19.54 14 20.31 14 20.877 14.347C21.193 14.541 21.459 14.807 21.653 15.124C22 15.689 22 16.46 22 18C22 19.54 22 20.31 21.653 20.877C21.4589 21.1931 21.1931 21.4589 20.877 21.653C20.31 22 19.54 22 18 22C16.46 22 15.69 22 15.124 21.653C14.8073 21.4593 14.5411 21.1934 14.347 20.877C14 20.31 14 19.54 14 18ZM2 6C2 4.46 2 3.69 2.347 3.124C2.541 2.807 2.807 2.541 3.124 2.347C3.689 2 4.46 2 6 2C7.54 2 8.31 2 8.876 2.347C9.193 2.541 9.459 2.807 9.653 3.124C10 3.689 10 4.46 10 6C10 7.54 10 8.31 9.653 8.876C9.459 9.193 9.193 9.459 8.876 9.653C8.311 10 7.54 10 6 10C4.46 10 3.69 10 3.124 9.653C2.80724 9.45904 2.54096 9.19277 2.347 8.876C2 8.311 2 7.54 2 6ZM14 6C14 4.46 14 3.69 14.347 3.124C14.541 2.807 14.807 2.541 15.124 2.347C15.689 2 16.46 2 18 2C19.54 2 20.31 2 20.877 2.347C21.193 2.541 21.459 2.807 21.653 3.124C22 3.689 22 4.46 22 6C22 7.54 22 8.31 21.653 8.876C21.459 9.193 21.193 9.459 20.877 9.653C20.31 10 19.54 10 18 10C16.46 10 15.69 10 15.124 9.653C14.8072 9.45904 14.541 9.19277 14.347 8.876C14 8.311 14 7.54 14 6Z"
      stroke="#979797"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 18C4 16.9391 4.42143 15.9217 5.17157 15.1716C5.92172 14.4214 6.93913 14 8 14H16C17.0609 14 18.0783 14.4214 18.8284 15.1716C19.5786 15.9217 20 16.9391 20 18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18Z"
      stroke="#979797"
      strokeLinejoin="round"
    />
    <path
      d="M12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10Z"
      stroke="#979797"
    />
  </svg>
);

const MessagesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.9987 20.9091C10.3662 20.9091 9.77036 20.5883 9.3487 20.0291L7.9737 18.1958C7.9462 18.1591 7.8362 18.1133 7.79036 18.1041H7.33203C3.50953 18.1041 1.14453 17.0683 1.14453 11.9166V7.33325C1.14453 3.28159 3.28036 1.14575 7.33203 1.14575H14.6654C18.717 1.14575 20.8529 3.28159 20.8529 7.33325V11.9166C20.8529 15.9683 18.717 18.1041 14.6654 18.1041H14.207C14.1337 18.1041 14.0695 18.1408 14.0237 18.1958L12.6487 20.0291C12.227 20.5883 11.6312 20.9091 10.9987 20.9091ZM7.33203 2.52075C4.05036 2.52075 2.51953 4.05159 2.51953 7.33325V11.9166C2.51953 16.0599 3.94036 16.7291 7.33203 16.7291H7.79036C8.25786 16.7291 8.78953 16.9949 9.0737 17.3708L10.4487 19.2041C10.7695 19.6258 11.2279 19.6258 11.5487 19.2041L12.9237 17.3708C13.2262 16.9674 13.7029 16.7291 14.207 16.7291H14.6654C17.947 16.7291 19.4779 15.1983 19.4779 11.9166V7.33325C19.4779 4.05159 17.947 2.52075 14.6654 2.52075H7.33203Z"
      fill="#888888"
    />
    <path
      d="M15.5846 8.02075H6.41797C6.04214 8.02075 5.73047 7.70908 5.73047 7.33325C5.73047 6.95742 6.04214 6.64575 6.41797 6.64575H15.5846C15.9605 6.64575 16.2721 6.95742 16.2721 7.33325C16.2721 7.70908 15.9605 8.02075 15.5846 8.02075Z"
      fill="#888888"
    />
    <path
      d="M11.918 12.6042H6.41797C6.04214 12.6042 5.73047 12.2926 5.73047 11.9167C5.73047 11.5409 6.04214 11.2292 6.41797 11.2292H11.918C12.2938 11.2292 12.6055 11.5409 12.6055 11.9167C12.6055 12.2926 12.2938 12.6042 11.918 12.6042Z"
      fill="#888888"
    />
  </svg>
);

const ReportsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.42 11.75H16C15.59 11.75 15.25 11.41 15.25 11V4.01C15.25 3.27 15.54 2.58 16.06 2.06C16.58 1.54 17.27 1.25 18.01 1.25H18.02C19.27 1.26 20.45 1.75 21.35 2.64C22.25 3.55 22.74 4.75 22.74 6V8.42C22.75 10.41 21.41 11.75 19.42 11.75ZM16.75 10.25H19.42C20.58 10.25 21.25 9.58 21.25 8.42V6C21.25 5.14 20.91 4.32 20.3 3.7C19.69 3.1 18.88 2.76 18.02 2.75C18.02 2.75 18.02 2.75 18.01 2.75C17.68 2.75 17.36 2.88 17.12 3.12C16.88 3.36 16.75 3.67 16.75 4.01V10.25Z"
      fill="#888888"
    />
    <path
      d="M8.9978 23.33C8.5278 23.33 8.08781 23.15 7.75781 22.81L6.09778 21.14C6.00778 21.05 5.86782 21.04 5.76782 21.12L4.0578 22.4C3.5278 22.8 2.82778 22.87 2.22778 22.57C1.62778 22.27 1.25781 21.67 1.25781 21V6C1.25781 2.98 2.98781 1.25 6.00781 1.25H18.0078C18.4178 1.25 18.7578 1.59 18.7578 2C18.7578 2.41 18.4178 2.75 18.0078 2.75C17.3178 2.75 16.7578 3.31 16.7578 4V21C16.7578 21.67 16.3878 22.27 15.7878 22.57C15.1978 22.87 14.4878 22.8 13.9578 22.4L12.2478 21.12C12.1478 21.04 12.0078 21.06 11.9278 21.14L10.2478 22.82C9.9078 23.15 9.4678 23.33 8.9978 23.33ZM5.90778 19.57C6.36778 19.57 6.81778 19.74 7.15778 20.09L8.81781 21.76C8.87781 21.82 8.9578 21.83 8.9978 21.83C9.0378 21.83 9.1178 21.82 9.1778 21.76L10.8578 20.08C11.4778 19.46 12.4578 19.4 13.1478 19.93L14.8478 21.2C14.9578 21.28 15.0578 21.25 15.1078 21.22C15.1578 21.19 15.2478 21.13 15.2478 21V4C15.2478 3.55 15.3578 3.12 15.5478 2.75H5.9978C3.7778 2.75 2.7478 3.78 2.7478 6V21C2.7478 21.14 2.83782 21.2 2.88782 21.23C2.94782 21.26 3.04783 21.28 3.14783 21.2L4.85779 19.92C5.16779 19.69 5.53778 19.57 5.90778 19.57Z"
      fill="#888888"
    />
    <path
      d="M12 9.75H6C5.59 9.75 5.25 9.41 5.25 9C5.25 8.59 5.59 8.25 6 8.25H12C12.41 8.25 12.75 8.59 12.75 9C12.75 9.41 12.41 9.75 12 9.75Z"
      fill="#888888"
    />
    <path
      d="M11.25 13.75H6.75C6.34 13.75 6 13.41 6 13C6 12.59 6.34 12.25 6.75 12.25H11.25C11.66 12.25 12 12.59 12 13C12 13.41 11.66 13.75 11.25 13.75Z"
      fill="#888888"
    />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2206_28545)">
      <path
        d="M12 15.75C9.93 15.75 8.25 14.07 8.25 12C8.25 9.93 9.93 8.25 12 8.25C14.07 8.25 15.75 9.93 15.75 12C15.75 14.07 14.07 15.75 12 15.75ZM12 9.75C10.76 9.75 9.75 10.76 9.75 12C9.75 13.24 10.76 14.25 12 14.25C13.24 14.25 14.25 13.24 14.25 12C14.25 10.76 13.24 9.75 12 9.75Z"
        fill="#888888"
      />
      <path
        d="M15.21 22.19C15 22.19 14.79 22.16 14.58 22.11C13.96 21.94 13.44 21.55 13.11 21L12.99 20.8C12.4 19.78 11.59 19.78 11 20.8L10.89 20.99C10.56 21.55 10.04 21.95 9.42 22.11C8.79 22.28 8.14 22.19 7.59 21.86L5.87 20.87C5.26 20.52 4.82 19.95 4.63 19.26C4.45 18.57 4.54 17.86 4.89 17.25C5.18 16.74 5.26 16.28 5.09 15.99C4.92 15.7 4.49 15.53 3.9 15.53C2.44 15.53 1.25 14.34 1.25 12.88V11.12C1.25 9.66004 2.44 8.47004 3.9 8.47004C4.49 8.47004 4.92 8.30004 5.09 8.01004C5.26 7.72004 5.19 7.26004 4.89 6.75004C4.54 6.14004 4.45 5.42004 4.63 4.74004C4.81 4.05004 5.25 3.48004 5.87 3.13004L7.6 2.14004C8.73 1.47004 10.22 1.86004 10.9 3.01004L11.02 3.21004C11.61 4.23004 12.42 4.23004 13.01 3.21004L13.12 3.02004C13.8 1.86004 15.29 1.47004 16.43 2.15004L18.15 3.14004C18.76 3.49004 19.2 4.06004 19.39 4.75004C19.57 5.44004 19.48 6.15004 19.13 6.76004C18.84 7.27004 18.76 7.73004 18.93 8.02004C19.1 8.31004 19.53 8.48004 20.12 8.48004C21.58 8.48004 22.77 9.67004 22.77 11.13V12.89C22.77 14.35 21.58 15.54 20.12 15.54C19.53 15.54 19.1 15.71 18.93 16C18.76 16.29 18.83 16.75 19.13 17.26C19.48 17.87 19.58 18.59 19.39 19.27C19.21 19.96 18.77 20.53 18.15 20.88L16.42 21.87C16.04 22.08 15.63 22.19 15.21 22.19ZM12 18.49C12.89 18.49 13.72 19.05 14.29 20.04L14.4 20.23C14.52 20.44 14.72 20.59 14.96 20.65C15.2 20.71 15.44 20.68 15.64 20.56L17.37 19.56C17.63 19.41 17.83 19.16 17.91 18.86C17.99 18.56 17.95 18.25 17.8 17.99C17.23 17.01 17.16 16 17.6 15.23C18.04 14.46 18.95 14.02 20.09 14.02C20.73 14.02 21.24 13.51 21.24 12.87V11.11C21.24 10.48 20.73 9.96004 20.09 9.96004C18.95 9.96004 18.04 9.52004 17.6 8.75004C17.16 7.98004 17.23 6.97004 17.8 5.99004C17.95 5.73004 17.99 5.42004 17.91 5.12004C17.83 4.82004 17.64 4.58004 17.38 4.42004L15.65 3.43004C15.22 3.17004 14.65 3.32004 14.39 3.76004L14.28 3.95004C13.71 4.94004 12.88 5.50004 11.99 5.50004C11.1 5.50004 10.27 4.94004 9.7 3.95004L9.59 3.75004C9.34 3.33004 8.78 3.18004 8.35 3.43004L6.62 4.43004C6.36 4.58004 6.16 4.83004 6.08 5.13004C6 5.43004 6.04 5.74004 6.19 6.00004C6.76 6.98004 6.83 7.99004 6.39 8.76004C5.95 9.53004 5.04 9.97004 3.9 9.97004C3.26 9.97004 2.75 10.48 2.75 11.12V12.88C2.75 13.51 3.26 14.03 3.9 14.03C5.04 14.03 5.95 14.47 6.39 15.24C6.83 16.01 6.76 17.02 6.19 18C6.04 18.26 6 18.57 6.08 18.87C6.16 19.17 6.35 19.41 6.61 19.57L8.34 20.56C8.55 20.69 8.8 20.72 9.03 20.66C9.27 20.6 9.47 20.44 9.6 20.23L9.71 20.04C10.28 19.06 11.11 18.49 12 18.49Z"
        fill="#888888"
      />
    </g>
    <defs>
      <clipPath id="clip0_2206_28545">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { latestNotif } = useNotifications();
  const pathname = usePathname();
  const isMessagesPage = pathname === "/admin/messages";
  const handleLogout = useLogout();

  const hasUnread = !!latestNotif;

  // Effect to grab the header content from the page
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const headerElement = document.getElementById("page-header-content");
      if (headerElement) {
        setHeaderContent(headerElement.innerHTML);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <NotificationProvider>
      <PageHeaderProvider>
        <div className="flex min-h-screen font-sans bg-[#FBFBFB]">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-[232px] bg-[#111111] text-white flex flex-col transform transition-transform duration-300 md:translate-x-0 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6 flex items-center justify-between md:justify-start">
              <Image
                src="/adminLogo.svg"
                width={100}
                height={100}
                alt="Rentam360 Logo"
              />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-white p-2 rounded-full hover:bg-[#232323]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <NavItem
                  href="/admin"
                  icon={DashboardIcon}
                  label="Dashboard"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <NavItem
                  href="/admin/users"
                  icon={UsersIcon}
                  label="Users"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <NavItem
                  href="/admin/messages"
                  icon={MessagesIcon}
                  label="Messages"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <NavItem
                  href="/admin/reports"
                  icon={ReportsIcon}
                  label="Reports"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <NavItem
                  href="/admin/settings"
                  icon={SettingsIcon}
                  label="Settings"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <NavItem
                  href="/admin/transactions"
                  icon={TransactionsIcon}
                  label="Transactions"
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </Suspense>
            </nav>

            <div className="p-4 border-t border-gray-800 mt-auto">
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-3"
              >
                <LogOut className="w-4 text-red-300 h-4" />
                <div>
                  <p className="text-sm text-gray-300">Logout</p>
                </div>
              </div>
            </div>
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 bg-opacity-40 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-x-hidden md:ml-[232px]">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white sticky top-0 z-20">
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 rounded-full hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5 text-gray-700" />
                  </button>
                  <div
                    className="hidden sm:block"
                    dangerouslySetInnerHTML={{
                      __html: headerContent as string,
                    }}
                  />
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 relative transition-all hover:bg-gray-50"
                      onClick={() => setOpen(!open)}
                    >
                      <Bell className="h-5 w-5 text-gray-500" />

                      {hasUnread && (
                        <span className="absolute right-2 top-2 h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                        </span>
                      )}
                    </Button>

                    {open && (
                      <div className="fixed inset-0 z-50">
                        <div
                          className="absolute inset-0 bg-black/10"
                          onClick={() => setOpen(false)}
                        />
                        <div className="absolute right-4 top-16 w-80 md:w-96 bg-white shadow-xl border border-gray-100 rounded-lg z-50 animate-in fade-in zoom-in duration-200">
                          <div className="overflow-y-auto max-h-[70vh] p-2">
                            {/* Reuse your existing dropdown component */}
                            <NotificationsDropdown />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-[180px] md:w-[250px] shadow-none pl-9 rounded-lg border border-[#EAEAEA]"
                    />
                  </div> */}
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main
              className={`flex-1 p-2 ${!isMessagesPage ? "md:p-6" : "px-4"}`}
            >
              {children}
            </main>
          </div>
        </div>
      </PageHeaderProvider>
    </NotificationProvider>
  );
}

// Component for navigation items
function NavItem({
  icon: Icon,
  label,
  href,
  setIsSidebarOpen,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link href={href} onClick={() => setIsSidebarOpen(false)} className="block">
      <div
        className={`flex items-center gap-3 py-2 px-3 rounded-md mb-1 cursor-pointer transition-colors ${
          isActive
            ? "bg-[#232323] text-white"
            : "hover:bg-[#232323] text-gray-300"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
