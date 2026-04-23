import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState("Loading...");

  const getColor = () => {
    if (state === "Focused") return "#4CAF50";
    if (state === "Medium Load") return "#FF9800";
    return "#999";
  };

  const getScore = () => {
    if (state === "Focused") return 30;
    if (state === "Medium Load") return 70;
    return 0;
  };

  useEffect(() => {
    const fetchData = () => {
      chrome.storage.local.get(["cognitiveState"], (result) => {
        if (result.cognitiveState) {
          setState(result.cognitiveState);
        }
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: "250px",
      padding: "20px",
      fontFamily: "Arial",
      background: "#0f172a",
      color: "white",
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: "10px" }}>Cognitive Load</h2>

      <h3 style={{ color: getColor() }}>
        {state}
      </h3>

      <p style={{ marginTop: "5px" }}>
        Score: {getScore()}
      </p>

      {/* Progress Bar */}
      <div style={{
        height: "10px",
        width: "100%",
        background: "#333",
        borderRadius: "5px",
        marginTop: "15px"
      }}>
        <div style={{
          height: "100%",
          width: `${getScore()}%`,
          background: getColor(),
          borderRadius: "5px",
          transition: "width 0.5s ease"
        }}></div>
      </div>
    </div>
  );
}

export default App;