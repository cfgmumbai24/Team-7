// components/ToggleButton.js
import { useState } from 'react';

const ToggleButton = () => {
  const [isGreen, setIsGreen] = useState(false);

  const toggleColor = () => {
    setIsGreen(!isGreen);
  };

  return (
    <button 
      onClick={toggleColor} 
      style={{ backgroundColor: isGreen ? 'green' : 'initial' }}
      className="open bg-blue-900 hover:bg-blue-800 text-gray-300 font-semibold rounded-lg transition duration-300 ease-in-out border border-green-800 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 my-2"
    >
      Mark as read
    </button>
  );
};

export default ToggleButton;
