import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";

interface PendingRequest {
  _id: string;
  sender: {
    name: string;
    role: string;
    location?: string;
    email: string;
  };
}

interface Suggestion {
  _id: string;
  name: string;
  email?: string; // 🔥 make optional (safety)
  role: string;
}

export default function Connections() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { showToast } = useApp();

  const token = localStorage.getItem("token");

  // ================= FETCH PENDING REQUESTS =================
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/pending-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  // ================= FETCH SUGGESTIONS =================
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/users/suggestions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Suggestions:", res.data); // 🔥 DEBUG

      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSuggestions();
  }, []);

  // ================= ACCEPT / REJECT =================
  const handleStatus = async (
    email: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      if (!email) return;

      if (status === "accepted") {
        await axios.post(
          `http://localhost:8000/accept-request/${email}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      showToast(`Request ${status}`, "success");

      setRequests((prev) =>
        prev.filter((r) => r.sender.email !== email)
      );
    } catch (err) {
      showToast("Failed to update", "error");
    }
  };

  // ================= SEND CONNECTION =================
  const handleConnect = async (email?: string) => {
    console.log("Clicked email:", email); // 🔥 DEBUG

    if (!email) {
      showToast("User email not found", "error");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/send-request/${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Request Sent", "success");

      setSuggestions((prev) =>
        prev.filter((p) => p.email !== email)
      );
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.detail || "Failed to send request",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">
            group
          </span>
          <h1 className="text-2xl font-bold text-on-surface">
            Network Connections
          </h1>
        </div>

        {/* ================= PENDING REQUESTS ================= */}
        <section className="bg-white rounded-2xl border overflow-hidden shadow-sm mb-10">
          <div className="p-4 border-b bg-surface-container-low">
            <h2 className="font-bold text-primary">
              Pending Requests ({requests.length})
            </h2>
          </div>

          <div className="divide-y">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                    {req.sender.name[0]}
                  </div>

                  <div>
                    <h3 className="font-bold">{req.sender.name}</h3>
                    <p className="text-xs text-gray-500">
                      {req.sender.role}{" "}
                      {req.sender.location && `• ${req.sender.location}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatus(req.sender.email, "accepted")
                    }
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(req.sender.email, "rejected")
                    }
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No pending requests
              </div>
            )}
          </div>
        </section>

        {/* ================= SUGGESTIONS ================= */}
        <div>
          <h2 className="text-lg font-bold mb-4">
            People you may know
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {suggestions.map((person) => (
              <div
                key={person._id}
                className="min-w-[180px] bg-white border rounded-2xl p-4 flex flex-col items-center shadow-sm"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary mb-2">
                  {person.name[0]?.toUpperCase()}
                </div>

                <h3 className="font-bold text-sm text-center">
                  {person.name}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  {person.role}
                </p>

                <button
                  onClick={() => handleConnect(person.email)}
                  className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>

          {suggestions.length === 0 && (
            <p className="text-gray-400 text-sm">
              No suggestions available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}