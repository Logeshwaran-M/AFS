import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";

import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("Small");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const carouselRef = useRef(null);

  const sizes = ["Small", "Medium", "Large"];

  // 🔥 FETCH PRODUCT + RELATED
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);

          // set main image
          if (productData.images?.length > 0) {
            setMainImage(productData.images[0]);
          }

          // related products
          const q = query(
            collection(db, "products"),
            where("category", "==", productData.category)
          );

          const snapshot = await getDocs(q);

          const related = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(item => item.id !== id);

          setRelatedProducts(related);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 FETCH REVIEWS
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", id)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setReviews(data);
    };

    fetchReviews();
  }, [id]);

  // 🔁 CAROUSEL
  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  };

  return (
    <Container className="py-5">
      <Row className="g-5">

        {/* LEFT IMAGE */}
        <Col md={7}>
          <div className="mb-3">
            <img
              src={mainImage || product?.images?.[0]}
              className="img-fluid"
              alt="product"
            />
          </div>

          <Row className="g-2">
            {product?.images?.map((img, i) => (
              <Col xs={3} key={i}>
                <img
                  src={img}
                  className="img-fluid thumb-img"
                  onClick={() => setMainImage(img)}
                  alt=""
                  style={{ cursor: "pointer" }}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={5}>
          <Badge bg="dark" className="mb-2">Trending</Badge>

          <h2 className="fw-bold">{product?.name}</h2>

          {/* ⭐ Rating (simple) */}
          <div className="text-warning mb-2">
            {"★".repeat(5)}
            <span className="text-muted ms-2">
              ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-3">
            <h3 className="fw-bold">₹{product?.price}</h3>
            <span className="text-decoration-line-through text-muted">
              ₹999
            </span>
            <Badge bg="success">35% OFF</Badge>
          </div>

          <hr />

          {/* Size */}
          <h6>Select Size</h6>
          <div className="d-flex gap-2 mb-3">
            {sizes.map((s) => (
              <Button
                key={s}
                variant={selectedSize === s ? "dark" : "outline-dark"}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Buttons */}
          <div className="d-grid gap-2">
            <Button variant="dark" size="lg">
              <FaShoppingCart className="me-2" />
              Add to Cart
            </Button>

            <Button variant="warning" size="lg">
              ⚡ Buy Now
            </Button>

            <Button
              variant="outline-dark"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              <span className="ms-2">Wishlist</span>
            </Button>
          </div>

          <Card className="mt-4 p-3 bg-light">
            <small>🚚 Delivery in 3-5 days</small>
          </Card>
        </Col>
      </Row>

      {/* ⭐ REVIEWS PREVIEW */}
      <Row className="mt-5">
        <Col md={8}>
          <h4>Customer Reviews</h4>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.slice(0, 3).map((rev) => (
              <Card key={rev.id} className="mb-3 p-3 shadow-sm">
                <div className="d-flex justify-content-between">
                  <strong>{rev.userName}</strong>
                  <span className="text-warning">
                    {"★".repeat(rev.rating)}
                  </span>
                </div>
                <p className="mb-0 text-muted">{rev.comment}</p>
              </Card>
            ))
          )}

          {/* 🔥 BUTTONS */}
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="dark"
              onClick={() => navigate(`/review/${id}`)}
            >
              View All Reviews
            </Button>

            <Button
              variant="outline-dark"
              onClick={() => navigate(`/review/${id}`)}
            >
              Write Review
            </Button>
          </div>
        </Col>
      </Row>

      {/* 🔥 RELATED PRODUCTS */}
      <Row className="mt-5">
        <Col>
          <div className="d-flex justify-content-between mb-3">
            <h4>You May Also Like</h4>
          </div>

          <div className="carousel-wrapper">
            <button className="carousel-btn left" onClick={scrollLeft}>
              ‹
            </button>

            <div className="carousel-track" ref={carouselRef}>
              {relatedProducts.map((p) => (
                <div className="carousel-card" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <button className="carousel-btn right" onClick={scrollRight}>
              ›
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;