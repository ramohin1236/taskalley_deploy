import React from "react";
import { Calendar, MapPin, MessageCircle, User } from "lucide-react";

const TaskInfoSection = ({ assignedTo, location, dateLabel }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between">
      {/* left side */}
      <div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <User className="w-4 md:w-6 h-4 md:h-6 text-[#115E59]" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold"> Assigned To</p>
            <p className="text-[#6B7280] text-sm">{assignedTo || "Not assigned"}</p>
          </div>
        </div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
            <MapPin className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold"> Location</p>
            <p className="text-[#6B7280] text-sm">{location || "Location not specified"}</p>
          </div>
        </div>
        <div className="flex mt-8 items-center gap-3">
          <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3 ">
            <Calendar className="text-[#115E59] text-sm md:text-xl" />
          </div>
          <div>
            <p className="text-base md:text-xl font-semibold">To Be Done On</p>
            <p className="text-[#6B7280] text-sm">{dateLabel || "Schedule not set"}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <button className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-12">
          <MessageCircle className="w-4 h-4" />
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default TaskInfoSection;