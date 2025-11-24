export function parseAnalysis(text) {
  let jsonData = null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonData = JSON.parse(jsonMatch[0]);
    } else {
      jsonData = JSON.parse(text);
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return {
      marketStructure: {},
      choch: {},
      resistance: [],
      support: [],
      bullishOB: [],
      bearishOB: [],
      fvg: [],
      setups: [],
    };
  }

  const data = {
    marketStructure: {
      trend: jsonData.market_structure?.current_trend || "Not identified",
      trendReasoning: jsonData.market_structure?.trend_reasoning || "",
      price: jsonData.market_structure?.current_price || "N/A",
      phase: jsonData.market_structure?.market_phase || "Not identified",
      phaseReasoning: jsonData.market_structure?.phase_reasoning || "",
    },
    choch: {
      type: jsonData.change_of_character?.type || "Not identified",
      level: jsonData.change_of_character?.level || "N/A",
      date: jsonData.change_of_character?.date || "N/A",
      explanation: jsonData.change_of_character?.explanation || "",
    },
    resistance: (jsonData.resistance_levels || []).map((r) => ({
      label: r.label || "",
      value: r.price || "N/A",
      description: r.description || "",
    })),
    support: (jsonData.support_levels || []).map((s) => ({
      label: s.label || "",
      value: s.price || "N/A",
      description: s.description || "",
    })),
    bullishOB: (jsonData.bullish_order_blocks || []).map((ob) => ({
      range: ob.range || "N/A",
      date: ob.date || "N/A",
      strength: ob.strength || "Moderate",
      reasoning: ob.reasoning || "",
      validity:
        ob.validity === "Likely Sustain" || ob.validity === "Likely Fail"
          ? ob.validity
          : null,
      liquidity_sweep_detected:
        ob.liquidity_sweep_detected === true ||
        ob.liquidity_sweep_detected === "true",
    })),
    bearishOB: (jsonData.bearish_order_blocks || []).map((ob) => ({
      range: ob.range || "N/A",
      date: ob.date || "N/A",
      strength: ob.strength || "Moderate",
      reasoning: ob.reasoning || "",
      validity:
        ob.validity === "Likely Sustain" || ob.validity === "Likely Fail"
          ? ob.validity
          : null,
      liquidity_sweep_detected:
        ob.liquidity_sweep_detected === true ||
        ob.liquidity_sweep_detected === "true",
    })),
    fvg: (jsonData.fair_value_gaps || []).map((fvg) => ({
      type: fvg.type || "Bullish",
      range: fvg.range || "N/A",
      date: fvg.date || "N/A",
      explanation: fvg.explanation || "",
    })),
    setups: (jsonData.trading_setups || []).map((setup) => ({
      name: setup.name || "N/A",
      probability: setup.probability || "Medium",
      condition: setup.condition || "N/A",
      riskReward: setup.risk_reward || "N/A",
      entry: setup.entry || "N/A",
      entryExplanation: setup.entry_explanation || "",
      stopLoss: setup.stop_loss || "N/A",
      stopLossExplanation: setup.stop_loss_explanation || "",
      targets: setup.targets || [],
      targetsExplanation: setup.targets_explanation
        ? {
            tp1: setup.targets_explanation.tp1 || "",
            tp2: setup.targets_explanation.tp2 || "",
            tp3: setup.targets_explanation.tp3 || "",
          }
        : null,
      calculation: setup.calculation || "",
      timeframe_analysis: setup.timeframe_analysis
        ? {
            htf_bias: setup.timeframe_analysis.htf_bias || "Neutral",
            htf_timeframe: setup.timeframe_analysis.htf_timeframe || "N/A",
            htf_poi: setup.timeframe_analysis.htf_poi || "N/A",
            ltf_timeframe: setup.timeframe_analysis.ltf_timeframe || "N/A",
            ltf_confirmation:
              setup.timeframe_analysis.ltf_confirmation || "N/A",
            entry_reasoning: setup.timeframe_analysis.entry_reasoning || "",
            setup_type: setup.timeframe_analysis.setup_type || "N/A",
          }
        : null,
    })),
  };

  return data;
}

// Local Storage utilities for saving analyses
const STORAGE_KEY = "crypto_analyses";

export function saveAnalysisToStorage(analysisData) {
  try {
    const analyses = getAnalysesFromStorage();

    // Check if an analysis with the same coin, marketType, and timeframes exists
    const existingIndex = analyses.findIndex((analysis) => {
      return (
        analysis.coin?.toUpperCase() === analysisData.coin?.toUpperCase() &&
        analysis.marketType === analysisData.marketType &&
        analysis.higherTimeframe === analysisData.higherTimeframe &&
        analysis.lowerTimeframe === analysisData.lowerTimeframe
      );
    });

    if (existingIndex !== -1) {
      // Update existing analysis
      const existingAnalysis = analyses[existingIndex];
      analyses[existingIndex] = {
        ...existingAnalysis,
        ...analysisData,
        id: existingAnalysis.id, // Keep the same ID
        timestamp: new Date().toISOString(), // Update timestamp
      };
      // Move updated analysis to the beginning
      const updatedAnalysis = analyses.splice(existingIndex, 1)[0];
      analyses.unshift(updatedAnalysis);
    } else {
      // Add new analysis
      const newAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...analysisData,
      };
      analyses.unshift(newAnalysis); // Add to beginning
    }

    // Keep only last 50 analyses
    const limitedAnalyses = analyses.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedAnalyses));
    return existingIndex !== -1 ? analyses[0].id : analyses[0].id;
  } catch (error) {
    console.error("Failed to save analysis to storage:", error);
    return null;
  }
}

export function getAnalysesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get analyses from storage:", error);
    return [];
  }
}

export function deleteAnalysisFromStorage(id) {
  try {
    const analyses = getAnalysesFromStorage();
    const filtered = analyses.filter((analysis) => analysis.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Failed to delete analysis from storage:", error);
    return false;
  }
}

export function clearAllAnalyses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear analyses from storage:", error);
    return false;
  }
}
