import React from 'react'
import { FaFilePdf, FaImage, FaVideo } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";


const Chatfiles = ({removeSelectedFile,selectedFiles, setSelectedFiles}) => {
  return (
    <div>
         <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Attached files:</span>
                  <button 
                    onClick={() => setSelectedFiles({ image: null, video: null, pdf: null })}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.image && (
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <FaImage className="text-blue-500 text-sm" />
                      <span className="text-xs truncate max-w-[100px]">{selectedFiles.image.name}</span>
                      <button onClick={() => removeSelectedFile('image')} className="ml-1">
                        <FaTimes className="text-red-500 text-xs" />
                      </button>
                    </div>
                  )}
                  {selectedFiles.video && (
                    <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                      <FaVideo className="text-red-500 text-sm" />
                      <span className="text-xs truncate max-w-[100px]">{selectedFiles.video.name}</span>
                      <button onClick={() => removeSelectedFile('video')} className="ml-1">
                        <FaTimes className="text-red-500 text-xs" />
                      </button>
                    </div>
                  )}
                  {selectedFiles.pdf && (
                    <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                      <FaFilePdf className="text-red-600 text-sm" />
                      <span className="text-xs truncate max-w-[100px]">{selectedFiles.pdf.name}</span>
                      <button onClick={() => removeSelectedFile('pdf')} className="ml-1">
                        <FaTimes className="text-red-500 text-xs" />
                      </button>
                    </div>
                  )}
                </div>
    </div>
  )
}

export default Chatfiles