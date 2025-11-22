'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const LocationSearch = ({ 
  value = '', 
  onChange, 
  onSelect,
  placeholder = "Search for your location...",
  required = false 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    libraries,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePlaceSelect = (place) => {
    if (!place) return;
    
    const address = place.formatted_address;
    setInputValue(address);
    
    // Get coordinates from place geometry
    const coordinates = place.geometry?.location 
      ? [place.geometry.location.lng(), place.geometry.location.lat()]
      : null;

    // Get city name from address components
    let city = "";
    if (place.address_components) {
      const cityComponent = place.address_components.find(component =>
        component.types.includes('locality')
      );
      city = cityComponent?.long_name || "";
    }

    // Call onChange with address only
    onChange?.(address);
    
    // Call onSelect with complete location data
    onSelect?.({
      address,
      coordinates,
      city,
      placeId: place.place_id
    });
  };

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      handlePlaceSelect(place);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (!newValue.trim()) {
      onChange?.('');
      onSelect?.(null);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue('');
    onChange?.('');
    onSelect?.(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isLoaded) {
    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Loading maps..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            disabled
          />
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            // componentRestrictions: { country: 'ng' },
            fields: ['formatted_address', 'geometry', 'name', 'place_id', 'address_components'],
            types: ['establishment', 'geocode']
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoComplete="off"
          />
        </Autocomplete>
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;