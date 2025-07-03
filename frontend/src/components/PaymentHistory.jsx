// File: frontend/components/PaymentHistory.jsx
import React, { useEffect, useState } from "react";
import "../styles/PaymentHistory.css";

const PaymentHistory = ({ userId }) => {
  const [creditPayments, setCreditPayments] = useState([]);
  const [debitPayments, setDebitPayments] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/payments/history/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCreditPayments(data.credits || []);
        setDebitPayments(data.debits || []);
      })
      .catch((err) => console.error("Failed to fetch payment history", err));
  }, [userId]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      <div className="history-columns">
        <div className="history-box">
          <h3>💸 Credit Payments (Received)</h3>
          <table>
            <thead>
              <tr>
                <th>Sender Name</th>
                <th>Sender ID</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Screenshot</th>
                <th>Approved At</th>
              </tr>
            </thead>
            <tbody>
              {creditPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.senderName}</td>
                  <td>{p.userId}</td>
                  <td>{p.senderPhone}</td>
                  <td>₹{p.amount || (p.type === "sponsor" ? 200 : 100)}</td>
                  <td><a href={`http://localhost:5000/uploads/${p.screenshot}`} target="_blank" rel="noreferrer">View</a></td>
                  <td>{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="history-box">
          <h3>💰 Debit Payments (You Paid)</h3>
          <table>
            <thead>
              <tr>
                <th>To Sponsor</th>
                <th>Receiver ID</th>
                <th>Your Phone</th>
                <th>Amount</th>
                <th>Screenshot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {debitPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.receiverName || "Sponsor"}</td>
                  <td>{p.sponsorId}</td>
                  <td>{p.senderPhone}</td>
                  <td>₹{p.amount || (p.type === "sponsor" ? 200 : 100)}</td>
                  <td><a href={`http://localhost:5000/uploads/${p.screenshot}`} target="_blank" rel="noreferrer">View</a></td>
                  <td>{p.status}</td>
                   <td>{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
