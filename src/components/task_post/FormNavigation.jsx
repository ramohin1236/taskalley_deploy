const FormNavigation = ({ 
  onPrevious, 
  onNext, 
  currentStep, 
  totalSteps, 
  finalLabel, 
  handleSubmit,
  disabled = false 
}) => (
  <div className="flex justify-between mt-8">
    <button
      onClick={onPrevious}
      disabled={currentStep === 0 || disabled}
      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
    >
      Previous
    </button>
    
    {currentStep === totalSteps - 1 ? (
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="px-6 py-2 bg-[#115E59] text-white rounded-lg disabled:opacity-50"
      >
        {finalLabel}
      </button>
    ) : (
      <button
        onClick={onNext}
        disabled={disabled}
        className="px-6 py-2 bg-[#115E59] text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    )}
  </div>
);

export default FormNavigation;