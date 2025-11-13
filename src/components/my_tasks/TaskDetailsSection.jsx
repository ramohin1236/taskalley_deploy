import React from "react";

const TaskDetailsSection = ({ description }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold">Details</p>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default TaskDetailsSection;