import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Transactions from './Transactions';


const App = () => {
    const [userData, setUserData] = useState(null);
    const handleLogin = (data) => {
        setUserData(data);
    }

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route path="/transactions" element={<Transactions userData={userData} />} />
            </Routes>
        </Router>
    );
};

export default App;
