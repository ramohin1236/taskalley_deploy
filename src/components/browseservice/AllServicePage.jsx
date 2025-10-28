import React from "react";
import { LuMapPin } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoTimerOutline } from "react-icons/io5";
import ServiceCard from "@/components/browseservice/ServiceCard";
import userImage from "../../../public/task_img.png";
import Link from "next/link";

const taskData = [
  {
    id: 1,
    userImaage: userImage,
    serviceName: "Help move a couch",
    category: "gardening",
    userName: "Marvin Fey",
    mapIcon: <LuMapPin />,
    place: "Los Angeles CA 90024",
    calenderIcon: <SlCalender />,
    city: "New York, USA",
    monthIcon: <IoTimerOutline />,
    month: "15 May 2020 8.00am",
    open: "open",
    close: "close",
    price: "₦24.00",
  },
  {
    id: 2,
    userImaage: userImage,
    serviceName: "Help move a couch",
    category: "gardening",
    userName: "Marvin Fey",
    mapIcon: <LuMapPin />,
    place: "Los Angeles CA 90024",
    calenderIcon: <SlCalender />,
    city: "New York, USA",
    monthIcon: <IoTimerOutline />,
    month: "15 May 2020 8.00am",
    open: "open",
    close: "close",
    price: "₦24.00",
  },
  {
    id: 3,
    userImaage: userImage,
    serviceName: "Help move a couch",
    category: "gardening",
    userName: "Marvin Fey",
    mapIcon: <LuMapPin />,
    place: "Los Angeles CA 90024",
    calenderIcon: <SlCalender />,
    city: "New York, USA",
    monthIcon: <IoTimerOutline />,
    month: "15 May 2020 8.00am",
    open: "open",
    close: "close",
    price: "₦24.00",
  },
  {
    id: 4,
    userImaage: userImage,
    serviceName: "Help move a couch",
    category: "gardening",
    userName: "Marvin Fey",
    mapIcon: <LuMapPin />,
    place: "Los Angeles CA 90024",
    calenderIcon: <SlCalender />,
    city: "New York, USA",
    monthIcon: <IoTimerOutline />,
    month: "15 May 2020 8.00am",
    open: "open",
    close: "close",
    price: "₦24.00",
  },
  {
    id: 5,
    userImaage: userImage,
    serviceName: "Help move a couch",
    category: "gardening",
    userName: "Marvin Fey",
    mapIcon: <LuMapPin />,
    place: "Los Angeles CA 90024",
    calenderIcon: <SlCalender />,
    city: "New York, USA",
    monthIcon: <IoTimerOutline />,
    month: "15 May 2020 8.00am",
    open: "open",
    close: "close",
    price: "₦24.00",
  },
];

const AllServicePage = () => {
  return (
    <div>
      <div className="w-full pl-4 md:w-[350px] lg:w-[500px] flex flex-col gap-4 ">
        {taskData.slice(0, 3).map((data, index) => (
          <li key={index} style={{ listStyle: "none" }}>
            <Link
              href={{pathname: `/browseservice/${data.id}`}}
            >
              <ServiceCard data={data} />
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
};

export default AllServicePage;
