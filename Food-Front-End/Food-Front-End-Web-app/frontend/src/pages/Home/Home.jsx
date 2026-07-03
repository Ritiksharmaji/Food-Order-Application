import React, { useContext } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import AppDownload from '../../components/AppDownload/AppDownload'
import FoodItem from '../../components/FoodItem/FoodItem'
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard'
import { StoreContext } from '../../Context/StoreContext'
import { restaurants } from '../../data/restaurants'

const Home = () => {
  const { food_list } = useContext(StoreContext)
  const navigate = useNavigate()

  const topDishes = food_list.slice(0, 10)
  const topRestaurants = restaurants.slice(0, 10)

  return (
    <>
      <Header />

      {/* Top dishes */}
      <div className="home-section">
        <div className="home-section-head">
          <div>
            <h2>Top 10 Dishes Near You</h2>
            <p>Handpicked favourites loved by foodies around you</p>
          </div>
          <button onClick={() => navigate('/menu')}>Explore more menu →</button>
        </div>

        {topDishes.length === 0 ? (
          <p className="home-empty">Loading delicious dishes…</p>
        ) : (
          <div className="home-grid">
            {topDishes.map((item) => (
              <FoodItem key={item._id} id={item._id} name={item.name} desc={item.description} price={item.price} image={item.image} />
            ))}
          </div>
        )}
      </div>

      {/* Top restaurants */}
      <div className="home-section">
        <div className="home-section-head">
          <div>
            <h2>Top 10 Restaurants Near You</h2>
            <p>Order from the best-rated kitchens in town</p>
          </div>
        </div>
        <div className="home-grid home-grid-restaurants">
          {topRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>

      <AppDownload />
    </>
  )
}

export default Home
