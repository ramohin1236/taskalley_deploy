

const CheckboxFilter = ({ options, selectedOptions, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="checkbox"
             
            checked={selectedOptions.includes(option.id)}
            onChange={() => onChange(option.id)}
            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 "
          />
          <span className="text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxFilter;
