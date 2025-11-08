import React from "react";
import GoogleMap from "@/components/browseservice/GoogleMap";


const BrowseService = () => {
  return (
    <div >
      {/* filter head */}
        
      {/* card and map */}
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full h-96 md:h-[800px] ">
          <GoogleMap />
        </div>
      </div>
    </div>
  );
};

export default BrowseService;
