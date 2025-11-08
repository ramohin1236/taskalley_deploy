const RadioFilter = ({ options, selectedOption, onChange, name }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Custom Radio Button */}
          <div className="relative">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only" 
            />
            <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
              selectedOption === option.id 
                ? 'border-[#115e59] bg-[#115e59]' 
                : 'border-gray-300 group-hover:border-[#115e59]'
            }`}>
              {selectedOption === option.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
          <span className={`transition-colors ${
            selectedOption === option.id 
              ? 'text-[#115e59] font-medium' 
              : 'text-gray-700 group-hover:text-[#115e59]'
          }`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioFilter;