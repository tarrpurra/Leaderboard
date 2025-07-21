import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LuCrown,
  LuMedal,
  LuAward,
  LuStar,
  LuTrophy,
  LuUsers,
  LuTarget,
  LuTrendingUp,
  LuGift,
  LuCheckCheck,
  LuCircleAlert,
} from "react-icons/lu";

export default function MainPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimResult, setClaimResult] = useState({}); // Store per-user claim result
  const [claimLoading, setClaimLoading] = useState({}); // Store per-user loading
  const [moveMap, setMoveMap] = useState({});
  const prevLeaderboard = useRef([]);

  useEffect(() => {
    axios
      .get("https://leaderboard-q3iw.onrender.com/leaderboard")
      .then((res) => {
        setLeaderboardData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch leaderboard");
        setLoading(false);
      });
  }, []);

  // Detect movement after leaderboard updates
  useEffect(() => {
    if (prevLeaderboard.current.length && leaderboardData.length) {
      const prevRanks = {};
      prevLeaderboard.current.forEach((user, idx) => {
        prevRanks[user.UserId || user._id] = idx;
      });
      const newMoveMap = {};
      leaderboardData.forEach((user, idx) => {
        const id = user.UserId || user._id;
        if (prevRanks[id] !== undefined) {
          if (prevRanks[id] > idx) newMoveMap[id] = "up";
          else if (prevRanks[id] < idx) newMoveMap[id] = "down";
          else newMoveMap[id] = "none";
        } else {
          newMoveMap[id] = "none";
        }
      });
      setMoveMap(newMoveMap);
      // Remove animation after 1s
      const timeout = setTimeout(() => setMoveMap({}), 1000);
      return () => clearTimeout(timeout);
    }
    prevLeaderboard.current = leaderboardData;
  }, [leaderboardData]);

  const handleClaim = async (userId) => {
    if (!userId) return;
    setClaimLoading((prev) => ({ ...prev, [userId]: true }));
    setClaimResult((prev) => ({ ...prev, [userId]: null }));
    try {
      // Call the add points API
      const res = await axios.post(
        `http://localhost:5000/leaderboard/claim/${userId}`
      );

      const updated = await axios.get("http://localhost:5000/leaderboard");
      setLeaderboardData(updated.data);
      setClaimResult((prev) => ({
        ...prev,
        [userId]: { points: res.data.added },
      }));
      setTimeout(() => {
        setClaimResult((prev) => ({ ...prev, [userId]: null }));
      }, 3000);
    } catch {
      setClaimResult((prev) => ({
        ...prev,
        [userId]: { error: "Failed to claim points." },
      }));
    } finally {
      setClaimLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <LuCrown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
      case 2:
        return <LuMedal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />;
      case 3:
        return <LuAward className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      default:
        return <LuStar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 shadow-yellow-100";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400 shadow-gray-100";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 shadow-amber-100";
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-300 shadow-blue-100";
    }
  };

  const getRankText = (rank) => {
    const baseClasses = "font-bold";
    switch (rank) {
      case 1:
        return `${baseClasses} text-yellow-600 text-lg sm:text-2xl`;
      case 2:
        return `${baseClasses} text-gray-600 text-lg sm:text-2xl`;
      case 3:
        return `${baseClasses} text-amber-600 text-lg sm:text-2xl`;
      default:
        return `${baseClasses} text-blue-600 text-base sm:text-xl`;
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "from-red-400 to-pink-500",
      "from-blue-400 to-purple-500",
      "from-green-400 to-blue-500",
      "from-purple-400 to-pink-500",
      "from-yellow-400 to-orange-500",
      "from-indigo-400 to-purple-500",
      "from-pink-400 to-red-500",
      "from-teal-400 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
        <div className=" bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-md sm:max-w-4xl mx-auto">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="text-center  mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            {/* Items skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-xl p-6 max-w-md sm:max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCircleAlert className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Oops!</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md sm:max-w-4xl mx-auto border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 mt-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LuTrophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Top performers this season
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Top 3 Podium - Mobile Optimized */}
        {leaderboardData.length >= 3 && (
          <div className="mb-6">
            <div className="flex justify-center items-end space-x-2 mb-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {leaderboardData[1]?.UserName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-t-lg px-3 py-4 min-h-[60px] flex flex-col justify-center">
                  <LuMedal className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-gray-600">2nd</div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {leaderboardData[0]?.UserName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="bg-yellow-200 rounded-t-lg px-3 py-6 min-h-[80px] flex flex-col justify-center">
                  <LuCrown className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-yellow-700">1st</div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {leaderboardData[2]?.UserName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="bg-amber-200 rounded-t-lg px-3 py-4 min-h-[60px] flex flex-col justify-center">
                  <LuAward className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-amber-700">3rd</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboardData.map((user, idx) => {
            const rank = idx + 1;
            const userId = user.UserId || user._id || idx;
            return (
              <div
                key={userId}
                className={`
                  ${getRankStyle(rank)}
                  rounded-xl p-3 shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98] transform
                  ${
                    moveMap[userId] === "up"
                      ? "animate-bounce bg-green-100"
                      : ""
                  }
                  ${
                    moveMap[userId] === "down" ? "animate-shake bg-red-100" : ""
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Rank & Icon */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getRankIcon(rank)}
                      <span className={getRankText(rank)}>#{rank}</span>
                    </div>
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(
                        idx
                      )} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <span className="text-white font-bold text-sm">
                        {user.UserName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Name */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                        {user.UserName}
                      </h3>
                      <p className="text-xs text-gray-500">Player</p>
                    </div>
                  </div>
                  {/* Points and Claim Button */}
                  <div className="flex flex-col items-end flex-shrink-0 ml-2 gap-1">
                    <div className="font-bold text-gray-800 text-lg sm:text-xl">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">pts</div>
                    <button
                      className="mt-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-1 rounded-lg font-bold shadow hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-1"
                      onClick={() => handleClaim(userId)}
                      disabled={claimLoading[userId]}
                    >
                      {claimLoading[userId] ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Claiming
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <LuGift className="w-3 h-3" />
                          Claim
                        </span>
                      )}
                    </button>
                    {/* Claim result notification */}
                    {claimResult[userId] && (
                      <div
                        className={`mt-1 rounded px-2 py-1 font-semibold text-center text-xs shadow ${
                          {
                            true: "bg-red-100 border border-red-200 text-red-700",
                            false:
                              "bg-green-100 border border-green-200 text-green-700",
                          }[!!claimResult[userId]?.error]
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {claimResult[userId]?.error ? (
                            <>
                              <LuCircleAlert className="w-4 h-4" />
                              {claimResult[userId].error}
                            </>
                          ) : (
                            <>
                              <LuCheckCheck className="w-4 h-4" />+
                              {claimResult[userId].points || 0} pts!
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Progress bar for top 5 */}
                {rank <= 5 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                          rank === 1
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                            : rank === 2
                            ? "bg-gradient-to-r from-gray-400 to-gray-600"
                            : rank === 3
                            ? "bg-gradient-to-r from-amber-400 to-amber-600"
                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                        style={{
                          width: `${Math.max(
                            20,
                            (user.points /
                              Math.max(
                                ...leaderboardData.map((u) => u.points)
                              )) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
              <LuUsers className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-blue-600 text-lg">
                {leaderboardData.length}
              </div>
              <div className="text-xs text-blue-500 font-medium">Players</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
              <LuTarget className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="font-bold text-green-600 text-lg">
                {leaderboardData.length > 0
                  ? Math.max(
                      ...leaderboardData.map((u) => u.points)
                    ).toLocaleString()
                  : 0}
              </div>
              <div className="text-xs text-green-500 font-medium">
                Top Score
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
              <LuTrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-purple-600 text-lg">
                {leaderboardData.length > 0
                  ? Math.round(
                      leaderboardData.reduce((sum, u) => sum + u.points, 0) /
                        leaderboardData.length
                    ).toLocaleString()
                  : 0}
              </div>
              <div className="text-xs text-purple-500 font-medium">Average</div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              Refresh Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
