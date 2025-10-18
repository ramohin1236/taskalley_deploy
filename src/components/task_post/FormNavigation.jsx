import React from "react";

const FormNavigation = ({ 
  onPrevious, 
  onNext, 
  currentStep, 
  totalSteps,
  handleSubmit,
  previousLabel = "Previous",
  nextLabel = "Next",
  finalLabel = "Submit",
  disablePrevious = false,
  className = ""
}) => (
  <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200 ${className}`}>
    <button

      onClick={onPrevious}
      disabled={currentStep === 0 || disablePrevious}
      className={`
        px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto order-2 sm:order-1
        ${currentStep === 0 || disablePrevious
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200  ' 
          : 'bg-white cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      {previousLabel}
    </button>

    <button
      // onClick={onNext}
      onClick={handleSubmit}
      className="bg-[#115E59] hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto order-1 sm:order-2 cursor-pointer"
    >
      {currentStep === totalSteps - 1 ? finalLabel : nextLabel}
    </button>
  </div>
);

export default FormNavigation;
