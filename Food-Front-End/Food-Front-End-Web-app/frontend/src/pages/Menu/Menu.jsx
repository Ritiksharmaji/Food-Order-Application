import React, { useContext, useMemo, useState } from 'react'
import './Menu.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Menu = () => {
  const { food_list, menu_list } = useContext(StoreContext)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return food_list.filter((f) => {
      const matchCat = category === 'All' || f.category === category
      const matchQ =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [food_list, category, query])

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1>Our Menu</h1>
        <p>Explore {food_list.length}+ dishes across every craving imaginable.</p>
        <div className="menu-search">
          <input
            type="text"
            placeholder="Search for dishes, e.g. salad, pasta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <span className="menu-search-clear" onClick={() => setQuery('')}>✕</span>}
        </div>
      </div>

      <div className="menu-chips">
        <button className={category === 'All' ? 'on' : ''} onClick={() => setCategory('All')}>All</button>
        {menu_list.map((m) => (
          <button
            key={m.menu_name}
            className={category === m.menu_name ? 'on' : ''}
            onClick={() => setCategory((c) => (c === m.menu_name ? 'All' : m.menu_name))}
          >
            {m.menu_name}
          </button>
        ))}
      </div>

      <p className="menu-count">{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} found</p>

      {filtered.length === 0 ? (
        <div className="menu-empty">
          <span>🍽️</span>
          <p>No dishes match your search.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map((item) => (
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
      )}
    </div>
  )
}

export default Menu
