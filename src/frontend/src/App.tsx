import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
  
    fetch(`${import.meta.env.VITE_CANISTER_URL}/greet?name=${name}`)
      .then(response => response.json())
      .then((json) => {
        setGreeting(json.greeting);
      });
  }
  

  return (
    <>
  

      <header id="header">
        <div id="header-fixed-height" />
        <div id="sticky-header" className="menu-area">
          <div className="container custom-container">
            <div className="row">
              <div className="col-12">
                <div className="menu-wrap">
                  <nav className="menu-nav">
                    <div className="logo">
                      <a href="index.html">
                        <img src="assets/img/logo/KYcHAIN2.png" alt="Logo" />
                      </a>
                    </div>
                    <div className="navbar-wrap main-menu justify-content-center">
                      <nav className="main-nav">
                          <ul>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            <li><NavLink to="/integration-app">Integration App (Iframe)</NavLink></li>
                          </ul>
                      </nav>
                    </div>
                    <div className="header-action d-none d-md-block">
                      <ul>
                        <li className="header-btn">
                          <a href="profile.html">
                            <img src="assets/img/logo/profile.png" alt="Profile" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="mobile-menu">
                  <nav className="menu-box">
                    <div className="close-btn">
                      <i className="fas fa-times" />
                    </div>
                    <div className="nav-logo">
                      <a href="index.html">
                        <img src="assets/img/logo/logo.png" alt="Mobile Logo" />
                      </a>
                    </div>
                    <div className="menu-outer"></div>
                    <div className="social-links">
                      <ul className="clearfix">
                        <li>
                          <a href="#"><i className="fab fa-facebook-f" /></a>
                        </li>
                        <li>
                          <a href="#"><i className="fab fa-twitter" /></a>
                        </li>
                        <li>
                          <a href="#"><i className="fab fa-instagram" /></a>
                        </li>
                        <li>
                          <a href="#"><i className="fab fa-linkedin-in" /></a>
                        </li>
                        <li>
                          <a href="#"><i className="fab fa-youtube" /></a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="menu-backdrop" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="fix">
        <section className="banner-area banner-bg">
          <div className="banner-shape-wrap">
            <img src="assets/img/banner/banner_shape01.png" alt="Banner Shape 1" className="img-one" />
            <img src="assets/img/banner/banner_shape02.png" alt="Banner Shape 2" className="img-two" />
            <img src="assets/img/banner/banner_shape03.png" alt="Banner Shape 3" className="img-three" />
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="banner-content text-center">
                  <h2 className="title">ICP Identity -<span> KYC</span> Authenticator</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="about-area pt-130 pb-130">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-img wow fadeInLeft" data-wow-delay=".2s">
                  <img className="justify-content-center" style={{ maxWidth: "105%", marginLeft: "-15px" }} src="assets/img/images/gembok_lp.png" alt="About Image" />
                  <img src="assets/img/images/about_img02.png" alt="About Image 2" className="img-two" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content wow fadeInRight" data-wow-delay=".2s">
                  <div className="section-title mb-30">
                    <span className="sub-title">What is KYChain</span>
                    <h2 className="title">KYC <span>Authentication</span> Using ICP that could integrate Internet Identity with Web2 and Web3</h2>
                  </div>
                  <p>
                    KYC Authentication Using ICP for Web2 and Web3. The world’s 1st platform that offers seamless identity verification for both Web2 and Web3 applications, ensuring secure and efficient transactions across ecosystems.
                  </p>
                  <a href="#" className="btn">Get Your KYC</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="choose-area pb-130">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6">
                <div className="section-title text-center mb-50">
                  <span className="sub-title">Why Choose us</span>
                  <h2 className="title">Why choose our KYChain <span>Authentication</span></h2>
                </div>
              </div>
            </div>
            <div className="row choose-active">
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon01.svg" alt="Choose Icon 1" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Seamless KYC Integration</a></h2>
                    <p>Highlighting the ease of KYC integration across Web2 and Web3.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon02.svg" alt="Choose Icon 2" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Easy Web 2 Integration</a></h2>
                    <p>With Using Easy Iframe Embed and Post Notification to tell it is successful.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon03.svg" alt="Choose Icon 3" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Protect the identity</a></h2>
                    <p>Keeping user identities secure in decentralized networks.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon04.svg" alt="Choose Icon 4" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">AI Integrated</a></h2>
                    <p>Working Facial Validation for current user login in the IFrame Embed with Generative AI and Future Potential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="choose-area pb-130">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6">
                <div className="section-title text-center mb-50">
                  <span className="sub-title">App Flow</span>
                </div>
              </div>
            </div>
            <div className="row choose-active">
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon01.svg" alt="Choose Icon 1" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Login easily with ICP Internet Identity</a></h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon02.svg" alt="Choose Icon 2" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Complete your Profile</a></h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon03.svg" alt="Choose Icon 3" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Integrate your apps to get users</a></h2>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="choose-item">
                  <div className="choose-icon">
                    <img src="assets/img/icon/choose_icon04.svg" alt="Choose Icon 4" />
                  </div>
                  <div className="choose-content">
                    <h2 className="title"><a href="#">Embed on your Website using Iframe</a></h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer>
          <div className="container">
            <div className="footer-top pt-80 pb-40">
              <div className="row justify-content-between">
                <div className="col-lg-6 col-md-6">
                  <div className="footer-widget mb-50">
                    <div className="footer-logo mb-30">
                      <a href="index.html">
                        <img src="assets/img/logo/logo2.png" alt="Footer Logo" />
                      </a>
                    </div>
                    <div className="footer-text">
                      <p>Get your KYC authenticated and verified using KYChain today.</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="footer-widget mb-50">
                    <h2 className="footer-title">Quick Links</h2>
                    <ul>
                      <li><a href="#header">Home</a></li>
                      <li><a href="#about">About Us</a></li>
                      <li><a href="#contact">Contact Us</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="copyright-text">
                    <p>&copy; 2024 KYChain. All Rights Reserved.</p>
                  </div>
                </div>
                <div className="col-md-6">
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
