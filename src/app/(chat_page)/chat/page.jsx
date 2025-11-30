"use client";
import React, { useRef, useEffect, useState, useCallback, Suspense } from "react";
import { FiSend } from "react-icons/fi";
import { FaImage, FaFilePdf } from "react-icons/fa6";
import { Check, CheckCheck } from "lucide-react";
import { useSocket } from "@/components/context/socketProvider";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";
import { useGetChatListQuery, useGetMessagesQuery } from "@/lib/features/chatApi/chatApi";
import baseUrl from "../../../../utils/baseUrl";
import { useSelector } from "react-redux";
import Image from "next/image";

const ChatContent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const params = useSearchParams();
  const queryReceiverId = params?.get("receiverId");
  const queryConversationId = params?.get("conversationId");
  const [conversationId, setConversationId] = useState(queryConversationId || null);
  const [receiverId, setReceiverId] = useState(queryReceiverId || null);
  const [conversation, setConversation] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const { data: profileData } = useGetMyProfileQuery();
  const myUserId = profileData?.data?._id;
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { socket, isConnected } = useSocket();
  const { data: chatListData, refetch: refetchChatList } = useGetChatListQuery();
  
  // Load messages from REST API
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(
    conversationId,
    { 
      skip: !conversationId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  // Get user data from conversation or chat list
  const userData = React.useMemo(() => {
    if (conversation?.userData) {
      return conversation.userData;
    }
    
    if (conversationId && chatListData?.data?.data) {
      const conversations = Array.isArray(chatListData.data.data) 
        ? chatListData.data.data 
        : chatListData.data.data?.data || [];
      const foundConv = conversations.find((conv) => conv._id === conversationId);
      if (foundConv?.userData) {
        return foundConv.userData;
      }
    }
    
    return null;
  }, [conversation, conversationId, chatListData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  // Update conversationId and receiverId from URL params
  useEffect(() => {
    if (queryConversationId) {
      setConversationId(queryConversationId);
      setIsNewConversation(false);
    }
    if (queryReceiverId) {
      setReceiverId(queryReceiverId);
      if (!queryConversationId) {
        setIsNewConversation(true);
      }
    }
  }, [queryConversationId, queryReceiverId]);

  // Upload files to server
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return { imageUrl: [], pdfUrl: [], videoUrl: [] };

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const uploadEndpoints = [
        `${baseUrl()}/upload/upload-files`,
        `${baseUrl()}/upload/files`,
        `${baseUrl()}/file/upload`,
        `${baseUrl()}/message/upload-files`,
      ];

      let response = null;
      let result = null;

      for (const endpoint of uploadEndpoints) {
        try {
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: accessToken,
            },
            body: formData,
          });

          if (response.ok) {
            result = await response.json();
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!response || !response.ok) {
        toast.warning("File upload endpoint not found. Files will be sent as base64.");
        const imageUrl = [];
        const pdfUrl = [];
        const videoUrl = [];

        for (const file of files) {
          const reader = new FileReader();
          const base64 = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });

          if (file.type.startsWith("image/")) {
            imageUrl.push(base64);
          } else if (file.type === "application/pdf") {
            pdfUrl.push(base64);
          } else if (file.type.startsWith("video/")) {
            videoUrl.push(base64);
          }
        }

        return { imageUrl, pdfUrl, videoUrl };
      }

      const uploadedFiles = result?.data || result?.files || [];
      const imageUrl = [];
      const pdfUrl = [];
      const videoUrl = [];

      uploadedFiles.forEach((file) => {
        const url = file.url || file.path || file;
        if (file.type?.startsWith("image/") || (!file.type && typeof url === "string" && /\.(jpg|jpeg|png|gif|webp)/i.test(url))) {
          imageUrl.push(url);
        } else if (file.type === "application/pdf" || (typeof url === "string" && url.endsWith(".pdf"))) {
          pdfUrl.push(url);
        } else if (file.type?.startsWith("video/") || (typeof url === "string" && /\.(mp4|webm|mov)/i.test(url))) {
          videoUrl.push(url);
        }
      });

      return { imageUrl, pdfUrl, videoUrl };
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload files. Please try again.");
      return { imageUrl: [], pdfUrl: [], videoUrl: [] };
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "video/mp4",
        "video/webm",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message
  const sendMessage = useCallback(
    async (messageData) => {
      if (!socket || !isConnected) {
        toast.error("Not connected to server");
        return;
      }

      // Check condition: Only for NEW conversations, check if task/bid is IN_PROGRESS
      if (isNewConversation && !conversationId) {
        // Will check after conversation is created
      } else if (conversation) {
        const taskStatus = conversation?.task?.status;
        const bidStatus = conversation?.bid?.status;
        
        if (taskStatus && taskStatus !== "IN_PROGRESS" && taskStatus !== "ASSIGNED") {
          toast.error("Chat is only available while the related task/bid is In Progress.");
          return;
        }
        if (bidStatus && bidStatus !== "IN_PROGRESS" && bidStatus !== "ASSIGNED") {
          toast.error("Chat is only available while the related task/bid is In Progress.");
          return;
        }
      }

      // Upload files if any
      let fileUrls = { imageUrl: [], pdfUrl: [], videoUrl: [] };
      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        fileUrls = await uploadFiles(selectedFiles);
        setSelectedFiles([]);
        setUploadingFiles(false);
      }

      const messagePayload = {
        text: messageData.text || "",
        imageUrl: fileUrls.imageUrl || [],
        pdfUrl: fileUrls.pdfUrl || [],
        videoUrl: fileUrls.videoUrl || [],
        receiver: receiverId,
      };

      // Optimistic message
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        text: messagePayload.text,
        imageUrl: messagePayload.imageUrl,
        pdfUrl: messagePayload.pdfUrl,
        videoUrl: messagePayload.videoUrl,
        msgByUserId: myUserId,
        msgByUserModel: profileData?.data?.role || "Customer",
        seen: false,
        conversationId: conversationId,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        isMyMessage: true,
      };

      setMessages((prev) => {
        if (prev.some((m) => m._id === optimisticMessage._id)) return prev;
        return [...prev, optimisticMessage];
      });

      if (!conversationId && receiverId) {
        setPendingMessage(messagePayload);
      } else if (conversationId) {
        console.log("📤 Sending message via WebSocket:", {
          ...messagePayload,
          conversationId,
        });
        socket.emit("send-message", {
          ...messagePayload,
          conversationId,
        });
        
        // Also try alternative event name
        socket.emit("send_message", {
          ...messagePayload,
          conversationId,
        });
      }
    },
    [socket, isConnected, conversationId, receiverId, myUserId, selectedFiles, conversation, isNewConversation, profileData, accessToken]
  );

  // Handle send click
  const handleSendClick = async () => {
    const txt = input.trim();
    if (!txt && selectedFiles.length === 0) return;

    await sendMessage({ text: txt });
    setInput("");
  };

  // Mark messages as seen
  const markAsSeen = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;

    // Mark all unseen messages from the other user as seen
    const unseenMessages = messages.filter(
      (msg) => !msg.seen && msg.msgByUserId !== myUserId && msg.conversationId === conversationId
    );

    if (unseenMessages.length > 0) {
      const lastUnseen = unseenMessages[unseenMessages.length - 1];
      socket.emit("seen", {
        conversationId: conversationId,
        msgByUserId: lastUnseen.msgByUserId,
      });
    }
  }, [socket, isConnected, conversationId, messages, myUserId]);

  // Mark as seen when conversation is loaded
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsSeen();
    }
  }, [conversationId, messages.length, markAsSeen]);

  // WebSocket event handlers - MAIN FIX FOR REAL-TIME MESSAGING
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log("Socket not connected, waiting...");
      return;
    }

    console.log("Setting up WebSocket listeners", { conversationId, myUserId, receiverId });

    // Listen to conversation event
    const onConversation = (data) => {
      console.log("Conversation event received:", data);
      const conv = data?.data || data;
      if (!conv) return;

      setConversation(conv);
      const cid = conv._id || conv.id;
      if (cid && cid !== conversationId) {
        console.log("Setting conversationId:", cid);
        setConversationId(cid);
        setIsNewConversation(false);
      }

      // Check condition for new conversations
      if (isNewConversation && cid) {
        const taskStatus = conv?.task?.status;
        const bidStatus = conv?.bid?.status;
        
        if (taskStatus && taskStatus !== "IN_PROGRESS" && taskStatus !== "ASSIGNED") {
          toast.error("Chat is only available while the related task/bid is In Progress.");
          setPendingMessage(null);
          return;
        }
        if (bidStatus && bidStatus !== "IN_PROGRESS" && bidStatus !== "ASSIGNED") {
          toast.error("Chat is only available while the related task/bid is In Progress.");
          setPendingMessage(null);
          return;
        }
      }

      // Send queued message
      if (pendingMessage && cid) {
        console.log("Sending pending message:", pendingMessage);
        socket.emit("send-message", {
          ...pendingMessage,
          conversationId: cid,
        });
        setPendingMessage(null);
      }

      refetchChatList();
    };

    // CRITICAL: Listen to message events - This handles REAL-TIME messages for BOTH users
    const onNewMessage = (messageData) => {
      console.log("🔔 New message received via WebSocket:", messageData);
      const msg = messageData?.data || messageData;
      if (!msg) {
        console.log("No message data in payload");
        return;
      }

      const msgConversationId = msg.conversationId || msg.conversation_id;
      const currentConvId = conversationId || queryConversationId;
      
      console.log("Message details:", {
        msgConversationId,
        currentConvId,
        conversationId,
        msgByUserId: msg.msgByUserId,
        myUserId,
        messageId: msg._id || msg.id,
        text: msg.text
      });
      
      // Accept message if it belongs to current conversation OR if we don't have conversationId yet
      // Also accept if conversationId matches in any way
      const shouldAccept = !currentConvId || 
                          msgConversationId === currentConvId || 
                          msgConversationId === conversationId ||
                          (!conversationId && msgConversationId);
      
      if (shouldAccept) {
        console.log("✅ Message belongs to current conversation, adding to state");
        
        setMessages((prev) => {
          console.log("Current messages before update:", prev.length);
          
          // Remove optimistic messages
          const filtered = prev.filter((m) => {
            if (m.isOptimistic && m._id?.startsWith('temp-')) {
              return false;
            }
            return m._id !== (msg._id || msg.id);
          });
          
          // Add new message if not present
          const messageId = msg._id || msg.id;
          if (!filtered.some((m) => m._id === messageId)) {
            const newMessage = { 
              ...msg, 
              _id: messageId,
              isMyMessage: msg.msgByUserId === myUserId || msg.isMyMessage === true,
              text: msg.text || "",
              imageUrl: msg.imageUrl || [],
              pdfUrl: msg.pdfUrl || [],
              videoUrl: msg.videoUrl || [],
              createdAt: msg.createdAt || new Date().toISOString(),
            };
            
            console.log("➕ Adding message to state:", newMessage);
            
            // Sort by createdAt
            const sorted = [...filtered, newMessage].sort((a, b) => {
              const timeA = new Date(a.createdAt || 0).getTime();
              const timeB = new Date(b.createdAt || 0).getTime();
              return timeA - timeB;
            });
            
            console.log("📝 Total messages after adding:", sorted.length);
            return sorted;
          }
          console.log("⚠️ Message already exists, skipping");
          return filtered;
        });

        // Update conversationId if needed
        if (!conversationId && msgConversationId) {
          console.log("🆔 Updating conversationId from message:", msgConversationId);
          setConversationId(msgConversationId);
        }

        // Mark as seen if message is from other user
        if (msg.msgByUserId !== myUserId) {
          setTimeout(() => markAsSeen(), 500);
        }

        refetchChatList();
        setTimeout(() => refetchMessages(), 300);
      } else {
        console.log("❌ Message is for different conversation, updating chat list only");
        refetchChatList();
      }
    };

    const onSocketError = (error) => {
      console.error("Socket error:", error);
      toast.error(error?.message || "Connection error occurred");
    };

    // Register ALL possible event listeners for maximum compatibility
    socket.on("conversation", onConversation);
    
    // User-specific event (message-{userId}) - MOST IMPORTANT for receiving messages
    if (myUserId) {
      const userEventName = `message-${myUserId}`;
      console.log("👂 Listening to user-specific event:", userEventName);
      socket.on(userEventName, onNewMessage);
    }
    
    // Conversation-specific event (if we have conversationId)
    const currentConvId = conversationId || queryConversationId;
    if (currentConvId) {
      const convEventName = `conversation-${currentConvId}`;
      console.log("👂 Listening to conversation-specific event:", convEventName);
      socket.on(convEventName, onNewMessage);
    }
    
    // General message events (fallback)
    console.log("👂 Listening to general message events");
    socket.on("message", onNewMessage);
    socket.on("new-message", onNewMessage);
    socket.on("send-message", onNewMessage);
    socket.on("socket-error", onSocketError);

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up WebSocket listeners");
      socket.off("conversation", onConversation);
      if (myUserId) {
        socket.off(`message-${myUserId}`, onNewMessage);
      }
      if (currentConvId) {
        socket.off(`conversation-${currentConvId}`, onNewMessage);
      }
      socket.off("message", onNewMessage);
      socket.off("new-message", onNewMessage);
      socket.off("send-message", onNewMessage);
      socket.off("socket-error", onSocketError);
    };
  }, [socket, isConnected, conversationId, queryConversationId, receiverId, myUserId, pendingMessage, isNewConversation, markAsSeen, refetchChatList, refetchMessages]);

  // Load messages from REST API when conversationId changes
  useEffect(() => {
    if (!conversationId) {
      console.log("No conversationId, clearing messages");
      setMessages([]);
      return;
    }
    
    console.log("🔄 Refetching messages for conversationId:", conversationId);
    refetchMessages();
  }, [conversationId, refetchMessages]);

  // Also try to get conversation from chat list if we have conversationId but no conversation object
  useEffect(() => {
    if (conversationId && !conversation && chatListData?.data?.data) {
      const conversations = Array.isArray(chatListData.data.data) 
        ? chatListData.data.data 
        : chatListData.data.data?.data || [];
      const foundConv = conversations.find((conv) => conv._id === conversationId);
      if (foundConv) {
        console.log("📋 Found conversation from chat list:", foundConv);
        setConversation(foundConv);
      }
    }
  }, [conversationId, conversation, chatListData]);

  // Update messages when data arrives from REST API
  useEffect(() => {
    if (!conversationId) {
      console.log("No conversationId, skipping message load");
      return;
    }

    if (!messagesData) {
      console.log("Messages data not loaded yet");
      return;
    }

    console.log("📥 Loading messages from API:", messagesData);
    const messagesArray = messagesData?.data?.result || messagesData?.data?.data || messagesData?.result || messagesData?.data || [];
    
    console.log("📋 Messages array:", messagesArray, "Type:", Array.isArray(messagesArray));
    
    if (Array.isArray(messagesArray) && messagesArray.length > 0) {
      const formattedMessages = messagesArray.map((msg) => {
        const isMyMsg = msg.isMyMessage !== undefined 
          ? msg.isMyMessage 
          : (msg.msgByUserId === myUserId);
        
        return {
          ...msg,
          _id: msg._id || msg.id,
          isMyMessage: isMyMsg,
          text: msg.text || "",
          imageUrl: msg.imageUrl || [],
          pdfUrl: msg.pdfUrl || [],
          videoUrl: msg.videoUrl || [],
          createdAt: msg.createdAt || new Date().toISOString(),
        };
      });
      
      // Sort by createdAt
      formattedMessages.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      });
      
      console.log("✅ Setting messages from API:", formattedMessages.length, "messages");
      console.log("📝 Sample message:", formattedMessages[0]);
      setMessages(formattedMessages);
    } else if (Array.isArray(messagesArray)) {
      console.log("⚠️ Messages array is empty");
      setMessages([]);
    } else {
      console.log("⚠️ Messages array is not valid, setting empty array");
      setMessages([]);
    }
  }, [conversationId, messagesData, myUserId]);

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by date
  const groupMessagesByDate = React.useCallback((msgs) => {
    if (!Array.isArray(msgs) || msgs.length === 0) {
      console.log("No messages to group, array:", msgs);
      return [];
    }
    
    console.log("Grouping", msgs.length, "messages");
    const groups = [];
    let currentDate = null;
    
    msgs.forEach((msg, index) => {
      if (!msg) {
        console.log("Null message at index:", index);
        return;
      }
      
      // Ensure createdAt exists
      if (!msg.createdAt) {
        console.log("Message without createdAt:", msg);
        msg.createdAt = new Date().toISOString();
      }
      
      try {
        const msgDate = new Date(msg.createdAt).toDateString();
        if (msgDate !== currentDate) {
          currentDate = msgDate;
          groups.push({ type: 'date', date: currentDate, key: `date-${currentDate}-${index}` });
        }
        const messageKey = msg._id || msg.id || `msg-${index}-${Date.now()}`;
        groups.push({ type: 'message', message: msg, key: messageKey });
      } catch (error) {
        console.error("Error grouping message:", error, msg);
        // Still add the message even if date parsing fails
        const messageKey = msg._id || msg.id || `msg-${index}-${Date.now()}`;
        groups.push({ type: 'message', message: msg, key: messageKey });
      }
    });
    
    console.log("📦 Grouped messages result:", groups.length, "items");
    if (groups.length > 0) {
      console.log("First grouped item:", groups[0]);
    }
    return groups;
  }, []);

  const isInputDisabled = uploadingFiles || (conversation && 
    ((conversation?.task?.status && conversation.task.status !== "IN_PROGRESS" && conversation.task.status !== "ASSIGNED") || 
     (conversation?.bid?.status && conversation.bid.status !== "IN_PROGRESS" && conversation.bid.status !== "ASSIGNED")));

  if (!userData && !receiverId) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const groupedMessages = React.useMemo(() => {
    console.log("🔄 Grouping messages, current messages count:", messages.length);
    console.log("🔄 Messages array:", messages);
    if (messages.length === 0) {
      return [];
    }
    const grouped = groupMessagesByDate(messages);
    console.log("📦 Grouped result:", grouped.length, "items");
    if (grouped.length > 0) {
      console.log("📦 First grouped item type:", grouped[0].type);
    }
    return grouped;
  }, [messages, groupMessagesByDate]);

  // Debug: Log current state
  React.useEffect(() => {
    console.log("🔍 Current state:", {
      messagesCount: messages.length,
      groupedCount: groupedMessages.length,
      conversationId,
      isLoadingMessages,
      messagesData: messagesData ? "loaded" : "not loaded"
    });
  }, [messages, groupedMessages, conversationId, isLoadingMessages, messagesData]);

  return (
    <div className="flex flex-col h-full min-h-[600px] max-h-[750px] bg-[#e5ddd5] bg-[url('/whatsapp-bg.png')] bg-repeat overflow-hidden">
      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 border-b border-gray-300 p-3 bg-[#075e54] text-white">
        {userData && (
          <>
            <img
              src={userData?.profile_image || userData?.profileImage || "https://i.pravatar.cc/150?img=1"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">{userData?.name || "Unknown User"}</p>
              <p className="text-xs text-green-200">
                {isConnected ? "online" : "offline"}
              </p>
            </div>
          </>
        )}
        {!userData && receiverId && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            <div>
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Warning for non-IN_PROGRESS status */}
      {conversation && !isNewConversation && 
        ((conversation?.task?.status && conversation.task.status !== "IN_PROGRESS" && conversation.task.status !== "ASSIGNED") || 
         (conversation?.bid?.status && conversation.bid.status !== "IN_PROGRESS" && conversation.bid.status !== "ASSIGNED")) && (
        <div className="p-2 bg-yellow-100 text-yellow-800 border-b border-yellow-200 text-xs text-center">
          Chat is available only while the related task/bid is In Progress.
        </div>
      )}

      {/* WhatsApp-style Messages Section */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1" id="messages-container">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#075e54] mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
              {conversationId && (
                <p className="text-xs text-gray-400 mt-2">Conversation ID: {conversationId}</p>
              )}
            </div>
          </div>
        ) : groupedMessages && groupedMessages.length > 0 ? (
          groupedMessages.map((item, index) => {
            console.log("🎨 Rendering item:", index, item.type, item.key);
            
            if (item.type === 'date') {
              return (
                <div key={`date-${item.key}-${index}`} className="flex justify-center my-2">
                  <span className="bg-[#e5ddd5] px-3 py-1 rounded text-xs text-gray-600">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              );
            }

            if (item.type !== 'message' || !item.message) {
              console.log("⚠️ Invalid item:", item);
              return null;
            }

            const msg = item.message;
            if (!msg) {
              console.log("⚠️ Message is null");
              return null;
            }
            
            const isMyMessage = msg.isMyMessage !== undefined 
              ? msg.isMyMessage 
              : (msg.msgByUserId === myUserId);
            const senderProfileImage = msg?.userDetails?.profile_image 
              || msg?.userDetails?.profileImage 
              || (!isMyMessage ? (userData?.profile_image || userData?.profileImage) : null)
              || "https://i.pravatar.cc/150?img=1";
            
            return (
              <div
                key={`msg-${msg._id || msg.id || index}-${Date.now()}`}
                className={`flex items-end gap-1 ${isMyMessage ? "justify-end" : "justify-start"} mb-1`}
              >
                {!isMyMessage && (
                  <img
                    src={senderProfileImage}
                    alt="profile"
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                )}
                
                <div className={`flex flex-col max-w-[70%] md:max-w-[60%] ${isMyMessage ? "items-end" : "items-start"}`}>
                  {/* Images */}
                  {msg.imageUrl && msg.imageUrl.length > 0 && msg.imageUrl[0] && msg.imageUrl[0].trim() !== "" && (
                    <div className={`mb-1 ${isMyMessage ? "flex flex-wrap justify-end gap-1" : "flex flex-wrap gap-1"}`}>
                      {msg.imageUrl.filter(url => url && url.trim() !== "").map((imgUrl, idx) => (
                        <div key={idx} className="relative w-48 h-48 rounded-lg overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt={`Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PDFs */}
                  {msg.pdfUrl && msg.pdfUrl.length > 0 && msg.pdfUrl[0] && msg.pdfUrl[0].trim() !== "" && (
                    <div className="mb-1 space-y-1">
                      {msg.pdfUrl.filter(url => url && url.trim() !== "").map((pdfUrl, idx) => (
                        <a
                          key={idx}
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            isMyMessage
                              ? "bg-[#dcf8c6] text-gray-800"
                              : "bg-white text-gray-700"
                          } hover:opacity-80 transition-opacity`}
                        >
                          <FaFilePdf size={20} />
                          <span className="text-sm">PDF Document</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Videos */}
                  {msg.videoUrl && msg.videoUrl.length > 0 && msg.videoUrl[0] && msg.videoUrl[0].trim() !== "" && (
                    <div className="mb-1 space-y-1">
                      {msg.videoUrl.filter(url => url && url.trim() !== "").map((videoUrl, idx) => (
                        <video
                          key={idx}
                          src={videoUrl}
                          controls
                          className="w-full max-w-md rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Text Message Bubble */}
                  {(msg.text || (!msg.imageUrl?.length && !msg.pdfUrl?.length && !msg.videoUrl?.length)) && (
                    <div
                      className={`px-3 py-2 rounded-lg shadow-sm ${
                        isMyMessage
                          ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.text || "📎 Attachment"}</p>
                    </div>
                  )}

                  {/* Timestamp and Status */}
                  <div className={`flex items-center gap-1 mt-0.5 ${isMyMessage ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.createdAt)}
                    </span>
                    {isMyMessage && (
                      <span className="text-xs">
                        {msg.seen ? (
                          <CheckCheck size={14} className="text-blue-500" />
                        ) : (
                          <Check size={14} className="text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {isMyMessage && (
                  <img
                    src={profileData?.data?.profile_image || profileData?.data?.profileImage || "https://i.pravatar.cc/150?img=1"}
                    alt="profile"
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                )}
              </div>
            );
          })
        ) : messages && messages.length > 0 ? (
          // Fallback: Show messages directly if grouping fails
          <div className="space-y-2">
            {messages.map((msg, idx) => {
              const isMyMsg = msg.isMyMessage !== undefined 
                ? msg.isMyMessage 
                : (msg.msgByUserId === myUserId);
              
              return (
                <div
                  key={`fallback-msg-${msg._id || msg.id || idx}`}
                  className={`flex items-end gap-1 ${isMyMsg ? "justify-end" : "justify-start"} mb-1`}
                >
                  {!isMyMsg && (
                    <img
                      src={userData?.profile_image || userData?.profileImage || "https://i.pravatar.cc/150?img=1"}
                      alt="profile"
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  
                  <div className={`flex flex-col max-w-[70%] md:max-w-[60%] ${isMyMsg ? "items-end" : "items-start"}`}>
                    {msg.text && (
                      <div
                        className={`px-3 py-2 rounded-lg shadow-sm ${
                          isMyMsg
                            ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    )}
                    
                    <div className={`flex items-center gap-1 mt-0.5 ${isMyMsg ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isMyMsg && (
                        <span className="text-xs">
                          {msg.seen ? (
                            <CheckCheck size={14} className="text-blue-500" />
                          ) : (
                            <Check size={14} className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {isMyMsg && (
                    <img
                      src={profileData?.data?.profile_image || profileData?.data?.profileImage || "https://i.pravatar.cc/150?img=1"}
                      alt="profile"
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t bg-white">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative group">
                {file.type.startsWith("image/") ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FaFilePdf size={24} className="text-gray-600" />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp-style Input Section */}
      <div className="flex items-center gap-2 p-3 border-t bg-[#f0f0f0]">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,application/pdf,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isInputDisabled}
          className="text-gray-600 hover:text-[#075e54] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2"
        >
          <FaImage size={22} />
        </button>
        <input
          type="text"
          placeholder={uploadingFiles ? "Uploading files..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendClick()}
          disabled={isInputDisabled}
          className="flex-1 px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#075e54] text-gray-800 disabled:opacity-50"
        />
        <button
          onClick={handleSendClick}
          disabled={isInputDisabled || uploadingFiles || (!input.trim() && selectedFiles.length === 0)}
          className="bg-[#075e54] text-white rounded-full p-2.5 hover:bg-[#064e46] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

const ChatInterface = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full min-h-[600px]">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
};

export default ChatInterface;
