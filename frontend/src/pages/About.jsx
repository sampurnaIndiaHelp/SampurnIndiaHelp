import React from "react";

import "../styles/About.css";

export default function AboutUs() {
  return (
    <section className="about-us-section">
      <div className="about-us-container">
        <h2 className="about-heading">Sampurna India Foundation</h2>
        <p className="about-intro">
          Welcome to Community, where our mission is to connect peoples who
          donate worldwide to collaborate, innovate, and amplify their impact on
          global causes.
        </p>

        <h3 className="mission-heading">Our Mission:</h3>
        <p className="mission-text">
          At Community, we believe in the power of collaboration to drive
          meaningful change. Our mission is to provide a platform where peoples
          can come together to share resources, expertise, and best practices.
          By fostering partnerships and facilitating connections, we aim to
          strengthen the collective effort towards addressing pressing global
          challenges.
        </p>

        <button className="read-more-btn">Read More...</button>
      </div>
    </section>
  );
}
