// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import "../styles/HeroSection.css";
import hero1 from "../Assets/images/hero1.jpg";
import hero2 from "../Assets/images/hero2.jpg";
import hero3 from "../Assets/images/poore.jpg";
import hero4 from "../Assets/images/clean_water.jpg";

const images = [hero1, hero2, hero3, hero4];
const captions = [
  "Empower a life, donate with heart.",
  "Together, we build brighter futures.",
  "Every small act of kindness counts.",
  "Give hope, spread smiles.",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-container">
      {images.map((img, index) => (
        <div
          className={`slide ${index === current ? "active" : ""}`}
          key={index}
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="overlay">
            <h1>{captions[index]}</h1>
            <p>Be the reason someone smiles today.</p>
            <div className="buttons">
              <button className="btn red">Join Us</button>
              <button className="btn white">Charity</button>
            </div>
          </div>
        </div>
      ))}
      <button className="nav-btn left" onClick={prevSlide}>
        ❮
      </button>
      <button className="nav-btn right" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default HeroSection;
