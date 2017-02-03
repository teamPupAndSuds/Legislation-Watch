const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;


class About extends React.Component {
  render() {
    return (
        <div>
          <link rel="stylesheet" href="../../css/about.css" />

          <section id="banner">
            <div className="inner">
              <header>
                <h1>Welcome to Legislation Watcher</h1>
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
                  <h3>Notifiy</h3>
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

          <section id="three" className="wrapper align-center">
            <div className="inner">
              <div className="flex flex-2">
                <article>
                  <div className="image round">
                    <img src="images/pic01.jpg" alt="Pic 01" />
                  </div>
                  <header>
                    <h3>Lorem ipsum<br /> dolor amet nullam</h3>
                  </header>
                  <p>Morbi in sem quis dui placerat ornare. Pellentesquenisi<br />euismod in, pharetra a, ultricies in diam sed arcu. Cras<br />consequat  egestas augue vulputate.</p>
                  <footer>
                    <a href="#" className="button">Learn More</a>
                  </footer>
                </article>
                <article>
                  <div className="image round">
                    <img src="images/pic02.jpg" alt="Pic 02" />
                  </div>
                  <header>
                    <h3>Sed feugiat<br /> tempus adipicsing</h3>
                  </header>
                  <p>Pellentesque fermentum dolor. Aliquam quam lectus<br />facilisis auctor, ultrices ut, elementum vulputate, nunc<br /> blandit ellenste egestagus commodo.</p>
                  <footer>
                    <a href="#" className="button">Learn More</a>
                  </footer>
                </article>
              </div>
            </div>
          </section>

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

              <div className="copyright">
                &copy; Untitled. Design: <a href="https://templated.co">TEMPLATED</a>. Images: <a href="https://unsplash.com">Unsplash</a>.
              </div>

            </div>
          </footer>          
        </div>
    );
  }
}

module.exports = About;