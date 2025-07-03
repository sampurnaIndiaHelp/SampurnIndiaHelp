import React from "react";


import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CardsSection from "./CardSection";
import HeroSection from "./HeroSection";
import Achievement from "./Achivments";
import AchivementCarts from "./AchievementCarts";

import HitCounter from "./HitCounter";
import About from "./About"
import AboutInfo from "./AboutInfo";

function Home() {
  return (
    <div className="home">
<div><Header/></div>
<div><Navbar /></div>
<div><HeroSection/></div>
<div><CardsSection/></div>
<div><About/></div>
<div><Achievement/></div>
<div><AchivementCarts/></div>
<div><HitCounter/></div>
<div><AboutInfo/></div>

    
    </div>
  );
}

export default Home;
