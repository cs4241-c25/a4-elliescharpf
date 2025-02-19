import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css"

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Login</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
