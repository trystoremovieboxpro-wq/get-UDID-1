import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/DeviceDetails.css';

interface Device {
  id: string;
  udid: string;
  device_name: string;
  device_product: string;
  device_version: string;
  mac_address: string;
  imei: string;
  iccid: string;
  created_at: string;
}

export default function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevice();
  }, [id]);

  const fetchDevice = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('Device not found');
      } else {
        setDevice(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch device information');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleEmail = () => {
    if (!device) return;

    const subject = encodeURIComponent('My iOS Device Information');
    const body = encodeURIComponent(
      `Device Information:\n\n` +
      `UDID: ${device.udid}\n` +
      `Device Name: ${device.device_name}\n` +
      `Product: ${device.device_product}\n` +
      `iOS Version: ${device.device_version}\n` +
      (device.mac_address ? `MAC Address: ${device.mac_address}\n` : '') +
      (device.imei ? `IMEI: ${device.imei}\n` : '') +
      (device.iccid ? `ICCID: ${device.iccid}\n` : '')
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="details-container">
        <Card className="details-card">
          <div className="loading">Loading device information...</div>
        </Card>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="details-container">
        <Card className="details-card">
          <div className="error-state">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h2>{error || 'Device not found'}</h2>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="details-container">
      <Card className="details-card">
        <div className="success-icon">
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="details-title">Device Information Retrieved</h1>
        <p className="details-subtitle">Your iOS device details are listed below</p>

        <div className="device-info">
          <div className="info-item">
            <label>UDID</label>
            <div className="info-value">
              <span className="value-text">{device.udid}</span>
              <button
                className="copy-button"
                onClick={() => handleCopy(device.udid, 'UDID')}
                title="Copy UDID"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </div>

          {device.device_name && (
            <div className="info-item">
              <label>Device Name</label>
              <div className="info-value">
                <span className="value-text">{device.device_name}</span>
              </div>
            </div>
          )}

          {device.device_product && (
            <div className="info-item">
              <label>Product</label>
              <div className="info-value">
                <span className="value-text">{device.device_product}</span>
              </div>
            </div>
          )}

          {device.device_version && (
            <div className="info-item">
              <label>iOS Version</label>
              <div className="info-value">
                <span className="value-text">{device.device_version}</span>
              </div>
            </div>
          )}

          {device.mac_address && (
            <div className="info-item">
              <label>MAC Address</label>
              <div className="info-value">
                <span className="value-text">{device.mac_address}</span>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(device.mac_address, 'MAC Address')}
                  title="Copy MAC Address"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {device.imei && (
            <div className="info-item">
              <label>IMEI</label>
              <div className="info-value">
                <span className="value-text">{device.imei}</span>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(device.imei, 'IMEI')}
                  title="Copy IMEI"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {device.iccid && (
            <div className="info-item">
              <label>ICCID</label>
              <div className="info-value">
                <span className="value-text">{device.iccid}</span>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(device.iccid, 'ICCID')}
                  title="Copy ICCID"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <Button onClick={handleEmail} variant="primary">
            Send via Email
          </Button>
          <Button onClick={() => navigate('/')} variant="secondary">
            Check Another Device
          </Button>
        </div>
      </Card>
    </div>
  );
}
