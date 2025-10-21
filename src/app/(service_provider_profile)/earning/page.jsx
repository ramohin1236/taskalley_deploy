"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, DollarSign } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { FaMoneyBillTransfer } from 'react-icons/fa6';

const page = () => {
     const [activeTab, setActiveTab] = useState('Daily');
  const [currentDate, setCurrentDate] = useState(new Date('2025-08-25'));
  
  const tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Lifetime'];
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (activeTab) {
      case 'Daily':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'Yearly':
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      default:
        return;
    }
    
    setCurrentDate(newDate);
  };

   const getDateDisplay = () => {
    switch (activeTab) {
      case 'Daily':
        return formatDate(currentDate);
      case 'Weekly':
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      case 'Monthly':
        return currentDate.toLocaleDateString('en-GB', { 
          month: 'long',
          year: 'numeric'
        });
      case 'Yearly':
        return currentDate.getFullYear().toString();
      case 'Lifetime':
        return 'All Time';
      default:
        return formatDate(currentDate);
    }
  };


  return (
     <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
         <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <FaMoneyBillTransfer className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Earning
          </h1>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-[#e6f4f1] border border-[#c0d9d3] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-[#115e59] font-medium mb-2">Total Earnings</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">₦ 1285.66</h2>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#c0d9d3]" />
            </div>
          </div>
        </div>

        {/* Earnings Breakdown Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-[#115e59]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Earnings Breakdown</h3>
          </div>

          {/* Time Period Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-lg font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-[#115e59] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          {activeTab !== 'Lifetime' && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 bg-[#266e5d] text-white rounded-lg hover:bg-[#115e59] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="min-w-0 text-center">
                <p className="text-sm font-medium text-gray-900">
                  {getDateDisplay()}
                </p>
              </div>
              
              <button
                onClick={() => navigateDate(1)}
                className="p-2 bg-[#266e5d] text-white rounded-lg hover:bg-[#115e59] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* No Transaction Found */}
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No Transaction found</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page