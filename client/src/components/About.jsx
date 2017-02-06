////////////////////////////////////////////////////////////////////////////////
// About.jsx
// --------------------------
// This is the landing page for the application.
//
// This is based on the "Projection" by TEMPLATED
// Users are redirected to this page if they have not logged in
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;


class About extends React.Component {
  render() {
    return (
        <div>
          <link rel="stylesheet" href="../../css/about.css" />

          {/* Front Scene */}
          <section id="banner">
            <div className="inner">
              <header>
                <h1>Welcome to Legislation Watch</h1>
              </header>

              <div className="flex ">

                <div>
                  <span className="glyphicon glyphicon-search"></span>
                  <h3>Search</h3>
                  <p>by Keywords</p>
                </div>

                <div>
                  <span className="glyphicon glyphicon-eye-open"></span>
                  <h3>Monitor</h3>
                  <p>New Bills</p>
                </div>

                <div>
                  <span className="glyphicon glyphicon-envelope"></span>
                  <h3>Notify</h3>
                  <p>by Email</p>
                </div>

              </div>

              <footer className="flex">
                <div>
                  <Link to="/signup" className="button">Sign Up</Link>
                </div>
                <div>
                  <Link to="/login" className="button">Log In</Link>
                </div>
              </footer>
            </div>
          </section>

          {/* About / Information  Section */}
          <section id="three" className="wrapper align-center">
            <div className="inner">
              <div className="flex flex-2">
                <article>
                  <div className="image round">
                    <img src="images/pic01.jpg" alt="Pic 01" />
                  </div>
                  <header>
                    <h3>Stay on the forefront<br /> of legislations that affects you.</h3>
                  </header>
                  <p>An app for people who want to know what's happening in congress about issues they care about. 
                  The app fetches the latest bills drafted in congress and matches them to keywords you're interested in.
                  Then delivers them to your in-app dashboard, and email.</p>
                  <footer>
                    <Link to="/signup" className="button">Signup</Link>
                  </footer>
                </article>
              </div>
            </div>
          </section>

        {/* Get In Touch Section */}
          <footer id="footer">
            <div className="inner">

              <h3>Get in touch</h3>

              <form action="#" method="post">

                <div className="field half first">
                  <label htmlFor="name">Name</label>
                  <input name="name" id="name" type="text" placeholder="Name" />
                </div>
                <div className="field half">
                  <label htmlFor="email">Email</label>
                  <input name="email" id="email" type="email" placeholder="Email" />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea name="message" id="message" rows="6" placeholder="Message"></textarea>
                </div>
                <ul className="actions">
                  <li><input value="Send Message" className="button alt" type="submit" /></li>
                </ul>
              </form>

            </div>
          </footer>          
        </div>
    );
  }
}

module.exports = About;