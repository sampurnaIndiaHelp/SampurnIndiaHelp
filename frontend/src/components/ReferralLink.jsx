import React from "react";

function ReferralLink({ userId, userName }) {
  const referralLink = `${window.location.origin}/register?ref=${userId}&name=${encodeURIComponent(userName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  return (
    <div className="referral-container">
      <style>{`
        .referral-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeInSlideUp 0.6s ease;
        }

        .referral-container h3 {
          margin-bottom: 20px;
          color: #333;
          font-size: 24px;
          font-weight: bold;
        }

        .referral-container input {
          width: 100%;
          padding: 14px 20px;
          border: 2px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 15px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .referral-container input:focus {
          border-color: #fd580b;
          box-shadow: 0 0 8px rgba(253, 88, 11, 0.3);
          outline: none;
        }

        .referral-container button {
          padding: 12px 24px;
          background: #fd580b;
          color: white;
          font-size: 16px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .referral-container button:hover {
          background: #e74c00;
          transform: scale(1.03);
        }

        @keyframes fadeInSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */

        @media (max-width: 1280px) {
          .referral-container {
            max-width: 600px;
          }
        }

        @media (max-width: 1024px) {
          .referral-container {
            max-width: 90%;
            padding: 25px;
          }
        }

        @media (max-width: 800px) {
          .referral-container {
            padding: 20px;
          }

          .referral-container h3 {
            font-size: 22px;
          }

          .referral-container input,
          .referral-container button {
            font-size: 15px;
          }
        }

        @media (max-width: 720px) {
          .referral-container {
            padding: 18px;
          }

          .referral-container input {
            padding: 12px 16px;
          }

          .referral-container button {
            padding: 10px 20px;
          }
        }

        @media (max-width: 580px) {
          .referral-container {
            padding: 16px;
          }

          .referral-container h3 {
            font-size: 20px;
          }
        }

        @media (max-width: 500px) {
          .referral-container {
            padding: 14px;
          }

          .referral-container input,
          .referral-container button {
            font-size: 14px;
          }

          .referral-container button {
            padding: 9px 18px;
          }
        }

        @media (max-width: 480px) {
          .referral-container {
            padding: 12px;
          }

          .referral-container h3 {
            font-size: 18px;
          }

          .referral-container input {
            padding: 10px 14px;
          }

          .referral-container button {
            padding: 8px 16px;
            font-size: 13px;
          }
        }
      `}</style>

      <h3>Your Referral Link</h3>
      <input
        type="text"
        value={referralLink}
        readOnly
        onClick={(e) => e.target.select()}
      />
      <button onClick={handleCopy}>Copy Link</button>
    </div>
  );
}

export default ReferralLink;
