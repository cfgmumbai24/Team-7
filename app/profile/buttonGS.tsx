import React, { useState } from 'react';

function ConsentToggle2() {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const handleToggle = () => {
    setIsConsentGiven(!isConsentGiven);
    // Handle data sharing logic here based on isConsentGiven
    if (isConsentGiven) {
      console.log("User has given consent to share information.");
      // Send data, store consent, etc.
    } else {
      console.log("User has revoked consent to share information.");
      // Revoke data sharing, remove consent, etc.
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border border-gray-300 focus:ring-blue-500 focus:ring-2"
        checked={isConsentGiven}
        onChange={handleToggle}
      />
      <label
        htmlFor="consent-checkbox"
        className="ml-2 text-gray-500 font-medium cursor-pointer "
      >
        I consent to recieve notifications about government schemes.
      </label>
    </div>
  );
}

export default ConsentToggle2;