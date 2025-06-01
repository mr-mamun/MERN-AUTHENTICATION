import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)

    const sendVerificationOtp = async ()=>{
        try {
            axios.defaults.withCredentials = true;

            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if(data.success){
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async ()=>{
        try {

            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className="container">
                <img src={assets.logo} alt='' className='float-start' />

                {userData ?

                    <div className='float-end'>
                        <ul class="nav nav-pills">

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle fs-1" data-bs-toggle="dropdown" href="#">
                                    {userData.name[0].toUpperCase()}
                                </a>
                                <ul class="dropdown-menu">

                                    {!userData.isAccountVerified &&
                                        <li onClick={sendVerificationOtp}><a class="dropdown-item" href="#">Verify Email</a></li>
                                    }

                                    <li onClick={logout}><a class="dropdown-item" href="#">Logout</a></li>
                                </ul>
                            </li>

                        </ul>
                    </div>

                    : <button onClick={() => navigate('/login')} className='float-end'>Login <img src={assets.arrow_icon} alt="" /></button>
                }


            </div>
        </div>
    )
}

export default Navbar
