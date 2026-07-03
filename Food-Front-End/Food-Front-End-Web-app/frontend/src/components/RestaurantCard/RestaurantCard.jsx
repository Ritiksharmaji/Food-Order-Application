import React from 'react'
import { useNavigate } from 'react-router-dom'
import './RestaurantCard.css'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate()
  const { currency } = useContext(StoreContext)

  return (
    <div className="restaurant-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
      <div className="restaurant-card-img">
        <img src={restaurant.image} alt={restaurant.name} />
        {restaurant.promoted && <span className="restaurant-card-promo">Promoted</span>}
        <span className="restaurant-card-time">{restaurant.deliveryTime}</span>
      </div>
      <div className="restaurant-card-body">
        <div className="restaurant-card-top">
          <h3>{restaurant.name}</h3>
          <span className="restaurant-card-rating">{restaurant.rating} ★</span>
        </div>
        <p className="restaurant-card-cuisines">{restaurant.cuisines}</p>
        <div className="restaurant-card-meta">
          <span>{currency}{restaurant.priceForTwo} for two</span>
          <span>{restaurant.distance}</span>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
