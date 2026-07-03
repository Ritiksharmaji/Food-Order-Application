import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '../../api'
import './Profile.css'
import { StoreContext } from '../../Context/StoreContext'

const Profile = () => {
  const { token, user, currency, setToken, saveUser, cartItems } = useContext(StoreContext)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res = await orderApi.userOrders()
        setOrders(res.data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    saveUser(null)
    navigate('/')
  }

  const totalSpent = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const cartCount = Object.values(cartItems || {}).reduce((s, n) => s + (n > 0 ? n : 0), 0)

  if (!token) {
    return (
      <div className="profile-guest">
        <div className="profile-guest-icon">👤</div>
        <h2>You&apos;re not signed in</h2>
        <p>Sign in from the top-right to view your profile, track orders and more.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }

  const name = user?.name || 'Food Lover'
  const email = user?.email || ''

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>
        <div className="profile-id">
          <h1>{name}</h1>
          {email && <p>{email}</p>}
          <span className="profile-badge">🍅 Tomato Member</span>
        </div>
        <button className="profile-logout" onClick={logout}>Logout</button>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-num">{orders.length}</span>
          <span className="profile-stat-label">Orders placed</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-num">{currency}{totalSpent}</span>
          <span className="profile-stat-label">Total spent</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-num">{cartCount}</span>
          <span className="profile-stat-label">Items in cart</span>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-recent">
          <div className="profile-section-head">
            <h2>Recent orders</h2>
            <span onClick={() => navigate('/myorders')}>View all →</span>
          </div>

          {loading ? (
            <p className="profile-muted">Loading your orders…</p>
          ) : orders.length === 0 ? (
            <div className="profile-empty">
              <p>No orders yet.</p>
              <button onClick={() => navigate('/menu')}>Browse the menu</button>
            </div>
          ) : (
            <div className="profile-order-list">
              {orders.slice(0, 4).map((o, i) => (
                <div className="profile-order" key={i}>
                  <div className="profile-order-icon">🧾</div>
                  <div className="profile-order-info">
                    <p className="profile-order-items">
                      {o.items.map((it) => `${it.name} x ${it.quantity}`).join(', ')}
                    </p>
                    <span className="profile-order-status"><b>&#x25cf;</b> {o.status}</span>
                  </div>
                  <div className="profile-order-amount">{currency}{o.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-actions">
          <h2>Quick actions</h2>
          <button onClick={() => navigate('/myorders')}>📦 My Orders</button>
          <button onClick={() => navigate('/menu')}>🍽️ Explore Menu</button>
          <button onClick={() => navigate('/cart')}>🛒 View Cart</button>
          <button onClick={() => navigate('/contact')}>💬 Contact Support</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
