// src/pages/Roast.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const loadingMessages = [
  "Tuning the roast… hope your ego survives.",
  "Spotify is judging your taste. Hard.",
  "Analyzing your questionable playlist choices…",
  "Cooking roast… this might get spicy.",
  "Uncovering your musical sins…",
  "Detecting emotional damage in progress…",
  "Roast loading… unlike your taste, this won’t disappoint.",
  "Your playlist is crying for help…",
  "Finding the worst parts of your music history…",
  "Digging through your guilty pleasures…"
];

const Roast = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [roast, setRoast] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const getUserIdFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("userId");
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const getSpotifySummary = async () => {
      setLoading(true);
      setError("");
      const userId = getUserIdFromUrl();

      if (!userId) {
        setError("Missing userId in URL. Did the OAuth redirect include ?userId=... ?");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/spotify/user-data", {
          params: { userId }
        });
        const responseSummary = res.data && res.data.summary ? res.data.summary : null;
        setSummary(responseSummary);
      } catch (err) {
        console.error("Failed to fetch spotify data:", err);
        const msg = err.response?.data?.details || err.response?.data?.error || err.message;
        setError(`Failed to fetch Spotify data: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    getSpotifySummary();
  }, []);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const generateRoast = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setRoast("");
    setError("");
    setIsGenerating(true);

    if (!summary) {
      setError("No summary available to generate a roast");
      setIsGenerating(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/roast/generate", {
        summary,
        tone: "brutal" // change tone here if desired ('playful','soft','brutal')
      });

      if (res.data && res.data.roast) {
        setRoast(res.data.roast);
      } else {
        const msg = res.data?.error || "No roast returned from server";
        setError(msg);
      }
    } catch (err) {
      console.error("Roast generation failed:", err);
      const msg = err.response?.data?.details || err.response?.data?.error || err.message;
      setError(`Roast generation failed: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 className="font-black text-4xl mb-5">Your roast</h1>

      {loading && <p>Loading Spotify data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
        
          <div className="mb-5">
            <strong>Top Artists:</strong>{" "}
            {summary?.topArtists?.length ? summary.topArtists.join(", ") : "No artists found"}
          </div>

          {/* <div className="mb-5">
            <strong>Top Tracks:</strong>
            <ul className="list-disc ml-6 mt-1">
                {summary?.topTracks?.length ? (
                summary.topTracks.map((track, index) => (
                    <li key={index}>
                    {track.name} — {track.artist}
                    </li>
                ))
                ) : (
                <li>No tracks found</li>
                )}
            </ul>
          </div> */}

          <button
            onClick={generateRoast}
            disabled={isGenerating}
            className={`bg-green-700 hover:bg-green-900 p-3 rounded-lg ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isGenerating ? "Roasting…" : "Get your Roast"}
          </button>

          {isGenerating && (
            <div style={{ marginTop: 16, color: "#FFD54F", fontStyle: "italic" }}>
              {loadingMessages[loadingIndex]}
            </div>
          )}

          {!isGenerating && roast && (
            <div style={{ marginTop: 20 }}>
              <h2 className="text-xl mb-2">Roast result</h2>
              <div style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap" }}>
                {roast}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Roast;
