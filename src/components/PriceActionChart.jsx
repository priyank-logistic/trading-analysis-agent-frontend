"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";
import { EMA } from "technicalindicators";

// Calculate EMA using technicalindicators library
function calculateEMA(data, period) {
  if (!data || data.length === 0) return [];
  if (data.length < period) return [];

  const closes = data.map((d) => d.close);

  try {
    const emaValues = EMA.calculate({ values: closes, period });

    // Map indicator values back to time series data
    // Note: Technical indicators usually return fewer values than input
    const offset = data.length - emaValues.length;
    return emaValues.map((value, index) => ({
      time: data[offset + index].time,
      value: value,
    }));
  } catch (error) {
    console.error("Error calculating EMA:", error);
    return [];
  }
}

export default function PriceActionChart({
  priceData,
  supportLevels,
  resistanceLevels,
  showEMA = true,
  emaPeriods = [9, 21, 50], // Default EMA periods
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    if (!priceData || priceData.length === 0 || !chartContainerRef.current) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }

    const chartOptions = {
      layout: {
        textColor: "#9ca3af",
        background: { type: ColorType.Solid, color: "#1a1f2e" },
      },
      grid: {
        vertLines: { color: "#334155", style: 1, visible: true },
        horzLines: { color: "#334155", style: 1, visible: true },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#334155",
        textColor: "#9ca3af",
      },
      timeScale: {
        borderColor: "#334155",
        textColor: "#9ca3af",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 10,
      },
      localization: {
        locale: "en-IN",
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    candlestickSeriesRef.current = candlestickSeries;

    const IST_OFFSET_SECONDS = 5 * 3600 + 30 * 60;

    const formattedData = priceData.map((item) => {
      let timestamp = 0;

      if (item.timestamp_iso) {
        const timestampStr = String(item.timestamp_iso);
        const date = new Date(timestampStr);
        timestamp = Math.floor(date.getTime() / 1000);
      } else if (item.timestamp) {
        const date = new Date(item.timestamp);
        timestamp = Math.floor(date.getTime() / 1000);
      } else {
        const dateField = Object.keys(item).find(
          (key) =>
            key.toLowerCase().includes("date") ||
            key.toLowerCase().includes("time")
        );
        if (dateField) {
          const date = new Date(item[dateField]);
          timestamp = Math.floor(date.getTime() / 1000);
        }
      }

      const istTimestamp = timestamp + IST_OFFSET_SECONDS;

      return {
        time: istTimestamp,
        open: parseFloat(item.open) || 0,
        high: parseFloat(item.high) || 0,
        low: parseFloat(item.low) || 0,
        close: parseFloat(item.close) || 0,
      };
    });

    formattedData.sort((a, b) => a.time - b.time);

    candlestickSeries.setData(formattedData);

    // Add EMA indicators if enabled
    if (showEMA && emaPeriods && emaPeriods.length > 0) {
      const emaColors = [
        "#3b82f6", // Blue for EMA 9
        "#8b5cf6", // Purple for EMA 21
        "#f59e0b", // Orange for EMA 50
        "#10b981", // Green for EMA 100
        "#ef4444", // Red for EMA 200
      ];

      emaPeriods.forEach((period, index) => {
        const emaData = calculateEMA(formattedData, period);
        if (emaData.length > 0) {
          const emaSeries = chart.addSeries(LineSeries, {
            color: emaColors[index % emaColors.length],
            lineWidth: 2,
            lineStyle: 0, // Solid line
            title: `EMA ${period}`,
            priceLineVisible: false,
            lastValueVisible: true,
          });
          emaSeries.setData(emaData);
        }
      });
    }

    const supportPrices = supportLevels
      ? supportLevels
          .map((s) => {
            const price = s.price || s.value || 0;
            return typeof price === "string" && price !== "N/A"
              ? parseFloat(price.replace(/[^0-9.]/g, ""))
              : parseFloat(price);
          })
          .filter((p) => p > 0 && !isNaN(p))
      : [];

    supportPrices.forEach((price, idx) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#16a34a",
        lineWidth: 2,
        lineStyle: 2,
      });
      const firstTime = formattedData[0]?.time;
      const lastTime = formattedData[formattedData.length - 1]?.time;
      if (firstTime && lastTime) {
        lineSeries.setData([
          { time: firstTime, value: price },
          { time: lastTime, value: price },
        ]);
      }
    });

    const resistancePrices = resistanceLevels
      ? resistanceLevels
          .map((r) => {
            const price = r.price || r.value || 0;
            return typeof price === "string" && price !== "N/A"
              ? parseFloat(price.replace(/[^0-9.]/g, ""))
              : parseFloat(price);
          })
          .filter((p) => p > 0 && !isNaN(p))
      : [];

    resistancePrices.forEach((price, idx) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#ea580c",
        lineWidth: 2,
        lineStyle: 2,
      });
      const firstTime = formattedData[0]?.time;
      const lastTime = formattedData[formattedData.length - 1]?.time;
      if (firstTime && lastTime) {
        lineSeries.setData([
          { time: firstTime, value: price },
          { time: lastTime, value: price },
        ]);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, [priceData, supportLevels, resistanceLevels, showEMA, emaPeriods]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!priceData || priceData.length === 0) {
    return (
      <div
        style={{
          background: "#1a1f2e",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#9ca3af",
        }}
      >
        No price data available
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#1a1f2e",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
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
            margin: 0,
          }}
        >
          Price Action Chart
        </h2>
        {showEMA && emaPeriods && emaPeriods.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            {emaPeriods.map((period, index) => {
              const emaColors = [
                "#3b82f6",
                "#8b5cf6",
                "#f59e0b",
                "#10b981",
                "#ef4444",
              ];
              return (
                <div
                  key={period}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "2px",
                      backgroundColor: emaColors[index % emaColors.length],
                    }}
                  />
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                    }}
                  >
                    EMA {period}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
        }}
      />
    </div>
  );
}
