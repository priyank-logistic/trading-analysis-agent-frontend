"use client";

import { useState, useEffect } from "react";
import {
  getAnalysesFromStorage,
  deleteAnalysisFromStorage,
  clearAllAnalyses,
} from "@/lib/utils";

export default function SavedAnalyses({ onLoadAnalysis }) {
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    const analyses = getAnalysesFromStorage();
    setSavedAnalyses(analyses);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this analysis?")) {
      deleteAnalysisFromStorage(id);
      loadAnalyses();
      if (expandedId === id) {
        setExpandedId(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all saved analyses?")) {
      clearAllAnalyses();
      loadAnalyses();
      setExpandedId(null);
    }
  };

  const handleLoad = (analysis) => {
    if (onLoadAnalysis) {
      onLoadAnalysis(analysis);
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timestamp;
    }
  };

  if (savedAnalyses.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "#1a1f2e",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px",
        border: "1px solid #334155",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "1.5em",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>💾</span>
          Saved Analyses ({savedAnalyses.length})
        </h2>
        {savedAnalyses.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9em",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#ef4444";
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "15px",
        }}
      >
        {savedAnalyses.map((analysis) => (
          <div
            key={analysis.id}
            style={{
              background: "#2a2f3e",
              border: "1px solid #374151",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
          >
            <div
              style={{
                padding: "15px",
                borderBottom: expandedId === analysis.id ? "1px solid #475569" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: "1.1em",
                      fontWeight: 600,
                      marginBottom: "5px",
                    }}
                  >
                    {analysis.coin || "N/A"}
                  </div>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                    }}
                  >
                    {formatDate(analysis.timestamp)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(analysis.id, e)}
                  style={{
                    padding: "4px 8px",
                    background: "transparent",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8em",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#ef4444";
                  }}
                >
                  Delete
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    background: "#1e293b",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75em",
                    color: "#9ca3af",
                  }}
                >
                  {analysis.marketType === "indian" ? "🇮🇳 Indian" : "₿ Crypto"}
                </span>
                <span
                  style={{
                    background: "#1e293b",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75em",
                    color: "#9ca3af",
                  }}
                >
                  HTF: {analysis.higherTimeframe?.toUpperCase() || "N/A"}
                </span>
                <span
                  style={{
                    background: "#1e293b",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75em",
                    color: "#9ca3af",
                  }}
                >
                  LTF: {analysis.lowerTimeframe?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>

            {expandedId === analysis.id && (
              <div
                style={{
                  padding: "15px",
                  background: "#1e293b",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoad(analysis);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9em",
                      fontWeight: 500,
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#2563eb";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#3b82f6";
                    }}
                  >
                    Load Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

