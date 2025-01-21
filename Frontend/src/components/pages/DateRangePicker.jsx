import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // For styling

export default function DateRangePicker({ onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDate = (date) => {
    setStartDate(date);
    onDateChange({ start: date, end: endDate });
  };

  const handleEndDate = (date) => {
    setEndDate(date);
    onDateChange({ start: startDate, end: date });
  };

  return (
    // <div className="flex items-center space-x-4">
    //   <div className="relative">
    //     <label htmlFor="startDate" className="text-sm text-gray-700">
    //       Start Date
    //     </label>
    //     <DatePicker
    //       selected={startDate}
    //       onChange={(date) => setStartDate(date)}
    //       selectsStart
    //       startDate={startDate}
    //       endDate={endDate}
    //       className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //       placeholderText="Select start date"
    //     />
    //   </div>

    //   <span className="mx-4 text-gray-500">to</span>

    //   <div className="relative">
    //     <label htmlFor="endDate" className="text-sm text-gray-700">
    //       End Date
    //     </label>
    //     <DatePicker
    //       selected={endDate}
    //       onChange={(date) => setEndDate(date)}
    //       selectsEnd
    //       startDate={startDate}
    //       endDate={endDate}
    //       minDate={startDate}
    //       className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //       placeholderText="Select end date"
    //     />
    //   </div>
    // </div>
    <div className="flex items-center space-x-4">
      {/* Start Date Picker */}
      <div className="relative">
        <label htmlFor="startDate" className="text-sm text-gray-700">
          Start Date
        </label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholderText="Select start date"
          popperPlacement="bottom-start"
          
        />
      </div>

      <span className="mx-4 text-gray-500">to</span>

      {/* End Date Picker */}
      <div className="relative">
        <label htmlFor="endDate" className="text-sm text-gray-700">
          End Date
        </label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholderText="Select end date"
          popperPlacement="bottom-start"
          
        />
      </div>
    </div>
  );
}
