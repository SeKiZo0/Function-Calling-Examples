// import React from 'react'
import "./nav.css";

function Nav() {
  return (
    <div>
      <nav id="navbar">
  <ul className="navbar-items flexbox-col">
    <li className="navbar-logo flexbox-left">
      <a className="navbar-item-inner flexbox">
        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 1438.88 1819.54">
          <polygon points="925.79 318.48 830.56 0 183.51 1384.12 510.41 1178.46 925.79 318.48"/>
          <polygon points="1438.88 1663.28 1126.35 948.08 111.98 1586.26 0 1819.54 1020.91 1250.57 1123.78 1471.02 783.64 1663.28 1438.88 1663.28"/>
          
        </svg>
        
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="search-outline"></ion-icon>
        </div>
        <span className="link-text">Search</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="home-outline"></ion-icon>
        </div>
        <span className="link-text">Home</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="folder-open-outline"></ion-icon>
        </div>
        <span className="link-text">Projects</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="pie-chart-outline"></ion-icon>
        </div>
        <span className="link-text">Dashboard</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="people-outline"></ion-icon>
        </div>
        <span className="link-text">Team</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="chatbubbles-outline"></ion-icon>
        </div>
        <span className="link-text">Support</span>
      </a>
    </li>
    <li className="navbar-item flexbox-left">
      <a className="navbar-item-inner flexbox-left">
        <div className="navbar-item-inner-icon-wrapper flexbox">
          <ion-icon name="settings-outline"></ion-icon>
        </div>
        <span className="link-text">Settings</span>
      </a>
    </li>
  </ul>
</nav>

<div className="spacer"></div>

    </div>
  );
}

export default Nav;
