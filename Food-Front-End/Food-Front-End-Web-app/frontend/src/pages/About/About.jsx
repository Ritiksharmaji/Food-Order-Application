import React from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'
import { assets } from '../../assets/assets'

const stats = [
  { num: '50K+', label: 'Happy customers' },
  { num: '200+', label: 'Dishes on menu' },
  { num: '15', label: 'Cities served' },
  { num: '4.8★', label: 'Average rating' },
]

const values = [
  { icon: '🌿', title: 'Fresh Ingredients', text: 'We source produce daily from trusted local farms for peak freshness.' },
  { icon: '⚡', title: 'Lightning Delivery', text: 'Hot, fresh food at your door in 30 minutes — every single time.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', text: 'Our dishes are crafted by experienced chefs who love what they do.' },
  { icon: '💛', title: 'Made with Love', text: 'Every meal is prepared with care, because you deserve the best.' },
]

const About = () => {
  const navigate = useNavigate()
  return (
    <div className="about">
      <div className="about-hero">
        <div className="about-hero-text">
          <span className="about-tag">About Tomato</span>
          <h1>Delicious food, delivered with <span>love</span>.</h1>
          <p>
            Tomato started with a simple idea — great food should be easy to get and always
            feel special. Today we connect thousands of hungry people with their favourite
            dishes from the best kitchens in town, all in a few taps.
          </p>
          <button onClick={() => navigate('/menu')}>Explore our menu</button>
        </div>
        <div className="about-hero-img">
          <img src={assets.header_img} alt="Delicious food" />
        </div>
      </div>

      <div className="about-stats">
        {stats.map((s) => (
          <div className="about-stat" key={s.label}>
            <span className="about-stat-num">{s.num}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="about-story">
        <h2>Our Story</h2>
        <p>
          What began as a small neighbourhood kitchen has grown into a food-delivery platform
          loved across the country. We believe in honest ingredients, fair prices, and putting
          a smile on your face with every order. From comforting classics to bold new flavours,
          our menu is a celebration of everything we love about food.
        </p>
      </div>

      <div className="about-values">
        <h2>Why choose us</h2>
        <div className="about-values-grid">
          {values.map((v) => (
            <div className="about-value" key={v.title}>
              <div className="about-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-cta">
        <h2>Hungry yet?</h2>
        <p>Discover hundreds of dishes waiting to be devoured.</p>
        <button onClick={() => navigate('/menu')}>Order now</button>
      </div>
    </div>
  )
}

export default About
