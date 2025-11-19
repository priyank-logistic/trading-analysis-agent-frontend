"use client";

import { useState, useEffect, useRef } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
  TextField,
  ThemeProvider,
  createTheme,
  Autocomplete,
} from "@mui/material";
import SMCAnalysis from "@/components/SMCAnalysis";
import TradingSetups from "@/components/TradingSetups";
import PriceActionChart from "@/components/PriceActionChart";
import MarketAnalysis from "@/components/MarketAnalysis";
import PriceActionDetail from "@/components/PriceActionDetail";
import { parseAnalysis } from "@/lib/utils";
import dropdownData from "@/lib/dropdownData.json";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
    },
    background: {
      default: "#0a0e1a",
      paper: "#1a1f2e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#9ca3af",
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2f3e",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#374151",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#d1d5db",
          "&.Mui-focused": {
            color: "#3b82f6",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2f3e",
          color: "#fff",
          "& fieldset": {
            borderColor: "#374151",
          },
          "&:hover fieldset": {
            borderColor: "#3b82f6",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2f3e",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#374151",
          },
          "&.Mui-selected": {
            backgroundColor: "#3b82f6",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1f2e",
          color: "#9ca3af",
          fontWeight: 600,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#d1d5db",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#d1d5db",
            "&.Mui-focused": {
              color: "#3b82f6",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2f3e",
          color: "#fff",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#2a2f3e",
          padding: 0,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2a2f3e",
            color: "#fff",
            "& fieldset": {
              borderColor: "#374151",
            },
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#d1d5db",
            "&.Mui-focused": {
              color: "#3b82f6",
            },
          },
        },
        listbox: {
          backgroundColor: "#2a2f3e",
          color: "#fff",
          "& .MuiAutocomplete-option": {
            color: "#fff",
            "&:hover": {
              backgroundColor: "#374151",
            },
            "&[aria-selected='true']": {
              backgroundColor: "#3b82f6",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            },
          },
          "& .MuiAutocomplete-groupLabel": {
            backgroundColor: "#1a1f2e",
            color: "#9ca3af",
            fontWeight: 600,
          },
        },
        popper: {
          "& .MuiPaper-root": {
            backgroundColor: "#2a2f3e",
            color: "#fff",
          },
        },
      },
    },
  },
});

const LOADING_STEPS = [
  { icon: "📥", label: "Gathering Market Information", color: "#3b82f6" },
  { icon: "📊", label: "Organizing Data", color: "#8b5cf6" },
  { icon: "📤", label: "Preparing AI Analysis", color: "#10b981" },
  { icon: "🤖", label: "Analyzing Patterns", color: "#f59e0b" },
  { icon: "✨", label: "Finalizing Report", color: "#ef4444" },
];

