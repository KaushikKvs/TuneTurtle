import React, { useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("fan");
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword || (loginMode === "artist" && (!artistName || !genre))) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const role = loginMode === "artist" ? "ARTIST" : "USER";
      const result = await register(email, password, role, artistName, genre, bio);
      if (result.success) {
        toast.success(result.message);
        onSwitchToLogin();
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center mb-6">
              <img src={assets.logo} alt="logo" className="w-16 h-16" />
              <h1 className="ml-3 text-3xl font-bold text-white">TuneTurtle</h1>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Join TuneTurtle
          </h2>
          <p className="text-gray-300">
            Create your account to start listening
          </p>
        </div>
        {/* Register Form */}
        <div className="bg-gray-900/80 backdrop-blue-lg rounded-2xl p-8 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            {/* Toggle Fan/Artist */}
            <div className="flex gap-2 mb-4">
              {["fan", "artist"].map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setLoginMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${loginMode === m ? "bg-green-900 border-green-500 text-green-300" : "bg-transparent border-gray-700 text-gray-400"}`}
                >
                  {m === "fan" ? "Fan / Listener" : "Artist"}
                </button>
              ))}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email Address
              </label>
              <input
                type="text"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Artist Fields */}
            {loginMode === "artist" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Artist Name</label>
                  <input type="text" required className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Your Stage Name" value={artistName} onChange={e => setArtistName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Primary Genre</label>
                  <input type="text" required className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="e.g. Synthwave" value={genre} onChange={e => setGenre(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Artist Bio</label>
                  <textarea className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Tell us about your sound..." rows="3" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                required
                className="block w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?
              <button
                onClick={onSwitchToLogin}
                className="text-green-400 hover:text-green-300 font-medium transition-colors cursor-pointer"
              >
                Sign In here
              </button>
            </p>
          </div>
          {/* Tems and conditions */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
