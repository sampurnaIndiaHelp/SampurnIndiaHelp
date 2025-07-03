import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ReferralLink from "../components/ReferralLink";
import TeamTree from "../components/TeamTree";
import LevelPaymentSection from "../components/LevelPaymentSection";
import PendingLevelApprovals from "../components/PendingLevelApprovals";
import LevelTree from "../components/LevelTree";
import PaymentHistory from "../components/PaymentHistory";
import GlobalJoinPrompt from "../components/GlobalJoinPrompt";
import UnlockPaymentSection from "../components/UnlockPaymentSection";
import SponsorGlobalApprovals from "./SponsorGlobalApprovals";
import GlobalTreeView from "./GlobalTreeView";
import GlobalJoinStatus from "../components/GlobalJoinStatus";
import CloneList from "../components/CloneList";

import GlobalUpgradeStatus from "../components/GlobalUpgradeStatus";

import "../styles/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [downlines, setDownlines] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
      const data = await res.json();

      // Set next level info
      if (!data.levelPaid) data.levelPaid = {};
      for (let i = 1; i <= 13; i++) {
        if (!data.levelPaid[i]) {
          data.nextLevel = i;
          break;
        }
      }

      // Set global join eligibility
      data.hasPaidGlobal = data.directJoin >= 5 && !data.globalPaid;

      // Auto-join for company account
      if (data.userId === "SAMPUR01" && data.directJoin >= 5 && !data.globalPaid) {
        await fetch("http://localhost:5000/api/global/global-join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.userId,
            userName: data.fullName,
            sponsorId: "COMPANY"
          }),
        }).then(() => console.log("✅ Auto-joined COMPANY to global"));
      }

      setUser(data);
    };

    const loadDownlines = () => {
      fetch(`http://localhost:5000/api/users/downline/full/${userId}`)
        .then((res) => res.json())
        .then(setDownlines)
        .catch((err) => console.error("Failed to load downlines", err));
    };

    const loadPendingPayments = () => {
      fetch(`http://localhost:5000/api/payments/pending/${userId}`)
        .then((res) => res.json())
        .then(setPendingPayments)
        .catch(() => {});
    };

    loadProfile();
    loadDownlines();
    loadPendingPayments();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div className="dashboard-loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Welcome, {user.fullName}</h2>
          <p><strong>User ID:</strong> {user.userId}</p>
          <p><strong>Sponsor:</strong> {user.sponsorName || "Company"}</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {!user.isActive && (
        <section className="alert-card">
          <h3>Your ID is not Active</h3>
          <p>You must pay ₹200 to your sponsor to activate your account.</p>
          <a className="pay-btn" href="/upload-payment">Make Payment</a>
        </section>
      )}

      {pendingPayments.length > 0 && (
        <section className="alert-card sponsor">
          <h3>You have {pendingPayments.length} pending payments to approve</h3>
          <button onClick={() => navigate("/sponsor-approval")}>View & Approve</button>
        </section>
      )}

      <section className="referral-section">
        <ReferralLink userId={user.userId} userName={user.fullName} />
      </section>

      <div className="dashboard-container">
        <UnlockPaymentSection />
      </div>

      <section className="income-grid">
        <div className="card clickable" onClick={() => navigate("/direct-joining")}>
          <h3>Total Direct Team</h3>
          <p>{user.directJoin || 0}</p>
        </div>
        <div className="card"><h3>Total Level Income</h3><p>₹{user.uplineIncome || 0}</p></div>
        <div className="card"><h3>Sponsor Help</h3><p>₹{user.sponsorIncome || 0}</p></div>
        <div className="card"><h3>Personal Team Help</h3><p>₹{user.personalTeamHelp || 0}</p></div>
        <div className="card"><h3>Global Team Help</h3><p>₹{user.globalIncome || 0}</p></div>
        <div className="card"><h3>Global Sponsor Help</h3><p>₹{user.globalSponsorHelp || 0}</p></div>
        <div className="card total"><h3>Total Receive Help</h3><p>₹{user.totalIncome || 0}</p></div>
      </section>

      <section className="downline-table">
        <h2>Your Referral Tree</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Sponsor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {downlines.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.level}</td>
                  <td>{item.userId}</td>
                  <td>{item.fullName}</td>
                  <td>{item.sponsorName}</td>
                  <td>
                    <span className={item.isActive ? "status working" : "status non-working"}>
                      {item.isActive ? "Working" : "Non-Working"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section><TeamTree userId={user.userId} /></section>
      <section><LevelPaymentSection /></section>
      <section><PendingLevelApprovals /></section>
      <section><LevelTree userId={userId} /></section>
      <section><PaymentHistory userId={userId} /></section>

      {user.hasPaidGlobal && (
        <section>
          <GlobalJoinPrompt user={user} />
        </section>
      )}

      {user.globalPaid && (
        <section className="alert-card success">
          <h3>✅ Global Income Activated</h3>
          <p>Your global ID is now part of the global income matrix.</p>
        </section>
      )}

      <div><SponsorGlobalApprovals /></div>
      <div><GlobalTreeView /></div>

      <div>
        <button onClick={() => window.location.href = "/global-dashboard"}>
          🌐 View Global Matrix Dashboard
        </button>
      </div>
      <div><GlobalJoinStatus /></div>

      <div>
        <GlobalUpgradeStatus />
      </div>

      <section>
  <CloneList userId={user.userId} />
</section>
    </div>
  );
}

export default Dashboard;
