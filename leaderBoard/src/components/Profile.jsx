import { useState } from "react";
import axios from "axios";
import {
  LuUser,
  LuPlus,
  LuCheckCheck,
  LuCircleAlert,
} from "react-icons/lu";

export default function Profile() {
  const [userName, setUserName] = useState("");
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("https://leaderboard-q3iw.onrender.com/profile/user", {
        UserName: userName,
        points: Number(points),
      });
      setResult({ success: true, message: "User added!", user: res.data });
      setUserName("");
      setPoints(0);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "Failed to add user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl mb-4 shadow-lg transform hover:scale-105 transition-all duration-300">
            <LuUser className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Create User Profile
          </h1>
          <p className="text-gray-600 text-sm">
            Add a new user to the system with initial points
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:shadow-3xl transition-all duration-500">
          <div className="space-y-6">
            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <LuUser className="w-4 h-4 text-purple-500" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border-2 text-black border-gray-200 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-purple-300"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                  required
                />
                <LuUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding User...
                </>
              ) : (
                <>
                  <LuPlus className="w-5 h-5" />
                  Add New User
                </>
              )}
            </button>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 ${
                result.success
                  ? "bg-green-50 border-2 border-green-200 text-green-800"
                  : "bg-red-50 border-2 border-red-200 text-red-800"
              }`}
            >
              {result.success ? (
                <LuCheckCheck className="w-5 h-5 text-green-600" />
              ) : (
                <LuCircleAlert className="w-5 h-5 text-red-600" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">{result.message}</p>
                {result.success && result.user && (
                  <p className="text-xs mt-1 opacity-75">
                    User ID: {result.user.id}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
