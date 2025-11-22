"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGetAllTasksQuery } from '@/lib/features/task/taskApi';

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Fetch all tasks without filters
  const { data, isLoading, error } = useGetAllTasksQuery({
    page: 1,
    limit: 100,
  });

  const tasks = data?.data?.result || [];

  // Prepare markers data - useMemo to prevent unnecessary recalculations
  const tasksWithLocation = React.useMemo(() => {
    return tasks
      .map((task) => {
        const coords = task.location?.coordinates || [];
        if (!coords || coords.length < 2) return null;
        const lng = Number(coords[0]);
        const lat = Number(coords[1]);
        if (!isFinite(lat) || !isFinite(lng)) return null;

        return {
          lat,
          lng,
          title: task.title,
          budget: task.budget,
          category: task.category?.name,
          address: task.address,
          city: task.city,
          id: task._id,
          status: task.status,
        };
      })
      .filter(Boolean);
  }, [tasks]);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    if (document.querySelector('script[src*="googleapis"]')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error('Failed to load Google Maps script');
    document.head.appendChild(script);
  }, []);

  // Create custom yellow pin icon
  const createYellowPinIcon = () => {
    return {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2C12.268 2 6 8.268 6 16C6 28 20 38 20 38C20 38 34 28 34 16C34 8.268 27.732 2 20 2Z" fill="#FBBF24"/>
          <path d="M20 22C23.3137 22 26 19.3137 26 16C26 12.6863 23.3137 10 20 10C16.6863 10 14 12.6863 14 16C14 19.3137 16.6863 22 20 22Z" fill="#FFFFFF"/>
          <path d="M20 38C20 38 34 28 34 16C34 8.268 27.732 2 20 2C12.268 2 6 8.268 6 16C6 28 20 38 20 38Z" stroke="#D97706" stroke-width="1"/>
        </svg>
      `),
      scaledSize: { width: 40, height: 40 },
      anchor: { x: 20, y: 40 }
    };
  };

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) return;

    const google = window.google;
    
    // Calculate bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Set default center if no tasks with location
    const defaultCenter = tasksWithLocation.length > 0 
      ? { lat: tasksWithLocation[0].lat, lng: tasksWithLocation[0].lng }
      : { lat: 23.8103, lng: 90.4125 };

    // Initialize map
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 10,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }]
        }
      ]
    });

    // Initialize info window
    const infoWindowInstance = new google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
    setMap(mapInstance);

    // Add markers to map
    const newMarkers = tasksWithLocation.map((task) => {
      const position = { lat: task.lat, lng: task.lng };
      
      // Extend bounds to include this marker
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position: position,
        map: mapInstance,
        title: task.title,
        icon: createYellowPinIcon(),
      });

      // Create info window content
      const content = `
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-gray-900 text-sm">${task.title}</h3>
          ${task.category ? `<p class="text-xs text-gray-600 mt-1">Category: ${task.category}</p>` : ''}
          ${task.budget ? `<p class="text-sm text-green-600 font-medium mt-1">Budget: ₦${task.budget}</p>` : ''}
          ${task.address ? `<p class="text-xs text-gray-500 mt-1">📍 ${task.address}</p>` : ''}
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs px-2 py-1 rounded ${
              task.status === 'OPEN_FOR_BID' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }">
              ${task.status === 'OPEN_FOR_BID' ? 'Open for Bid' : 'In Progress'}
            </span>
            <a href="/browseservice/${task.id}" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View Details →
            </a>
          </div>
        </div>
      `;

      // Add click listener to marker
      marker.addListener('click', () => {
        infoWindowInstance.setContent(content);
        infoWindowInstance.open(mapInstance, marker);
      });

      return marker;
    });

    // Fit map to show all markers
    if (tasksWithLocation.length > 0) {
      mapInstance.fitBounds(bounds);
      
      // Add some padding
      if (tasksWithLocation.length === 1) {
        mapInstance.setZoom(14);
      }
    }

    setMarkers(newMarkers);
  }, [tasksWithLocation]);

  // Load script on component mount
  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  // Initialize map when script is loaded
  useEffect(() => {
    if (isScriptLoaded) {
      initializeMap();
    }
  }, [isScriptLoaded, initializeMap]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
    };
  }, [markers]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load map data</p>
          <p className="text-sm text-red-500 mt-1">Please check your internet connection</p>
        </div>
      </div>
    );
  }

  if (!tasksWithLocation.length) {
    return (
      <div className="w-full h-full bg-yellow-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-600">No tasks with location data found</p>
          <p className="text-sm text-yellow-500 mt-1">Tasks need location coordinates to appear on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[500px]"
      />
      
      {/* Map Legend */}
      <div className="bg-white p-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#FBBF24"/>
                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="white"/>
              </svg>
            </div>
            <span className="text-sm text-gray-600">
              Task Locations ({tasksWithLocation.length})
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Click on pins for details
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;