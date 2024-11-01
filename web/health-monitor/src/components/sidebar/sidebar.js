import React from 'react';
import './sidebar.css';
import {FaHouseChimney, FaCalendarDay, FaGear} from 'react-icons/fa6';
import logo from '../../assets/Frame.png'

function Sidebar () {
    return (
        <div className='sidebar'>
            <div className='logo'>
                <img className='imgLogo' src={logo} alt='imagem logo' />
            </div>
            <div className='divIcons'>
                <div className='icon'><FaHouseChimney style={{color: '#707070'}} /></div>
                <div className='icon'><FaCalendarDay style={{color: '#707070'}} /></div>
                <div className='icon'><FaGear style={{color: '#707070'}} /></div>
            </div>
        </div>
    );
}

export default Sidebar;