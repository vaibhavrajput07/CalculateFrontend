import { useState } from 'react';
import './MainPage.css';

export default function MainPage() {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [result, setResult] = useState("");

  const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    return nameRegex.test(name.trim());
  };

  const calculateLove = async () => {
    const trimmedYourName = yourName.trim();
    const trimmedPartnerName = partnerName.trim();

    // 1. Empty field check
    if (!trimmedYourName || !trimmedPartnerName) {
      setResult("Please enter both names ❤️");
      return;
    }

    // 2. Alphabet-only validation
    if (!isValidName(trimmedYourName) || !isValidName(trimmedPartnerName)) {
      setResult("Names must contain only letters (no numbers or special characters) ❌");
      return;
    }

    // 3. Same name validation
    if (trimmedYourName.toLowerCase() === trimmedPartnerName.toLowerCase()) {
      setResult("Both names cannot be the same 🚫");
      return;
    }

    // 4. Calculate love score
    let loveScore = 50;
    const yourNameSet = new Set(trimmedYourName.toLowerCase().split(''));
    const partnerNameSet = new Set(trimmedPartnerName.toLowerCase().split(''));
    const matchingCharacters = [...yourNameSet].filter(char => partnerNameSet.has(char)).length;
    loveScore += matchingCharacters * 5;

    if (trimmedYourName.length === trimmedPartnerName.length) {
      loveScore += 10;
    }

    loveScore = Math.min(Math.max(loveScore, 50), 100);
    setResult(`${trimmedYourName} ❤️ ${trimmedPartnerName} = ${loveScore}% Love`);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/love/save-love`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yourName: trimmedYourName,
          partnerName: trimmedPartnerName,
          loveScore
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Data saved successfully:', data);
      } else {
        console.log('Error:', data.error);
      }
    } catch (error) {
      console.error('Error saving data to the backend:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-400 to-pink-400 p-4">
      <h1 className="text-5xl font-bold text-white">
        Love <span className="text-white">♥</span> Calculator
      </h1>
      <p className="text-white font-semibold mb-6 subTitle">
        Get Your Own Love Result Instantly*
      </p>

      <div className="flex flex-col md:flex-row items-center mt-8 justify-center gap-6 mb-6 w-full max-w-xl">
        <div className="input-group">
          <label htmlFor="yourName" className="input-label">Your Name:</label>
          <input
            type="text"
            id="yourName"
            placeholder="Enter Your Name"
            className="input-field"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="partnerName" className="input-label">Partner's Name:</label>
          <input
            type="text"
            id="partnerName"
            placeholder="Enter His/Her Name"
            className="input-field"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={calculateLove}
        className="bg-white text-red-500 font-bold py-3 px-8 rounded-full shadow-md hover:bg-red-100 transition"
      >
        ❤️ CALCULATE ❤️
      </button>

      <div className="mt-8 text-center result-container">
        <h2 className="text-2xl text-white font-bold mb-2">Result</h2>
        <hr className="border-white w-24 mx-auto mb-4" />
        <p className="text-white text-lg">{result}</p>
      </div>
    </div>
  );
}
