import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import client from "../../../public/client.png";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { TbDiscount } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";

const sidebarLinks = [
  { name: "Profile Info", href: "/profile_info", icon: <CgProfile /> },
  {
    name: "Notifications",
    href: "/notifications",
    icon: <IoIosNotifications />,
  },
  { name: "My Transactions", href: "/transaction", icon: <FaMoneyBillTransfer /> },
  { name: "Manage Account", href: "/manage_account_task_poster", icon: <MdManageAccounts /> },
  {
    name: "Security Settings",
    href: "/security_settings",
    icon: <IoIosSettings />,
  },
  { name: "Referrals & Discounts", href: "/refer_discounts", icon: <TbDiscount /> },
  // { name: "Home", href: "/", icon: <FaHome /> },
];

const ProfileSideNav = ({ open, onClose }) => {
  const pathname = usePathname();

  // Function to determine if link is active and return appropriate classes
  const getLinkClass = (href) => {
    const isActive = pathname === href;
    
    return isActive
      ? "group px-3 py-4 flex items-center gap-3 rounded-lg bg-[#115E59] text-white font-semibold transition w-64 shadow-md"
      : "group px-3 py-4 flex items-center gap-3 rounded-lg border border-[#b8d3cd] text-[#115E59] font-medium hover:bg-[#115E59] hover:text-white transition w-64";
  };

  // Function to get icon color based on active state
  const getIconClass = (href) => {
    const isActive = pathname === href;
    return isActive ? "text-white" : "group-hover:text-white";
  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 min-h-full rounded-l-lg bg-[#E6F4F1] shadow-lg z-40 transform transition-transform duration-300 w-80 mt-20 md:mt-20 lg:mt-0
               ${
                 open ? "translate-x-0" : "-translate-x-full"
               } md:translate-x-0`}
    >
      <div className="flex flex-col items-center py-6 gap-2">
        {/* Profile Image */}
        <Image
          src={client}
          alt="profile"
          width={80}
          height={80}
          className="rounded-full shadow"
        />
        <h2 className="font-semibold text-gray-800">Wade Warren</h2>
        <p className="text-xs text-gray-600">Task Provider</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={getLinkClass(link.href)}
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          >
            <span className={getIconClass(link.href)}>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default ProfileSideNav;