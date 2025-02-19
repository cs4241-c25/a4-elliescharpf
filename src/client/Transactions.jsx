import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

// Transaction component
const Transaction = ({ amount, category, date, onEdit, onDelete }) => (
    <tr>
        <td>{amount}</td>
        <td>{category}</td>
        <td>{formatDate(date)}</td>
        <td>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
        </td>
    </tr>
);

const Transactions = ({ userData, username }) => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        if (!username) return;
        fetch('/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        })
            .then(response => response.json())
            .then(json => setTransactions(json))
            .catch(error => console.error('Error fetching transactions:', error));
    }, [username]);

    const addTransaction = () => {
        if (!amount || !date) return;
        fetch('/add', {
            method: 'POST',
            body: JSON.stringify({ amount, category, date, username }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(json => {
                setTransactions(json);
                resetForm();
            })
            .catch(error => console.error('Error adding transaction:', error));
    };

    const editTransaction = (index) => {
        const transaction = transactions[index];
        setAmount(transaction.amount);
        setCategory(transaction.category);
        setDate(transaction.date);
        setEditingIndex(index);
    };

    const updateTransaction = () => {
        if (!amount || !date || editingIndex === null) return;
        const transactionToUpdate = transactions[editingIndex];
        fetch('/update', {
            method: 'POST',
            body: JSON.stringify({ id: transactionToUpdate._id, amount, category, date, username }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(json => {
                setTransactions(json);
                resetForm();
            })
            .catch(error => console.error('Error updating transaction:', error));
    };

    const deleteTransaction = (index) => {
        const transaction = transactions[index];
        fetch('/delete', {
            method: 'POST',
            body: JSON.stringify({ id: transaction._id, username }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(json => setTransactions(json))
            .catch(error => console.error('Error deleting transaction:', error));
    };

    const resetForm = () => {
        setAmount('');
        setDate('');
        setEditingIndex(null);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="transactions-page">
            <h2>Transaction Tracker</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                editingIndex !== null ? updateTransaction() : addTransaction();
            }}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button type="submit">{editingIndex !== null ? 'Update Transaction' : 'Add Transaction'}</button>
                <button type="button" onClick={handleLogout}>Logout</button>
            </form>
            <table>
                <thead>
                <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((t, i) => (
                    <Transaction
                        key={i}
                        amount={t.amount}
                        category={t.category}
                        date={t.date}
                        onEdit={() => editTransaction(i)}
                        onDelete={() => deleteTransaction(i)}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Month is 0-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export default Transactions;
