import "../styles/login.css";
import background from "../images/background.png";
import Form from "../components/Form";
import Footer from "../components/Footer"

const Hello = () => {
  
  return (
    <>
      <div id="background" style={{ backgroundImage: `url(${background})` }}> </div>
      <div id="container" >
        <Form />
        <div className="space"></div>
        <Footer />
      </div>
    </>
  )
}

export default Hello