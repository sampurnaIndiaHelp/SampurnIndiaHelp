import React, { useEffect, useRef } from "react";
import "../styles/AchivementCarts.css";

const cardsData = [
  {
    image: require("../Assets/images/People_Help.jpg"),
    title: "People Help",
    text: "Empowering lives through donations, food, and shelter in rural communities.",
  },
  {
    image: require("../Assets/images/hero2.jpg"),
    title: "Accident Relief",
    text: "Emergency support and care for accident victims in need.",
  },
  {
    image: require("../Assets/images/helthcare.webp"),
    title: "Medical Aid",
    text: "Providing essential medical supplies and health checkups.",
  },
  {
    image: require("../Assets/images/envornment.jpg"),
    title: "Protecting Planet",
    text: "Spreading awareness and driving green environmental campaigns.",
  },
  {
    image: require("../Assets/images/kanyadan.jpg"),
    title: "Kanyadaan Help",
    text: "Supporting underprivileged girls in their marriage with basic needs.",
  },
  {
    image: require("../Assets/images/Education.jpg"),
    title: "Education Drive",
    text: "Helping children access education and mentorship programs.",
  },
];

const AchivementCarts = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollNext = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      if (scrollLeft + clientWidth >= scrollWidth) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
      }
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-button left" onClick={scrollPrev}>
        &#8249;
      </button>

      <div className="carousel-track" ref={carouselRef}>
        {cardsData.map((card, index) => (
          <div className="carousel-card" key={index}>
            <img src={card.image} alt={card.title} className="carousel-image" />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <button className="read-more">Read More</button>
          </div>
        ))}
      </div>

      <button className="carousel-button right" onClick={scrollNext}>
        &#8250;
      </button>
    </div>
  );
};

export default AchivementCarts;
