//import React from "react";
import "./TermsModal.css";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="terms-overlay">
      <div className="terms-modal">
        <h2>Terms & Conditions</h2>
        <ul className="terms-list">
          <li>This app is designed for <strong className="highlight-text">practice purposes only</strong>.</li>
          <li>While we aim for accuracy, <strong className="highlight-text">we do not guarantee</strong> the correctness of every question or answer.</li>
          <li>Questions are based on <strong className="highlight-text">publicly available dumps</strong>; if there are inaccuracies in the source, they may reflect here.</li>
          <li><strong className="highlight-text">Do not rely solely</strong> on this app to prepare for the PCAP exam.</li>
          <li>Focus on <strong className="highlight-text">learning concepts</strong>, not memorizing answers.</li>
          <li>There's <strong >no guarantee</strong> these questions will appear in the actual certification exam.</li>
        </ul>
        <button className="terms-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
