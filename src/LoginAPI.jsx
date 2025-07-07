import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

export default function LoginAPI() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const emailRef = useRef(null);
    const navigate = useNavigate();

    const { user, login, fetchUser } = useAuth();

    useEffect(() => {
        emailRef.current?.focus();
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const userRole = user.roleName;
            if (userRole === "Employee") {
                navigate("/Attendance");
            } else if (userRole === "Manager") {
                navigate("/Manager");
            } else if (userRole === "HR") {
                navigate("/MonthlyAttendanceReport");
            } else if(userRole === "Admin"){
                navigate("/AdminDashboard");
            }else {
                setMessage("Unknown role");
            }
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            setSuccess(result.success);
            setMessage(result.message);
        } catch (err) {
            setSuccess(false);
            setMessage(err.response?.data?.message || "Connection Issue: " + err.message);

        }
    };

    return (
        <div className={`flex flex-col items-center justify-center h-[90vh] ${success ? "bg-green-100" : "bg-gray-100"}`}>
            <form onSubmit={handleLogin} className={`bg-white p-8 rounded w-80 ${success ? "shadow-[0_0_30px_0_rgba(34,197,94,0.7)]" : "shadow-[0_0_30px_0_rgba(239,68,68,0.7)]"}`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <input
                    type="text"
                    ref={emailRef}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-4 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition duration-200"
                >
                    Login
                </button>

                {message && (
                    <p className={`mt-4 text-center text-sm ${success ? "text-green-600" : "text-red-500"}`}>{message}</p>
                )}
            </form>
        </div>
    );
}
