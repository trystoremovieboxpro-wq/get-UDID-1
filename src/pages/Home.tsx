import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/Home.css';

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const configUrl = `${supabaseUrl}/functions/v1/get-mobileconfig`;

      const response = await fetch(configUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'device.mobileconfig';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download configuration profile. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="home-container">
      <Card className="home-card">
        <div className="icon-container">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>

        <h1 className="title">iOS Device UDID Retriever</h1>

        <p className="description">
          Retrieve your iOS device's UDID (Unique Device Identifier) by installing a configuration profile.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Download Profile</h3>
              <p>Click the button below to download the configuration profile</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Install Profile</h3>
              <p>Go to Settings → Profile Downloaded → Install</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>View Details</h3>
              <p>Your device information will be displayed automatically</p>
            </div>
          </div>
        </div>

        <Button onClick={handleDownload} className="download-button">
          {isDownloading ? 'Preparing Download...' : 'Download Configuration Profile'}
        </Button>

        <div className="info-box">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>This profile is safe and only retrieves basic device information. No personal data is collected.</p>
        </div>
      </Card>
    </div>
  );
}
