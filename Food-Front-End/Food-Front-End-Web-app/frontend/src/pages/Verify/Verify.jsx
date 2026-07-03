import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { orderApi } from '../../api'
import './Verify.css'

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await orderApi.verify(success, orderId);
      navigate(response.success ? "/myorders" : "/")
    } catch {
      navigate("/")
    }
  }

  useEffect(() => {
    verifyPayment();
  }, [])

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
