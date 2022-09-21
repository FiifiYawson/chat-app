import github from "../images/github-logo.svg";
import phone from "../images/phone-image.svg";
import gmail from "../images/Gmail logo.svg";
import "../styles/footer.css";

function Footer() {
    return (
        <footer>
          <div>
              <a className="footer-link" href="https://github.com/FiifiYawson/chat-app">
              <img src={github} alt="" />
              <span>Source</span>
              </a>
              <a className="footer-link" href="tel: +233 260 824 850">
                <img src={phone} alt="" />
                <span>+233 260 824 850</span>
              </a>
              <a className="footer-link" href="mailto: ghyawson@gmail.com">
                <img src={gmail} alt="" />
                <span>E-mail</span>
              </a>
          </div>
        </footer>
    )
}

export default Footer