import { Link } from "react-router-dom";
import "./PropertyCard.css";

function PropertyCard({ property }) {
  const {
    _id,
    title,
    location,
    price,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    purpose,
    images,
  } = property;

  const image =
    images?.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="property-card">
      <div className="property-image-wrapper">
        <img src={image} alt={title} className="property-image" />

        <div className="property-badges">
          <span className="property-purpose">{purpose}</span>

          <button className="favorite-btn" aria-label="Add to favorites">
            ♡
          </button>
        </div>
      </div>

      <div className="property-card-content">
        <div className="property-card-top">
          <span className="property-type">{propertyType}</span>

          <span className="property-area">{area} sq ft</span>
        </div>

        <h3 className="property-title">{title}</h3>

        <p className="property-location">
          <span>⌖</span>
          {location}
        </p>

        <div className="property-details">
          <div>
            <strong>{bedrooms ?? 0}</strong>
            <span>Beds</span>
          </div>

          <div>
            <strong>{bathrooms ?? 0}</strong>
            <span>Baths</span>
          </div>

          <div>
            <strong>{area}</strong>
            <span>sq ft</span>
          </div>
        </div>

        <div className="property-card-bottom">
          <div className="property-price">
            <span>Price</span>

            <strong>Rs. {Number(price).toLocaleString()}</strong>
          </div>

          <Link to={`/properties/${_id}`} className="view-property-btn">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
