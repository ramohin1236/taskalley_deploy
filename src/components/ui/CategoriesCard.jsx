import Image from "next/image";
import React from "react";



const CategoriesCard = ({
  item,
  icon,
  title,
  subtitle,
  containerStyle = "",
  titleStyle = "",
  subtitleStyle = "",
}) => {
  const displayIcon = item?.category_image || icon;
  const displayTitle = item?.name || title || "Category";
  const displaySubtitle =
    subtitle ??
    item?.providers ??
    (typeof item?.totalTask === "number"
      ? `${item.totalTask || 0} task`
      : null);

  return (
    <div
      className={`border-2 border-[#115E59] rounded-lg p-4 flex items-center hover:shadow-lg transition transform duration-300 hover:scale-105 cursor-pointer pl-8 py-8 gap-4 ${containerStyle}`}
    >
      <div>
        {displayIcon ? (
          <Image
            src={displayIcon}
            alt={displayTitle}
            height={60}
            width={60}
          />
        ) : (
          <div className="h-[60px] w-[60px] rounded-full bg-gray-100" />
        )}
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <h5
          className={`text-[#1F2937] text-xl font-semibold ${titleStyle}`}
        >
          {displayTitle}
        </h5>
        {displaySubtitle && (
          <p className={`text-[#6B7280] text-md ${subtitleStyle}`}>
            {displaySubtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoriesCard