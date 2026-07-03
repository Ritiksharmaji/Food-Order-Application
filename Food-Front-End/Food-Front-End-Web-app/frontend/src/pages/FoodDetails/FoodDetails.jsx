import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import './FoodDetails.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import { restaurantForFood } from '../../data/restaurants'

const REVIEW_KEY = (id) => `fd_reviews_${id}`

const Stars = ({ value, size = 16, onSelect }) => {
  return (
    <span className="fd-stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= Math.round(value) ? 'fd-star on' : 'fd-star'}
          onClick={onSelect ? () => onSelect(n) : undefined}
          style={onSelect ? { cursor: 'pointer' } : undefined}
        >
          ★
        </span>
      ))}
    </span>
  )
}

const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { food_list, url, currency, addToCart, cartItems, user } = useContext(StoreContext)

  const food = useMemo(() => food_list.find((f) => f._id === id), [food_list, id])

  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })

  // Load device-local reviews for this dish (backend has no reviews API).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(REVIEW_KEY(id)) || '[]')
      setReviews(Array.isArray(saved) ? saved : [])
    } catch {
      setReviews([])
    }
    setQty(1)
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, name: f.name || user.name }))
  }, [user])

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : 4.6

  const similar = useMemo(
    () => food_list.filter((f) => food && f.category === food.category && f._id !== food._id).slice(0, 4),
    [food_list, food]
  )

  if (!food) {
    return (
      <div className="fd-loading">
        <p>Loading dish…</p>
        <button onClick={() => navigate('/')}>Back to home</button>
      </div>
    )
  }

  const restaurant = restaurantForFood(food._id)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(food._id)
    toast.success(`${qty} × ${food.name} added to cart`)
  }

  const submitReview = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) {
      toast.error('Please add your name and a comment')
      return
    }
    const next = [
      { name: form.name.trim(), rating: Number(form.rating), comment: form.comment.trim(), date: new Date().toISOString() },
      ...reviews,
    ]
    setReviews(next)
    localStorage.setItem(REVIEW_KEY(id), JSON.stringify(next))
    setForm({ name: user?.name || '', rating: 5, comment: '' })
    toast.success('Thanks for your feedback!')
  }

  return (
    <div className="food-details">
      {/* Breadcrumb */}
      <div className="fd-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/menu">Menu</Link> <span>/</span>
        <span className="fd-crumb-active">{food.name}</span>
      </div>

      <div className="fd-top">
        <div className="fd-image-wrap">
          <img src={url + '/images/' + food.image} alt={food.name} />
        </div>

        <div className="fd-info">
          <span className="fd-category">{food.category}</span>
          <h1>{food.name}</h1>

          <div className="fd-rating-row">
            <Stars value={avgRating} />
            <b>{avgRating.toFixed(1)}</b>
            <span className="fd-review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>

          <p className="fd-price">{currency}{food.price}</p>
          <p className="fd-desc">{food.description}</p>

          <ul className="fd-highlights">
            <li><span>🍽️</span> Freshly prepared to order</li>
            <li><span>⏱️</span> 30–40 min delivery</li>
            <li><span>🔥</span> Chef&apos;s special from {food.category}</li>
            <li><span>✅</span> 100% quality guarantee</li>
          </ul>

          <div className="fd-actions">
            <div className="fd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="fd-add-btn" onClick={handleAddToCart}>
              Add to Cart · {currency}{food.price * qty}
            </button>
            <button className="fd-cart-btn" onClick={() => navigate('/cart')}>
              Go to Cart{cartItems[food._id] ? ` (${cartItems[food._id]})` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant details */}
      <div className="fd-section">
        <h2>Restaurant</h2>
        <div className="fd-restaurant" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
          <img className="fd-restaurant-img" src={restaurant.image} alt={restaurant.name} />
          <div className="fd-restaurant-info">
            <div className="fd-restaurant-top">
              <h3>{restaurant.name}</h3>
              <span className="fd-restaurant-rating">{restaurant.rating} ★</span>
            </div>
            <p className="fd-restaurant-cuisines">{restaurant.cuisines}</p>
            <div className="fd-restaurant-meta">
              <span>🕒 {restaurant.deliveryTime}</span>
              <span>💰 {currency}{restaurant.priceForTwo} for two</span>
              <span>📍 {restaurant.distance}</span>
            </div>
            <p className="fd-restaurant-addr">{restaurant.address}</p>
          </div>
          <button className="fd-restaurant-btn" onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}`) }}>
            Visit restaurant →
          </button>
        </div>
      </div>

      {/* Reviews & feedback */}
      <div className="fd-section">
        <h2>Ratings &amp; Feedback</h2>
        <div className="fd-review-summary">
          <div className="fd-avg">
            <span className="fd-avg-num">{avgRating.toFixed(1)}</span>
            <Stars value={avgRating} size={18} />
            <span className="fd-avg-count">{reviews.length} reviews</span>
          </div>

          <form className="fd-review-form" onSubmit={submitReview}>
            <h3>Leave a review</h3>
            <div className="fd-form-row">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="fd-rating-pick">
                <span>Rating:</span>
                <Stars value={form.rating} size={20} onSelect={(n) => setForm({ ...form, rating: n })} />
              </div>
            </div>
            <textarea
              placeholder="Share your experience with this dish…"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
            <button type="submit">Submit feedback</button>
          </form>
        </div>

        <div className="fd-review-list">
          {reviews.length === 0 ? (
            <p className="fd-empty">No reviews yet — be the first to share your experience!</p>
          ) : (
            reviews.map((r, i) => (
              <div className="fd-review" key={i}>
                <div className="fd-review-head">
                  <div className="fd-avatar">{(r.name || '?').charAt(0).toUpperCase()}</div>
                  <div>
                    <b>{r.name}</b>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <span className="fd-review-date">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Similar food */}
      {similar.length > 0 && (
        <div className="fd-section">
          <h2>You might also like</h2>
          <div className="fd-similar-grid">
            {similar.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                desc={item.description}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodDetails
