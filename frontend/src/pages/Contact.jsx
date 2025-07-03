import React from "react";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2 className="contact-title">Contact Sampurna India Foundation</h2>

        <div className="contact-info">
          <p>
            <strong>📞 Phone:</strong> 1234567890
          </p>
          <p>
            <strong>📧 Email:</strong> sampurnaindiafoundation@gmail.com
          </p>
          <p>
            <strong>📍 Address:</strong> XYZ, Uttar Pradesh, 222001
          </p>
        </div>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <style jsx>{`
        .contact-page {
          padding: 40px 20px;
          background: linear-gradient(to right, #f5f7fa, #c3cfe2);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .contact-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 26px;
          color: #333;
        }

        .contact-info p {
          font-size: 16px;
          color: #555;
          margin: 8px 0;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 25px;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 12px;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: border-color 0.3s;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .contact-form button {
          background-color: #4f46e5;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .contact-form button:hover {
          background-color: #3730a3;
        }

        @media (max-width: 600px) {
          .contact-container {
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}
