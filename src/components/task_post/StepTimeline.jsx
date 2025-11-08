import React from "react";

const StepTimeline = ({ 
  steps, 
  currentStep, 
  className = ""
}) => (
  <div className="hidden lg:block w-64 flex-shrink-0 className">
    <div className={`bg-white rounded-lg p-6 sticky top-6 `}>
      <div className="space-y-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3 relative">
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-8 w-px h-10 bg-gray-300"></div>
            )}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium relative z-10 flex-shrink-0
                ${index < currentStep 
                  ? 'bg-[#115E59] text-white' 
                  : index === currentStep
                    ? 'bg-[#115E59] text-white'
                    : 'bg-gray-400 text-white'
                }
              `}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`
                  text-sm font-medium leading-tight
                  ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                {step.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StepTimeline;
