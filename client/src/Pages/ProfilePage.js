import React from 'react'
import Profile from '../Components/Profile/Profile'
import Navbar from '../Components/Navbar/Navbar'
import HelpPopup from '../Components/Help/HelpPopup'
const ProfilePage = () => {
  return (
    <div className='overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-black'>
      <Navbar/>
      <Profile/>
      <HelpPopup/>
    </div>
  )
}

export default ProfilePage
