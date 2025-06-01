import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'

const Header = () => {

const navigate = useNavigate()
const {userData} = useContext(AppContent)

    return (
        <div>
            <div className="container">
                <img
                    src={assets.header_img}
                    className="img-fluid d-block mx-auto"
                    alt="Centered Image"
                    style={{ width: '100px', height: 'auto' }}
                />
                <p className='text-center fs-1'>Hey {userData ? userData.name : 'Developer'} ! <img src={assets.hand_wave} alt="" /></p>
                <p className="text-center fs-6">Welcome to our App</p>
                <button onClick={()=>navigate('/login')} className='btn btn-primary d-block mx-auto fs-6'>Get Started</button>
            </div>
        </div>
    )
}

export default Header
