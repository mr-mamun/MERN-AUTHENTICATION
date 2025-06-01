import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

    const navigate = useNavigate()

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='container'>
            <div className="container">
                <img onClick={() => navigate('/')} src={assets.logo} alt="" className='' />
            </div>

            <div className="mt-5 d-inline-block">

                <div className="border p-3 bg-light mt-4" style={{ height: 'auto' }}>
                    <h2>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                    <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
                    <form onSubmit={onSubmit}>
                        {state === 'Sign Up' && (
                            <div className='container'>
                                <img src={assets.person_icon} alt="" />
                                <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Full Name' required />
                            </div>
                        )}

                        <div className='container'>
                            <img src={assets.mail_icon} alt="" />
                            <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='sample@mail.com' required />
                        </div>
                        <div className='container'>
                            <img src={assets.lock_icon} alt="" />
                            <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='password' required />
                        </div><br />


                        <p onClick={() => navigate('/reset-password')} className='link-primary link-opacity-75-hover'>Forgot password?</p><br />

                        <button className='btn bg-primary text-white'>{state}</button>

                    </form>

                    {state === 'Sign Up' ? (
                        <p>Already have an account?{' '}
                            <span onClick={() => setState('Login')} className='btn btn-link'>Login here</span>
                        </p>
                    ) : (
                        <p>Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='btn btn-link'>Sign Up</span>
                        </p>
                    )}

                </div>
            </div>



        </div>
    )
}



export default Login
