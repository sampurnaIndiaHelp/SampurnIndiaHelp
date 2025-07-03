import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <ul>
          <li>
            <i className="fas fa-envelope"></i> info@supurnaindia.com
          </li>
        </ul>
      </div>

      <div className="topbar-center">
        <marquee scrollAmount="6" scrollDelay="20">
          <p>
            <strong>Sumpurna India Foundation</strong> Official Zoom meeting
            Every day 7.00 PM - Click{" "}
            <a
              href="https://us06web.zoom.us/j/84713911940?pwd=rW1OZrD6a24yXlXIXcVi17YjetRUDS.1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zoom Link
            </a>{" "}
            &nbsp;&nbsp;For Telegram Meeting Please Click{" "}
            <a
              href="https://t.me/+4nLabgKWdHJiNTE1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram Link
            </a>
          </p>
        </marquee>
      </div>

      <div className="topbar-right">
        <ul>
          <li>
            <a
              href="https://facebook.com/yourpage"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a
              href="https://plus.google.com/yourpage"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-google-plus-g"></i>
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/yourpage"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/yourpage"
              className="social-icon"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
