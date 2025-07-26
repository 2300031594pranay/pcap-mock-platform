import "./Footer.css";
import { useState } from "react";
import TermsModal from "./TermsModal";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 PCAP Practice Platform. All rights reserved.</p>
          <p>Practice makes perfect! Good luck with your PCAP certification.</p>
          <a
            href="#"
            className="terms-link"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
          >
            Terms & Conditions
          </a>
        </div>
      </footer>

      {showModal && <TermsModal isOpen={true} onClose={() => setShowModal(false)} />}
    </>
  );
}
