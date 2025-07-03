import React, { useEffect, useState } from "react";

const GlobalJoinStatus = () => {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);
  const [myReferrals, setMyReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [uploadScreenshot, setUploadScreenshot] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("fullName");
    if (storedId) setUserId(storedId);
    if (storedName) setFullName(storedName);
  }, []);

  const fetchStatusAndReferrals = async () => {
    try {
      const res1 = await fetch(`http://localhost:5000/api/global/status/${userId}`);
      const data1 = await res1.json();
      setStatus(data1);

      const res2 = await fetch(`http://localhost:5000/api/global/pending/${userId}`);
      const data2 = await res2.json();
      setMyReferrals(Array.isArray(data2) ? data2 : []);
    } catch (err) {
      console.error("❌ Error loading global join status or referrals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchStatusAndReferrals();
  }, [userId]);

  const handleUploadScreenshot = async () => {
    if (!uploadScreenshot) return alert("Please select a screenshot to upload.");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("screenshot", uploadScreenshot);

    try {
      const res = await fetch("http://localhost:5000/api/global/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Uploaded successfully");
      fetchStatusAndReferrals();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed.");
    }
  };

  const approveJoin = async (targetUserId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/global/approve/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: userId }),
      });
      const data = await res.json();
      alert(data.message);
      fetchStatusAndReferrals();
    } catch (err) {
      alert("❌ Failed to approve.");
    }
  };

  const rejectJoin = async (targetUserId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/global/reject/${targetUserId}`, {
        method: "PUT",
      });
      const data = await res.json();
      alert(data.message);
      fetchStatusAndReferrals();
    } catch (err) {
      alert("❌ Failed to reject.");
    }
  };

  const handleViewScreenshot = () => {
    window.open(`http://localhost:5000/uploads/${status.paymentScreenshot}`, "_blank");
  };

  return (
    <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
      <h3>🌍 My Global Join Status</h3>

      {loading ? (
        <p>Loading status...</p>
      ) : !status?.joined ? (
        <p>You have not joined the global matrix yet.</p>
      ) : (
        <>
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr><td><b>Your Global ID:</b></td><td>{userId}</td></tr>
              <tr><td><b>Name:</b></td><td>{status.userName || fullName + " (GLOBAL)"}</td></tr>
              <tr><td><b>Status:</b></td>
                <td style={{ color: status.isApproved ? "green" : "orange" }}>
                  {status.isApproved ? "✅ Approved" : "⏳ Pending Approval"}
                </td></tr>
              <tr><td><b>Approved By:</b></td><td>{status.approvedBy || "Pending"}</td></tr>
              <tr><td><b>Paid To (Upline):</b></td><td>{status.parentId || "Unknown"}</td></tr>
              <tr><td><b>Screenshot:</b></td>
                <td>
                  {status.paymentScreenshot ? (
                    <button onClick={handleViewScreenshot} style={{ padding: "5px 12px" }}>
                      🔍 View Screenshot
                    </button>
                  ) : (
                    <i>No screenshot uploaded</i>
                  )}
                </td>
              </tr>
              <tr><td><b>Joined On:</b></td><td>{status.createdAt ? new Date(status.createdAt).toLocaleString() : "N/A"}</td></tr>
            </tbody>
          </table>

          {status.isApproved && (
            <p style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
              🎉 Global Join Approved!
            </p>
          )}

          {/* Upload option only when not paid */}
          {!status.isPaid && !status.isApproved && (
            <div style={{ marginTop: "20px", background: "#fff8e1", padding: "10px", borderRadius: "8px" }}>
              <h4>📤 Upload Payment Screenshot</h4>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadScreenshot(e.target.files[0])}
              />
              <button
                onClick={handleUploadScreenshot}
                style={{ marginTop: "10px", backgroundColor: "#007bff", color: "#fff", padding: "6px 14px", border: "none" }}>
                Upload Screenshot
              </button>
            </div>
          )}

          {/* Approve company if SAMPUR01 */}
          {userId === "SAMPUR01" && status.isPaid && !status.isApproved && (
            <div style={{ marginTop: "20px" }}>
              <h4>✅ You can approve your own global ID</h4>
              <button
                onClick={() => approveJoin("SAMPUR01")}
                style={{ backgroundColor: "green", color: "#fff", padding: "6px 14px" }}>
                ✅ Approve Myself
              </button>
            </div>
          )}
        </>
      )}

      {/* 🧾 Pending Approvals */}
      {myReferrals.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>🧾 Pending Global Approvals</h3>
          {myReferrals.map((entry) => (
            <div key={entry.userId} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p><b>User:</b> {entry.userId}</p>
              <p><b>Screenshot:</b></p>
              {entry.paymentScreenshot ? (
                <img
                  src={`http://localhost:5000/uploads/${entry.paymentScreenshot}`}
                  alt="Payment"
                  style={{ width: "200px", border: "1px solid #ccc" }}
                />
              ) : (
                <i>No screenshot uploaded</i>
              )}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => approveJoin(entry.userId)}
                  style={{ marginRight: "10px", backgroundColor: "#4CAF50", color: "#fff", padding: "5px 12px" }}>
                  ✅ Approve
                </button>
                <button
                  onClick={() => rejectJoin(entry.userId)}
                  style={{ backgroundColor: "#f44336", color: "#fff", padding: "5px 12px" }}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalJoinStatus;
