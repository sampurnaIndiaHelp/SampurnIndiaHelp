// AboutUs.jsx
import React from "react";
import "../styles/AboutUs.css";
import DonateImage from "../Assets/images/donate.jpg";

const AboutInfo = () => {
  return (
    <section className="about-us-section">
      <div className="about-container">
        <div className="about-content">
          <h2>About Sampurna India Foundation</h2>
          <p>
            Sampurna India Foundation is a non-profit organization committed to
            uplifting underprivileged communities across India. Our mission is
            to bring meaningful change by focusing on education, healthcare,
            women empowerment, environmental sustainability, and disaster
            relief. We believe in collective responsibility and encourage
            individuals to participate in the journey of transforming lives
            through kindness, service, and action.
          </p>
          <p>
            Through relentless dedication and support from compassionate donors,
            we have positively impacted thousands of lives. Whether it's a
            child’s education, a patient’s treatment, or aid in a crisis —
            Sampurna India Foundation is present with open hands and hearts.
          </p>
        </div>

        <div className="about-image">
          <img src={DonateImage} alt="Donate for Good" />
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
