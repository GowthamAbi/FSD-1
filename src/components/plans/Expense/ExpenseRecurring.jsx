import React, { useState } from 'react';

const RecurringExpenseForm = ({ onAddExpense }) => {
    const [expenseName, setExpenseName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [nextDue, setNextDue] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!expenseName.trim()) {
            setError('Expense name is required.');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Amount must be a positive number.');
            return;
        }
        if (!category || category === 'Select') {
            setError('Please select a valid category.');
            return;
        }
        if (!nextDue) {
            setError('Next due date is required.');
            return;
        }

        setError(''); // Clear errors if any

        const newExpense = {
            expenseName,
            amount: parseFloat(amount),
            category,
            nextDue: new Date(nextDue).toISOString(), // Ensure correct date format
        };

        try {
            const response = await fetch('http://localhost:5000/api/recurring-expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
            });

            if (!response.ok) {
                throw new Error('Failed to add expense. Try again later.');
            }

            const data = await response.json();
            onAddExpense(data); // Update parent component
            setExpenseName('');
            setAmount('');
            setCategory('');
            setNextDue('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md bg-white">
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-3">
                <label className="block text-gray-700">Expense Name:</label>
                <input
                    type="text"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                />
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="Select">Select</option>
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Next Due Date:</label>
                <input
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                Add Expense
            </button>
        </form>
    );
};

export default RecurringExpenseForm;
