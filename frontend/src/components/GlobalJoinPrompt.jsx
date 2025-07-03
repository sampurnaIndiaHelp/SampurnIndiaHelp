import React, { useEffect, useState } from "react";
import "../styles/GlobalJoinPrompt.css";

const GlobalJoinPrompt = () => {
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");
  const sponsorId = localStorage.getItem("sponsorId") || "SAMPUR01";

  const [directs, setDirects] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [parentInfo, setParentInfo] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const directRes = await fetch(`http://localhost:5000/api/users/downline/direct/${userId}`);
        const directsData = await directRes.json();
        const activeDirects = directsData.filter(d => d.isActive);
        setDirects(activeDirects);

        if (activeDirects.length >= 5) {
          setShowPrompt(true);
        }

        const checkRes = await fetch(`http://localhost:5000/api/global/check/${userId}`);
        const checkData = await checkRes.json();
        setAlreadyJoined(checkData.isJoined);

        // ✅ Auto global join for SAMPUR01 (company) without payment
        if (userId === "SAMPUR01" && activeDirects.length >= 5 && !checkData.isJoined) {
          const joinRes = await fetch("http://localhost:5000/api/global/global-join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              userName: fullName,
              sponsorId: "COMPANY",
            }),
          });

          const joinResult = await joinRes.json();
          if (joinRes.ok) {
            setStatusMsg(`✅ Company ID auto joined. Global ID parent: ${joinResult.parentId}`);
            setAlreadyJoined(true);
          }
        }
      } catch (err) {
        console.error("GlobalJoinPrompt error:", err);
      }
    };

    fetchData();
  }, [userId, fullName]);

  const handleUpload = async () => {
    if (!screenshot) return alert("Please upload screenshot.");
    setSubmitting(true);

    try {
      const joinRes = await fetch("http://localhost:5000/api/global/global-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName: fullName, sponsorId }),
      });

      const joinResult = await joinRes.json();
      if (!joinRes.ok) {
        setStatusMsg("❌ " + (joinResult.message || "Global join failed."));
        setSubmitting(false);
        return;
      }

      setParentInfo({ parentId: joinResult.parentId });
      setStatusMsg(`✅ Global ID generated! Parent: ${joinResult.parentId}`);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("screenshot", screenshot);

      const uploadRes = await fetch("http://localhost:5000/api/global/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        setStatusMsg((prev) => prev + `\n✅ ${uploadData.message || "Screenshot uploaded."}`);
        setAlreadyJoined(true);
      } else {
        setStatusMsg((prev) => prev + "\n❌ Screenshot upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong.");
    }

    setSubmitting(false);
  };

  if (alreadyJoined || !showPrompt) return null;

  return (
    <div className="global-alert">
      <h3>🎯 You have {directs.length} Active Direct Joins!</h3>
      <p>Activate your Global Team position with ₹500 sponsor payment.</p>

      {parentInfo?.parentId && (
        <div style={{ background: "#f0f0f0", padding: "10px", borderRadius: "6px" }}>
          <p><b>Receiver (Upline):</b> {parentInfo.parentId}</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setScreenshot(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit ₹500 Payment"}
      </button>

      {statusMsg && (
        <div style={{ marginTop: "10px", color: "green", whiteSpace: "pre-line" }}>
          {statusMsg}
        </div>
      )}
    </div>
  );
};

export default GlobalJoinPrompt;
