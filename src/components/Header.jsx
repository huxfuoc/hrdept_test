import React from 'react';
import '../css/Header.scss';
import { BellIcon } from '@radix-ui/react-icons';
import UserAvatar from '../assets/user-image.png';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h1>HR Dept Company</h1>
            </div>
            <div className="header-right">
                <div className="notification">
                    <BellIcon />
                    <span className="notification-count">1</span>
                </div>
                <div className="user-info">
                    <span className="user-name">Tony Stark</span>
                    <span className="user-role">CEO Stark Industry</span>
                </div>
                <img src={UserAvatar} alt="User Avatar" className="user-avatar" />
            </div>
        </header>
    );
};

export default Header;
