import React, { useState } from 'react';

const LivePreview = () => {
  const [surname, setSurname] = useState('Agrawals');
  const [names, setNames] = useState('Sachin &');

  // Replace this URL with a high-res image of a stone or wooden wall
  const wallImageUrl = "https://www.pngarts.com/files/11/Vector-Name-Plate-Transparent-Image.png";

  return (
    <section className="py-5 bg-light">
      <div className="container shadow-lg rounded-5 overflow-hidden border-0 bg-white">
        <div className="row g-0">
          
          {/* Left Side: Image Background Preview */}
          <div className="col-lg-7 position-relative d-flex align-items-center justify-content-center p-5 overflow-hidden" 
             style={{ 
       minHeight: '450px', 
       aspectRatio: '16 / 9', // Standard cinematic ratio for a "wall" look
       borderRadius: '24px 0 0 24px' // Matches the container rounding
     }}>
  
  {/* Background Image Layer */}
  <div className="position-absolute top-0 start-0 w-100 h-100"
       style={{ 
         backgroundImage: `url(${wallImageUrl})`,
         backgroundSize: 'cover',   // Scales image to fill, may crop slightly
         backgroundPosition: 'center', 
         backgroundRepeat: 'no-repeat',
         filter: 'brightness(0.6)', // Darken a bit more to make text "pop"
         zIndex: 1
       }}>
  </div>

            {/* The Nameplate (Glassmorphism Effect) */}
            <div className="nameplate-card shadow-2xl d-flex flex-column align-items-center justify-content-center p-4 text-center"
                 style={{ zIndex: 2 }}>
              <div className="border-bottom border-dark border-2 mb-2 px-3">
                <p className="mb-0 text-uppercase tracking-tighter small fw-bold text-dark" style={{ fontSize: '0.75rem', letterSpacing: '3px' }}>
                  {names}
                </p>
              </div>
              <h2 className="display-4 fw-normal mb-0" style={{ fontFamily: '"Playfair Display", serif', color: '#1a1a1a' }}>
                {surname}
              </h2>
              <div className="mt-3 opacity-75">
                 {/* Custom SVG Warli Art representation */}
                <svg width="200" height="30" viewBox="0 0 200 30" fill="currentColor">
                   <circle cx="20" cy="15" r="3" /> <circle cx="180" cy="15" r="3" />
                   <path d="M40 15 L60 15 M140 15 L160 15" stroke="black" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side: Inputs */}
          <div className="col-lg-5 p-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4">
              <h2 className="fw-bold mb-1">Live Preview</h2>
              <p className="text-muted small">Customize your entrance in real-time</p>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase text-muted">Names (Top Line)</label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0" 
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Family Surname</label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0" 
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>

        <button className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm py-3 fw-bold">
              Confirm & Purchase
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

        .nameplate-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          width: 85%;
          max-width: 450px;
          aspect-ratio: 3.5 / 1.5;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          transform: rotateX(5deg) rotateY(-5deg);
        }

        .form-control:focus {
          background-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05) !important;
        }
      `}</style>
    </section>
  );
};

export default LivePreview;