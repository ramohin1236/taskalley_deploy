"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useGetMessagesQuery } from "@/lib/features/chatApi/chatApi";
import { useSocketContext } from "@/app/context/SocketProvider";
import { useAuth } from "@/components/auth/useAuth";
import { format } from "date-fns";
import { FaFilePdf, FaImage, FaVideo } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useUploadConversationFilesMutation } from "@/lib/features/fileApi/fileApi";
import Chatfiles from "@/components/chat/Chatfiles";

const ChatContent = ({ userId }) => {
  const receiverId = usePathname().split("/")[2];
  const [message, setMessage] = useState("");
  console.log("message send====>",message)
  const [selectedFiles, setSelectedFiles] = useState({
    image: null,
    video: null,
    pdfs: null
  });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const {
    data: messageData,
    refetch,
    isLoading,
  } = useGetMessagesQuery({ userId ,limit:9999}, { skip: !userId });

  // File upload API hook
  const [uploadFileMutation] = useUploadConversationFilesMutation();

  const messageDataResult = messageData || [];
  const conversationId = messageDataResult[0]?.conversationId;

  const { sendMessageSoket, seenMessage, onMessageReceivedForUser } = useSocketContext();
  const [isUserSending, setIsUserSending] = useState(false);

  // Save scroll position before refetch
  const saveScrollPosition = () => {
    if (messagesContainerRef.current) {
      scrollPositionRef.current = messagesContainerRef.current.scrollTop;
    }
  };

  // Restore scroll position after refetch
  const restoreScrollPosition = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = scrollPositionRef.current;
      }, 0);
    }
  };

  // Auto-refetch every 1 second for real-time updates
  useEffect(() => {
    if (!receiverId) return;

    const interval = setInterval(() => {
      saveScrollPosition();
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, [receiverId, refetch]);

  // Also listen for socket notifications and refetch faster when notified
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onMessageReceivedForUser(user.id, (data) => {
      console.log("New message notification received:", data);
      saveScrollPosition();
      refetch();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, refetch]);

  // Restore scroll position when messages change
  useEffect(() => {
    restoreScrollPosition();
  }, [messageDataResult]);

  // Mark messages as seen when chat is opened
  useEffect(() => {
    if (conversationId && user?.id) {
      markMessagesAsSeen();
    }
  }, [conversationId, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markMessagesAsSeen = async () => {
    if (!conversationId || !user?.id) return;

    const unseenMessages = messageDataResult.filter(
      (msg) => !msg.seen && !msg.isMyMessage
    );

    if (unseenMessages.length > 0) {
      try {
        const data = {
          conversationId,
          msgByUserId: user.id,
        };
        await seenMessage(data);
        setTimeout(() => refetch(), 300);
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    }
  };

  const handleFileSelect = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 
                                  type === 'video' ? 'video/*' : 
                                  'application/pdf';
      fileInputRef.current.onchange = (e) => handleFileChange(e, type);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error("Please select a video file");
      return;
    }
    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error("Please select a PDF file");
      return;
    }

    // File size validation (optional)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(`File size should be less than 10MB`);
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [type]: file
    }));
    toast.success(`${type.toUpperCase()} file selected`);
  };

  const removeSelectedFile = (type) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: null
    }));
  };

 const uploadFiles = async () => {
  const filesToUpload = Object.values(selectedFiles).filter(file => file !== null);
  if (filesToUpload.length === 0) return { images: [], videos: [], pdfs: [] };

  setUploading(true);
  
  try {
    const uploadedData = {
      images: [],
      videos: [],
      pdfs: []
    };

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append('conversation_image', file);
      
      console.log("Uploading file:", file.name, file.type);
      
      const result = await uploadFileMutation(formData).unwrap();
      
      console.log("API Response:", result);
      
      if (result.success && result.data) {
        // API থেকে images, videos, pdfs আলাদাভাবে পাওয়া যাচ্ছে
        if (result.data.images && result.data.images.length > 0) {
          uploadedData.images.push(...result.data.images);
        }
        if (result.data.videos && result.data.videos.length > 0) {
          uploadedData.videos.push(...result.data.videos);
        }
        if (result.data.pdfs && result.data.pdfs.length > 0) {
          uploadedData.pdfs.push(...result.data.pdfs);
        }
      }
    }

    console.log("Uploaded data:", uploadedData);
    toast.success("Files uploaded successfully");
    return uploadedData;
  } catch (error) {
    console.error("File upload error:", error);
    toast.error("Failed to upload files");
    return { images: [], videos: [], pdfs: [] };
  } finally {
    setUploading(false);
    setSelectedFiles({ image: null, video: null, pdfs: null });
  }
};

 const sendMessage = async () => {
  if (!message.trim() && Object.values(selectedFiles).every(file => file === null)) {
    toast.error("Message cannot be empty");
    return;
  }
  if (!receiverId) {
    toast.error("Unable to identify the recipient.");
    return;
  }

  setIsUserSending(true);

  let uploadedData = { images: [], videos: [], pdfs: [] };
  if (Object.values(selectedFiles).some(file => file !== null)) {
    uploadedData = await uploadFiles();
    console.log("Uploaded data for sending:", uploadedData);
    
    // Check if any file was actually uploaded
    const totalUploaded = uploadedData.images.length + uploadedData.videos.length + uploadedData.pdfs.length;
    if (totalUploaded === 0 && !message.trim()) {
      toast.error("No files uploaded successfully");
      setIsUserSending(false);
      return;
    }
  }

  const data = {
    text: message,
    imageUrl: uploadedData.images || [],
    pdfUrl: uploadedData.pdfs || [],
    videoUrl: uploadedData.videos || [],
    receiver: receiverId,
  };

  console.log("Final message data to send:", data);

  try {
   const res = await sendMessageSoket(data);
   console.log("resss",res)
    
    setMessage("");
    setSelectedFiles({ image: null, video: null, pdfs: null });
    
    // Refetch multiple times to ensure message is captured (accounts for API delay)
    // Save scroll position before refetching
    setTimeout(() => {
      saveScrollPosition();
      refetch();
    }, 200);
    setTimeout(() => {
      saveScrollPosition();
      refetch();
    }, 500);
    setTimeout(() => {
      saveScrollPosition();
      refetch();
      setIsUserSending(false);
      // Focus back to message input after refetch completes
      setTimeout(() => {
        const messageInput = document.querySelector('input[placeholder="Type a message..."]');
        if (messageInput) messageInput.focus();
      }, 50);
    }, 800);
  } catch (error) {
    toast.error("Failed to send message");
    console.error("Send message error:", error);
    setIsUserSending(false);
  }
};

  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return format(date, "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const formatMessageDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "";
    }
  };

  const renderMediaContent = (message) => {
    const hasImage = message.imageUrl?.some((url) => url && url.trim() !== "");
    const hasVideo = message.videoUrl?.some((url) => url && url.trim() !== "");
    const hasPdf = message.pdfUrl?.some((url) => url && url.trim() !== "");

    if (!hasImage && !hasVideo && !hasPdf) return null;

    return (
      <div className="mt-2 space-y-2">
        {hasImage && (
          <div className="flex items-center gap-2">
            <FaImage className="text-blue-500" />
            <span className="text-sm text-gray-600">Image</span>
          </div>
        )}
        {hasVideo && (
          <div className="flex items-center gap-2">
            <FaVideo className="text-red-500" />
            <span className="text-sm text-gray-600">Video</span>
          </div>
        )}
        {hasPdf && (
          <div className="flex items-center gap-2">
            <FaFilePdf className="text-red-600" />
            <span className="text-sm text-gray-600">PDF Document</span>
          </div>
        )}
      </div>
    );
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messageDataResult.forEach((msg) => {
      const date = formatMessageDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const renderMessageItem = (msg) => {
    const isMyMessage = msg.isMyMessage;
    const userDetails = msg.userDetails;
    const hasMedia = msg.imageUrl?.some((url) => url && url.trim() !== "") ||
      msg.videoUrl?.some((url) => url && url.trim() !== "") ||
      msg.pdfUrl?.some((url) => url && url.trim() !== "");

    return (
      <div
        key={msg._id}
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isMyMessage && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 flex-shrink-0">
              {userDetails?.profile_image && userDetails?.profile_image.trim() !== "" ? (
                <img
                  src={userDetails?.profile_image}
                  alt={userDetails?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/taskalley.svg"
                  alt="TaskAlley Logo"
                  className="w-5 h-5"
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-none">
                <p className="text-gray-800">{msg.text}</p>
                {renderMediaContent(msg)}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                  {msg.seen && (
                    <span className="text-xs text-green-500 ml-2">✓</span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {userDetails?.name}
              </span>
            </div>
          </div>
        )}

        {isMyMessage && (
          <div className="flex flex-col items-end max-w-[80%]">
            <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-tr-none">
              <p>{msg.text}</p>
              {renderMediaContent(msg)}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-green-100">
                  {formatMessageTime(msg.createdAt)}
                </span>
                <span className="text-xs ml-2">
                  {msg.seen ? "✓✓" : "✓"}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {formatMessageTime(msg.createdAt)}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Selected files preview
  const SelectedFilesPreview = () => {
    const hasSelectedFiles = Object.values(selectedFiles).some(file => file !== null);
    if (!hasSelectedFiles) return null;

    return (
      <div className="mb-2 p-2 bg-gray-50 rounded-lg border">
        <Chatfiles
          removeSelectedFile={removeSelectedFile}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />  
     
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[750px] max-w-4xl mx-auto bg-white rounded-lg justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading messages...</p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();
  
  // Get receiver user info from messages
  const receiverUserInfo = messageDataResult.find(msg => !msg.isMyMessage)?.userDetails || 
                          messageDataResult.find(msg => msg.isMyMessage)?.userData || 
                          { name: "User", profile_image: "" };

  return (
    <div className="flex flex-col h-[750px] max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
            {receiverUserInfo?.profile_image && receiverUserInfo?.profile_image.trim() !== "" ? (
              <img
                src={receiverUserInfo?.profile_image}
                alt={receiverUserInfo?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/taskalley.svg"
                alt="TaskAlley Logo"
                className="w-6 h-6"
              />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{receiverUserInfo?.name || "User"}</h2>
            <p className="text-sm text-gray-500">
              {messageDataResult.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiSend className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No messages yet</h3>
            <p className="text-gray-500 mt-2">Start a conversation by sending a message</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="px-4 py-1 bg-gray-200 rounded-full">
                  <span className="text-xs font-medium text-gray-600">
                    {date}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {messages.map(renderMessageItem)}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      <SelectedFilesPreview />

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => handleFileSelect('image')}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Attach image"
              disabled={uploading}
            >
              <FaImage size={20} />
            </button>
            <button
              onClick={() => handleFileSelect('video')}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Attach video"
              disabled={uploading}
            >
              <FaVideo size={20} />
            </button>
            <button
              onClick={() => handleFileSelect('pdf')}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Attach PDF"
              disabled={uploading}
            >
              <FaFilePdf size={20} />
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
          />
          
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            disabled={uploading}
          />
          
          <button
            onClick={sendMessage}
            disabled={(!message.trim() && Object.values(selectedFiles).every(file => file === null)) || uploading}
            className={`p-3 rounded-full transition-all ${
              (message.trim() || Object.values(selectedFiles).some(file => file !== null)) && !uploading
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSend size={22} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter to send • Messages are encrypted
        </p>
      </div>
    </div>
  );
};

export default ChatContent;