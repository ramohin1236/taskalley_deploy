// components/BidCard.jsx
import Image from "next/image";
import Link from "next/link";

const BidCard = ({ task }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      OPEN_FOR_BID: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      DISPUTE: "bg-orange-100 text-orange-800",
      LATE: "bg-red-100 text-red-800",
      bidMade: "bg-purple-100 text-purple-800",
      bidReceived: "bg-indigo-100 text-indigo-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span
          className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        {task.customer?.profile_image ? (
          <Image
            src={task.customer.profile_image}
            alt={task.customer.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {task.customer?.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{task.customer?.name}</p>
          <p className="text-sm text-gray-500">{task.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Budget</p>
          <p className="font-semibold text-gray-900">₦ {task.budget}</p>
        </div>
        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-semibold text-gray-900">{task.category?.name}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-semibold text-gray-900">
            {formatDate(task.preferredDate)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Time</p>
          <p className="font-semibold text-gray-900">
            {formatTime(task.preferredTime)}
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Total Offers: {task.totalOffer || 0}</span>
        </div>
        {/* <Link
          href={`/task/${task._id}`}
          className="px-4 py-2 bg-[#115e59] text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link> */}
      </div>
    </div>
  );
};

export default BidCard;