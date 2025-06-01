import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContent)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [isEmailSent, setisEmailSent] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSubmited, setisOtpSubmited] = useState('')

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setisOtpSubmited(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      
const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
data.success ? toast.success(data.message) : toast.error(data.message)
data.success && navigate('/login')

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='container'>
      <div className="container">
        <img onClick={() => navigate('/')} src={assets.logo} alt="" className='' />
      </div>

      {/* enter email id */}

      {!isEmailSent &&

        <form onSubmit={onSubmitEmail} className='container pt-3 m-2'>
          <h1>Reset Password</h1>
          <p>Enter your register email address</p>
          <div className='mt-2'>
            <img src={assets.mail_icon} alt="" className='' />{'  '}
            <input type="email" placeholder='example@mail.com' className=''
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <button className='btn bg-primary mt-2'>Submit</button>

        </form>

      }


      {/* OTP input form  */}

      {!isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitOTP} className='container pt-3 m-2'>
          <h1>Reset Password OTP</h1>
          <p>Enter the 6 digit code sent to your email id.</p>

          <div className='' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength={1} key={index} required className=''
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className='btn bg-primary'>Submit</button>

        </form>

      }

      {/* Enter new password */}

      {isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className='container pt-3 m-2'>
          <h1>New Password</h1>
          <p>Enter the new password below</p>
          <div className='mt-2'>
            <img src={assets.lock_icon} alt="" className='' />{'  '}
            <input type="password" placeholder='password' className=''
              value={newPassword} onChange={e => setnewPassword(e.target.value)} required
            />
          </div>

          <button className='btn bg-primary mt-2'>Submit</button>

        </form>

      }

    </div>
  )
}

export default ResetPassword
