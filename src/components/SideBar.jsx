import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/SideBar.scss';
import Logo from '../assets/logo.png';
import { HamburgerMenuIcon, MagnifyingGlassIcon, PieChartIcon, PersonIcon, ImageIcon, CalendarIcon, EnvelopeClosedIcon, GearIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-icon">
                <img src={Logo} alt="logo" className="sidebar-logo" />
                <HamburgerMenuIcon />
            </div>
            <ul className="sidebar-menu">
                <li className="no-hover">
                    <MagnifyingGlassIcon color='black' style={{ marginLeft: '7px' }} />
                    <input type="text" placeholder="Search" className="sidebar-input" />
                </li>
                <li>
                    <NavLink to="/user" className="sidebar-link" activeClassName="active">
                        <PersonIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Users</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/messages" className="sidebar-link" activeClassName="active">
                        <ChatBubbleIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Messages</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/analytics" className="sidebar-link" activeClassName="active">
                        <PieChartIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Analytics</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/emails" className="sidebar-link" activeClassName="active">
                        <EnvelopeClosedIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Email</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/images" className="sidebar-link" activeClassName="active">
                        <ImageIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Images</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/calendar" className="sidebar-link" activeClassName="active">
                        <CalendarIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Calendar</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/settings" className="sidebar-link" activeClassName="active">
                        <GearIcon color='black' style={{ marginLeft: '7px' }} />
                        <span>Settings</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
