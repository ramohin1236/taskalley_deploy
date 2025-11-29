// app/chat/[id]/page.jsx
"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import ChatInterface from '../page';

const userData = [
  {
    id: "1",
    Name: "Lee Williamson",
    short_message: "Hey, are you available for a quick call?",
    image: "https://i.pravatar.cc/150?img=1",
    email: "lee.williamson@example.com",
    location: "New York, United States"
  },
  {
    id: "2", 
    Name: "Eleanor Pena",
    short_message: "Yes, that's gonna work, hopefully.",
    image: "https://i.pravatar.cc/150?img=2",
    email: "eleanor.pena@example.com", 
    location: "Los Angeles, United States"
  },
  {
    id: "3",
    Name: "Jacob Jones",
    short_message: "I'll send you the files by tonight.",
    image: "https://i.pravatar.cc/150?img=3",
    email: "jacob.jones@example.com",
    location: "Chicago, United States"
  },
  {
    id: "4",
    Name: "Theresa Webb",
    short_message: "Can we move the meeting to tomorrow?",
    image: "https://i.pravatar.cc/150?img=4",
    email: "theresa.webb@example.com",
    location: "Miami, United States"
  }
];

const ChatDetails = () => {
  const params = useParams();
  const userId = params.id;
  
  const user = userData.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <p className="text-gray-600 mt-2">The conversation you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ChatInterface user={user} />;
}

export default ChatDetails;