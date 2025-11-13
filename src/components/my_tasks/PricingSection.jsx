import React from "react";

const PricingSection = ({ budget, discountPercent = 0 }) => {
  const discountAmount = ((Number(budget) || 0) * discountPercent) / 100;
  const offeredPrice = (Number(budget) || 0) - discountAmount;

  return (
    <div className="flex flex-col gap-4 border-b-2 border-[#dedfe2] pb-4">
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold">Offered Price</p>
        <p className="text-base text-[#6B7280]">₦ {offeredPrice}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold">Discount ({discountPercent}%)</p>
        <p className="text-base text-[#6B7280]">₦ {discountAmount}</p>
      </div>
    </div>
  );
};

export default PricingSection;