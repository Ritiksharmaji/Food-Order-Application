import React, { useState } from 'react'
import { toast } from 'react-toastify'
import './Contact.css'

const info = [
  { icon: '📍', title: 'Visit us', lines: ['123 Flavour Street', 'Foodie Town, 400001'] },
  { icon: '📞', title: 'Call us', lines: ['+91 98765 43210', 'Mon–Sun, 9am–11pm'] },
  { icon: '✉️', title: 'Email us', lines: ['support@tomato.com', 'orders@tomato.com'] },
  { icon: '⏰', title: 'Hours', lines: ['Mon–Fri: 9am – 11pm', 'Sat–Sun: 10am – 12am'] },
]

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, email and message')
      return
    }
    toast.success("Thanks for reaching out! We'll get back to you soon.")
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact">
      <div className="contact-head">
        <span className="contact-tag">Get in touch</span>
        <h1>We&apos;d love to hear from you</h1>
        <p>Questions, feedback or just craving a chat about food? Drop us a message.</p>
      </div>

      <div className="contact-info-grid">
        {info.map((c) => (
          <div className="contact-info-card" key={c.title}>
            <div className="contact-info-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            {c.lines.map((l) => <p key={l}>{l}</p>)}
          </div>
        ))}
      </div>

      <div className="contact-body">
        <form className="contact-form" onSubmit={submit}>
          <h2>Send us a message</h2>
          <div className="contact-row">
            <input type="text" placeholder="Your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="email" placeholder="Your email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <input type="text" placeholder="Subject" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea placeholder="Your message" value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit">Send message</button>
        </form>

        <div className="contact-map">
          <div className="contact-map-inner">
            <span>🗺️</span>
            <p>123 Flavour Street, Foodie Town</p>
            <small>Open in Maps</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
