import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Input from "../InputField";
import Button from "../Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/products");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur shadow-xl p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-5">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="
              w-full mt-2
              bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400
              py-2.5 text-sm font-medium
              transition-all duration-200
            "
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
