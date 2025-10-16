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
import { FaHome } from "react-icons/fa";

const sidebarLinks = [
  { name: "Profile Info", href: "/service_profile_info", icon: <CgProfile /> },
  {
    name: "Notifications",
    href: "/service_provider_notification",
    icon: <IoIosNotifications />,
  },
  { name: "Linked Account", href: "/linked_account", icon: <FaMoneyBillTransfer /> },
  { name: "Earning", href: "/earning", icon: <FaMoneyBillTransfer /> },
  {
    name: "Security Settings",
    href: "/service_security",
    icon: <IoIosSettings />,
  },
  { name: "Referrals & Discounts", href: "/service_discount", icon: <TbDiscount /> },
  { name: "Home", href: "/", icon: <FaHome /> },
];

const ServiceProvideSideNav = ({ open, onClose }) => {
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
      className={`fixed md:relative top-0 left-0 min-h-full rounded-l-lg bg-[#E6F4F1] shadow-lg z-40 transform transition-transform duration-300
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
        <p className="text-xs text-gray-600">Manage Account</p>
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

export default ServiceProvideSideNav;