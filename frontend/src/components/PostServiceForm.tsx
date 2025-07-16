"use client";

import React, { useState, useRef } from 'react';
import './PostServiceForm.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiPlusCircle } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Fix Leaflet default marker issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface PostServiceFormProps {
  onClose: () => void;
   openLogin: () => void;
   user: any;
}

const serviceNameSuggestions = [
  'Plumber', 'Electrician', 'Cleaner', 'Carpenter', 'Painter',
  'AC Repair', 'Appliance Repair', 'Pest Control', 'Gardener', 'Home Renovation',
  'Tutor', 'Yoga Instructor', 'Photographer', 'Web Developer', 'Content Writer'
];

const PostServiceForm: React.FC<PostServiceFormProps> = ({ onClose }) => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [type, setType] = useState('service');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [searchTermService, setSearchTermService] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_REAL_OPENCAGE_API_KEY&language=en&pretty=1`
            );
            const result = response.data.results[0];
            if (result) {
              const formatted = result.formatted;
              setAddress(`${formatted} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              toast.success("✅ Location Detected Successfully!");
            } else {
              setAddress(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              toast.warn("⚠️ Location detected, but address not found.");
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            toast.error("❌ Failed to retrieve address. Check internet or API Key.");
            setAddress(`(${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("❌ Location access denied. Please allow location.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("❌ Geolocation not supported by your browser.");
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setAddress(null);
    toast.info("📍 Location cleared.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ You can post this data to your backend here
    const postData = {
      serviceName,
      description,
      experience,
      category,
      price,
      features,
      location,
      images: uploadedImages,
    };

    console.log("Submitting Service Data:", postData);
    toast.success('✅ Service Posted!');
    onClose();
  };

  const filteredServiceSuggestions = searchTermService
    ? serviceNameSuggestions.filter(service =>
        service.toLowerCase().includes(searchTermService.toLowerCase())
      )
    : [];

  const handleServiceSuggestionClick = (service: string) => {
    setSelectedServiceName(service);
    setServiceName(service);
    setSearchTermService(service);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...uploadedImages];
        newImages[index] = reader.result as string;
        setUploadedImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  return (
    <div className="post-form-overlay fade-in">
      <div className="post-form-container slide-up">
        <button className="back-button" onClick={onClose}>←</button>

        <div className="welcome-banner">
          <h2>Post Your Service</h2>
          <p>Make your business visible to nearby users.</p>
        </div>

        <div className="type-selector">
          <button
            className={type === 'service' ? 'active-service' : ''}
            onClick={() => setType('service')}
          >🔧 Service Provider</button>
          <button
            className={type === 'owner' ? 'active-owner' : ''}
            onClick={() => setType('owner')}
          >🏪 Owner</button>
        </div>

        <div className="image-upload-wrapper">
          <h3>Upload Your Service Images</h3>
          <div className="image-scroll-section-postform">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="image-upload-card" onClick={() => triggerFileInput(i)}>
                {uploadedImages[i] ? (
                  <img src={uploadedImages[i]} alt={`Uploaded ${i}`} className="uploaded-image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <FiPlusCircle className="upload-icon" />
                    <p>Add Image</p>
                  </div>
                )}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, i)}
                  ref={(el) => void (fileInputRefs.current[i] = el)}
                  accept="image/*"
                />
              </div>
            ))}
          </div>
          <p className="image-tip">Upload good quality images of your service.</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group sticky-searchbar">
            <label>Service Name</label>
            <input
              type="text"
              placeholder="Search or type your service..."
              value={searchTermService}
              onChange={(e) => {
                setSearchTermService(e.target.value);
                setServiceName(e.target.value);
                setSelectedServiceName('');
              }}
              required
            />
            {filteredServiceSuggestions.length > 0 && searchTermService && (
              <div className="post-form-suggestions">
                {filteredServiceSuggestions.map((service, index) => (
                  <div
                    key={index}
                    className="suggestion-item-post-form"
                    onClick={() => handleServiceSuggestionClick(service)}
                  >
                    {service}
                  </div>
                ))}
              </div>
            )}
            {selectedServiceName && (
              <div className="selected-service-display-post-form">
                Selected: <strong>{selectedServiceName}</strong>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="e.g., Plumbing, Cleaning"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 2"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Price (in ₹)</label>
            <input
              type="number"
              placeholder="e.g., ₹499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Key Features</label>
            <textarea
              placeholder="e.g., Certified professional, same-day service"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <button type="button" className="location-btn" onClick={handleLocation}>
              {location ? '📍 Location Added' : 'Add Location'}
            </button>
          </div>

          {location && (
            <div className="live-map">
              <div className="map-header">
                <h4>Your Location</h4>
                <button className="close-map-btn" onClick={clearLocation}>✖</button>
              </div>
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '300px', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    You are here <br /> {address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {location && <div className="location-display">{address}</div>}

          <button type="submit" className="submit-btn">✅ Post Now</button>
        </form>
      </div>
    </div>
  );
};

export default PostServiceForm;