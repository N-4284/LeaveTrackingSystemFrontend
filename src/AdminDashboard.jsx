import React, { useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleName, setRoleName] = useState("Employee");
    const [managerID, setManagerID] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post("http://localhost:5000/users", {
                name,
                email,
                password,
                roleName,
                managerID: managerID || null,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(response.data.message);
            setName("");
            setEmail("");
            setPassword("");
            setRoleName("Employee");
            setManagerID("");
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.error || "Failed to create user.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />

                <select
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                </select>

                <input
                    type="number"
                    placeholder="Manager ID (optional)"
                    value={managerID}
                    onChange={(e) => setManagerID(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Create User
                </button>
            </form>

            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