function LoadingAnimation({ responseReady, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const stepIntervalRef = useRef(null);

  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);

    if (responseReady) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current);
            return 100;
          }
          return prev + 5;
        });
      }, 50);

      stepIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= LOADING_STEPS.length - 1) {
            clearInterval(stepIntervalRef.current);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 300);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    } else {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressIntervalRef.current);
            return 95;
          }
          return prev + 0.158;
        });
      }, 100);

      stepIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= LOADING_STEPS.length - 1) {
            clearInterval(stepIntervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 12000);
    }

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [responseReady, onComplete]);

  return (
    <div className="loading-animation">
      <div className="loading-header">
        <h3>Processing Your Request</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="loading-steps">
        {LOADING_STEPS.map((step, index) => (
          <div
            key={index}
            className={`loading-step ${
              index === currentStep
                ? "active"
                : index < currentStep
                ? "completed"
                : ""
            }`}
          >
            <div
              className="step-icon"
              style={{
                backgroundColor:
                  index <= currentStep
                    ? `${step.color}20`
                    : "rgba(255, 255, 255, 0.05)",
                borderColor:
                  index <= currentStep
                    ? step.color
                    : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "1.8em",
                  filter:
                    index <= currentStep
                      ? "drop-shadow(0 0 8px " + step.color + ")"
                      : "none",
                }}
              >
                {step.icon}
              </span>
              {index < currentStep && <div className="checkmark">✓</div>}
            </div>
            <div className="step-label">{step.label}</div>
            {index < LOADING_STEPS.length - 1 && (
              <div
                className={`step-connector ${
                  index < currentStep ? "completed" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [marketType, setMarketType] = useState("crypto");
  const [coin, setCoin] = useState("BTCUSDT");
  const [higherTimeframe, setHigherTimeframe] = useState("4h");
  const [lowerTimeframe, setLowerTimeframe] = useState("15m");
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("price");
  const [rawResponse, setRawResponse] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [marketAnalysisData, setMarketAnalysisData] = useState(null);
  const [technicalIndicators, setTechnicalIndicators] = useState(null);
  const [priceActionDetail, setPriceActionDetail] = useState(null);
  const [technicalIndicatorsAnalysis, setTechnicalIndicatorsAnalysis] =
    useState(null);
  const [coinTitle, setCoinTitle] = useState("📊 Crypto SMC Analysis");
  const [timeframeInfo, setTimeframeInfo] = useState(
    "Select coin and timeframes to analyze"
  );
  const [showResults, setShowResults] = useState(false);
  const [responseReady, setResponseReady] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const backendUrl = "https://ai.tradeonair.com/analyze";
  // const backendUrl = "http://localhost:8000/analyze";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);
    setResponseReady(false);
    setAnimationComplete(false);

    const formData = {
      coin: coin.toUpperCase(),
      higher_timeframe: higherTimeframe,
      lower_timeframe: lowerTimeframe,
      limit,
      market_type: marketType,
    };

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setRawResponse(data.analysis || "");

      setPriceData(data.price_data || null);

      setMarketAnalysisData(data.market_analysis || null);

      setTechnicalIndicators(data.technical_indicators || null);

      let parsedPriceActionDetail = null;
      let parsedTechnicalIndicatorsAnalysis = null;
      try {
        const jsonMatch = (data.analysis || "").match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedJson = JSON.parse(jsonMatch[0]);
          parsedPriceActionDetail = parsedJson.price_action_detail || null;
          parsedTechnicalIndicatorsAnalysis =
            parsedJson.technical_indicators_analysis || null;
        }
      } catch (e) {
        console.error("Failed to parse price action detail:", e);
      }

      setPriceActionDetail(parsedPriceActionDetail);
      setTechnicalIndicatorsAnalysis(parsedTechnicalIndicatorsAnalysis);

      const parsed = parseAnalysis(data.analysis || "");

      if (
        data.current_price &&
        (!parsed.marketStructure.price ||
          parsed.marketStructure.price === "N/A")
      ) {
        parsed.marketStructure.price = data.current_price.toFixed(2);
      }

      setAnalysisData(parsed);

      const marketLabel = marketType === "indian" ? "Indian Market" : "Crypto";
      setCoinTitle(`${coin.toUpperCase()} - ${marketLabel} SMC Analysis`);
      setTimeframeInfo(
        `Higher: ${higherTimeframe.toUpperCase()} | Lower: ${lowerTimeframe.toUpperCase()} | ${limit} Candles`
      );

      setResponseReady(true);
    } catch (error) {
      setLoading(false);
      setResponseReady(false);
      setAnimationComplete(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (animationComplete && responseReady) {
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
        setActiveTab("price");
        setResponseReady(false);
        setAnimationComplete(false);
      }, 500);
    }
  }, [animationComplete, responseReady]);

  const copyRawResponse = () => {
    if (rawResponse) {
      navigator.clipboard
        .writeText(rawResponse)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          alert("Failed to copy to clipboard");
        });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="container">
        <div className="header">
          <h1 id="coinTitle">{coinTitle}</h1>
          <div className="header-subtitle" id="timeframeInfo">
            {timeframeInfo}
          </div>
        </div>

        <div className="form-section">
          <form id="analysisForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="marketType-label">Market Type</InputLabel>
                  <Select
                    labelId="marketType-label"
                    id="marketType"
                    name="marketType"
                    value={marketType}
                    label="Market Type"
                    onChange={(e) => {
                      setMarketType(e.target.value);
                      if (e.target.value === "indian") {
                        setCoin("NIFTY50");
                      } else {
                        setCoin("BTCUSDT");
                      }
                    }}
                  >
                    {dropdownData.marketTypes.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-group">
                {marketType === "indian" ? (
                  <Autocomplete
                    id="coin-autocomplete"
                    options={[
                      ...dropdownData.indianIndices.map((item) => ({
                        ...item,
                        group: "Indices",
                      })),
                      ...dropdownData.indianStocks.map((item) => ({
                        ...item,
                        group: "Stocks",
                      })),
                    ]}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    value={
                      [
                        ...dropdownData.indianIndices,
                        ...dropdownData.indianStocks,
                      ].find((item) => item.value === coin) || null
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setCoin(newValue.value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Stock/Index"
                        required
                        variant="outlined"
                      />
                    )}
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const searchTerm = inputValue.toLowerCase();
                      return options.filter(
                        (option) =>
                          option.label.toLowerCase().includes(searchTerm) ||
                          option.value.toLowerCase().includes(searchTerm)
                      );
                    }}
                    fullWidth
                  />
                ) : (
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="coin-label">Cryptocurrency</InputLabel>
                    <Select
                      labelId="coin-label"
                      id="coin"
                      name="coin"
                      value={coin}
                      label="Cryptocurrency"
                      onChange={(e) => setCoin(e.target.value)}
                    >
                      {dropdownData.cryptoCoins.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>

              <div className="form-group">
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="higherTimeframe-label">
                    Higher Timeframe
                  </InputLabel>
                  <Select
                    labelId="higherTimeframe-label"
                    id="higherTimeframe"
                    name="higherTimeframe"
                    value={higherTimeframe}
                    label="Higher Timeframe"
                    onChange={(e) => setHigherTimeframe(e.target.value)}
                  >
                    {dropdownData.timeframes.higher.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-group">
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="lowerTimeframe-label">
                    Lower Timeframe
                  </InputLabel>
                  <Select
                    labelId="lowerTimeframe-label"
                    id="lowerTimeframe"
                    name="lowerTimeframe"
                    value={lowerTimeframe}
                    label="Lower Timeframe"
                    onChange={(e) => setLowerTimeframe(e.target.value)}
                  >
                    {dropdownData.timeframes.lower.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-group">
                <TextField
                  id="limit"
                  name="limit"
                  label="Number of Candles"
                  type="number"
                  value={limit}
                  onChange={(e) => {
                    const value = Number(e.target.value) || "";
                    if (value === "" || (value >= 1 && value <= 500)) {
                      setLimit(value);
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: 500,
                  }}
                  required
                  fullWidth
                  variant="outlined"
                  helperText="Maximum 500 candles allowed"
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading
                ? "Analyzing..."
                : marketType === "indian"
                ? "Analyze Indian Market"
                : "Analyze Cryptocurrency"}
            </button>
          </form>

          {loading && (
            <LoadingAnimation
              responseReady={responseReady}
              onComplete={() => setAnimationComplete(true)}
            />
          )}
        </div>

        {showResults && (
          <div id="resultsContainer">
            <div className="tabs-container">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "price" ? "active" : ""}`}
                  onClick={() => setActiveTab("price")}
                >
                  Price Action
                </button>
                <button
                  className={`tab ${activeTab === "smc" ? "active" : ""}`}
                  onClick={() => setActiveTab("smc")}
                >
                  SMC Analysis
                </button>
                <button
                  className={`tab ${activeTab === "trading" ? "active" : ""}`}
                  onClick={() => setActiveTab("trading")}
                >
                  Trading Setups
                </button>
                <button
                  className={`tab ${activeTab === "market" ? "active" : ""}`}
                  onClick={() => setActiveTab("market")}
                >
                  Market Analysis
                </button>
                <button
                  className={`tab ${activeTab === "detail" ? "active" : ""}`}
                  onClick={() => setActiveTab("detail")}
                >
                  Price Action & Indicators
                </button>
                {/* <button
                className={`tab ${activeTab === "raw" ? "active" : ""}`}
                onClick={() => setActiveTab("raw")}
              >
                Raw Response
              </button> */}
              </div>
            </div>

            <div
              className={`analysis-section ${
                activeTab === "smc" ? "active" : ""
              }`}
              id="smcAnalysis"
              style={{ display: activeTab === "smc" ? "block" : "none" }}
            >
              <div className="cards-grid" id="smcCards">
                {rawResponse && <SMCAnalysis rawResponse={rawResponse} />}
              </div>
            </div>

            <div
              className={`analysis-section ${
                activeTab === "trading" ? "active" : ""
              }`}
              id="tradingSetups"
              style={{ display: activeTab === "trading" ? "block" : "none" }}
            >
              <div id="tradingCards">
                {analysisData && <TradingSetups data={analysisData} />}
              </div>
            </div>

            <div
              className={`analysis-section ${
                activeTab === "price" ? "active" : ""
              }`}
              id="priceAction"
              style={{ display: activeTab === "price" ? "block" : "none" }}
            >
              {priceData && (
                <PriceActionChart
                  priceData={priceData}
                  supportLevels={analysisData?.support || []}
                  resistanceLevels={analysisData?.resistance || []}
                />
              )}
            </div>

            <div
              className={`analysis-section ${
                activeTab === "market" ? "active" : ""
              }`}
              id="marketAnalysis"
              style={{ display: activeTab === "market" ? "block" : "none" }}
            >
              {marketAnalysisData && (
                <MarketAnalysis data={marketAnalysisData} />
              )}
            </div>

            <div
              className={`analysis-section ${
                activeTab === "detail" ? "active" : ""
              }`}
              id="priceActionDetail"
              style={{ display: activeTab === "detail" ? "block" : "none" }}
            >
              <PriceActionDetail
                priceActionDetail={priceActionDetail}
                technicalIndicators={technicalIndicators}
                technicalIndicatorsAnalysis={technicalIndicatorsAnalysis}
                higherTimeframe={higherTimeframe}
                lowerTimeframe={lowerTimeframe}
              />
            </div>

            <div
              className={`analysis-section ${
                activeTab === "raw" ? "active" : ""
              }`}
              id="rawResponse"
              style={{ display: activeTab === "raw" ? "block" : "none" }}
            >
              <div className="raw-response-container">
                <div className="raw-response-header">
                  <h3>📄 Full AI Response</h3>
                  <button className="copy-btn" onClick={copyRawResponse}>
                    Copy
                  </button>
                </div>
                <pre id="rawResponseContent" className="raw-response-content">
                  {rawResponse}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
