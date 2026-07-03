import React, { useContext, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Restaurant.css'
import { StoreContext } from '../../Context/StoreContext'
import { restaurantById, restaurantMenu } from '../../data/restaurants'
import FoodItem from '../../components/FoodItem/FoodItem'

const Restaurant = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { food_list, currency } = useContext(StoreContext)
  const restaurant = restaurantById(id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  const topFive = useMemo(() => restaurantMenu(id, food_list, 5), [id, food_list])
  const more = useMemo(() => {
    const topIds = new Set(topFive.map((f) => f._id))
    return food_list.filter((f) => !topIds.has(f._id)).slice(0, 8)
  }, [food_list, topFive])

  if (!restaurant) {
    return (
      <div className="restaurant-notfound">
        <p>Restaurant not found.</p>
        <button onClick={() => navigate('/')}>Back to home</button>
      </div>
    )
  }

  return (
    <div className="restaurant">
      {/* Banner */}
      <div className="restaurant-banner">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="restaurant-banner-shade" />
        <div className="restaurant-banner-content">
          {restaurant.promoted && <span className="restaurant-tag">Promoted</span>}
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisines}</p>
        </div>
      </div>

      {/* Info bar */}
      <div className="restaurant-info">
        <div className="restaurant-info-item">
          <span className="restaurant-info-num">{restaurant.rating} ★</span>
          <span className="restaurant-info-label">Rating</span>
        </div>
        <div className="restaurant-info-divider" />
        <div className="restaurant-info-item">
          <span className="restaurant-info-num">{restaurant.deliveryTime}</span>
          <span className="restaurant-info-label">Delivery</span>
        </div>
        <div className="restaurant-info-divider" />
        <div className="restaurant-info-item">
          <span className="restaurant-info-num">{currency}{restaurant.priceForTwo}</span>
          <span className="restaurant-info-label">For two</span>
        </div>
        <div className="restaurant-info-divider" />
        <div className="restaurant-info-item">
          <span className="restaurant-info-num">{restaurant.distance}</span>
          <span className="restaurant-info-label">Away</span>
        </div>
      </div>

      <p className="restaurant-address">📍 {restaurant.address}</p>

      {/* Top 5 dishes */}
      <div className="restaurant-section">
        <h2>Top 5 dishes</h2>
        {topFive.length === 0 ? (
          <p className="restaurant-empty">Menu is being updated. Check back soon!</p>
        ) : (
          <div className="restaurant-grid">
            {topFive.map((item) => (
              <FoodItem key={item._id} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        )}
      </div>

      {/* Explore more food */}
      {more.length > 0 && (
        <div className="restaurant-section">
          <div className="restaurant-section-head">
            <h2>Explore more food</h2>
            <button onClick={() => navigate('/menu')}>See full menu →</button>
          </div>
          <div className="restaurant-grid">
            {more.map((item) => (
              <FoodItem key={item._id} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Restaurant
