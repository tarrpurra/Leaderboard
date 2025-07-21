import { useEffect, useState } from "react";
import axios from "axios";
import { LuUser, LuGift, LuClock } from "react-icons/lu";

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://leaderboard-q3iw.onrender.com/history/claim-history") //Fetching the Api to add the history log
      .then((res) => {
        console.log(res)
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log(error)
        setError("Failed to fetch history logs");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-xl p-6 border border-gray-100 mt-24">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700 flex items-center justify-center gap-2">
          <LuGift className="w-7 h-7 text-pink-500" />
          Claim History
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No history logs found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log._id} className="py-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <LuUser className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-lg">
                    {log.name}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <LuGift className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700">
                      +{log.points} pts
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <LuClock className="w-4 h-4" />
                    {new Date(log.date).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
