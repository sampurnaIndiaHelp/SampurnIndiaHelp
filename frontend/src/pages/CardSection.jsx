import React from "react";
import "../styles/CardSection.css";
import { FaChild, FaDonate, FaClipboardList } from "react-icons/fa";

const cardsData = [
  {
    id: 1,
    icon: <FaChild size={40} color="#ff6700" />,
    title: "CHILDREN'S CARE",
    description:
      "Supporting children's wellbeing through compassionate care and essential resources.",
  },
  {
    id: 2,
    icon: <FaDonate size={40} color="#ff6700" />,
    title: "DONATE FUND",
    description:
      "Contribute to meaningful causes with no expectation of financial return.",
  },
  {
    id: 3,
    icon: <FaClipboardList size={40} color="#ff6700" />,
    title: "DONATION PLAN",
    description:
      "Flexible giving plans designed to make your donations impactful and sustainable.",
  },
];

export default function CardsSection() {
  return (
    <div className="cards-section">
      {cardsData.map(({ id, icon, title, description }) => (
        <div key={id} className="card">
          <div className="icon-circle">{icon}</div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}
