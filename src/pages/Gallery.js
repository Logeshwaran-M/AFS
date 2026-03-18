import React, { useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";

const Gallery = () => {

  const [show, setShow] = useState(false);
  const [activeImg, setActiveImg] = useState("");

  // 🔥 SAMPLE IMAGES (replace with your product images)
  const images = [
    "https://picsum.photos/500/500?1",
    "https://picsum.photos/500/500?2",
    "https://picsum.photos/500/500?3",
    "https://picsum.photos/500/500?4",
    "https://picsum.photos/500/500?5",
    "https://picsum.photos/500/500?6"
  ];

  const openModal = (img) => {
    setActiveImg(img);
    setShow(true);
  };

  return (
    <Container className="py-5">

      <h2 className="text-center mb-4 fw-bold">Our Gallery</h2>

      <Row>
        {images.map((img, index) => (
          <Col md={4} sm={6} xs={12} key={index} className="mb-4">

            <div
              className="gallery-card"
              onClick={() => openModal(img)}
            >
              <img src={img} alt="gallery" className="img-fluid" />

              <div className="overlay">
                <span>View</span>
              </div>
            </div>

          </Col>
        ))}
      </Row>

      {/* 🔥 MODAL */}
      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Body className="p-0">
          <img src={activeImg} alt="preview" className="w-100" />
        </Modal.Body>
      </Modal>

      {/* 🔥 STYLE */}
      <style>{`
        .gallery-card {
          position: relative;
          overflow: hidden;
          border-radius: 15px;
          cursor: pointer;
        }

        .gallery-card img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .gallery-card:hover img {
          transform: scale(1.1);
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: 0.3s;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
        }

        .gallery-card:hover .overlay {
          opacity: 1;
        }
      `}</style>

    </Container>
  );
};

export default Gallery;