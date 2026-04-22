import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState("Loading...");
  const [score, setScore] = useState(0);

  useEffect(() => {
    function fetchData() {
      chrome.storage.local.get(["cognitiveState", "cognitiveScore"], (data) => {
        if (data.cognitiveState !== undefined) {
          setState(data.cognitiveState);
          setScore(data.cognitiveScore || 0);
        }
      });
    }

    fetchData();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local") {
        fetchData();
      }
    });
  }, []);

  // Color logic
  const getColor = () => {
    if (state === "High Load") return "#ff4d4f";
    if (state === "Medium Load") return "#faad14";
    return "#52c41a";
  };

  return (
    <div
      style={{
        width: "250px",
        padding: "20px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Cognitive Load</h2>

      <h3 style={{ color: getColor() }}>{state}</h3>

      <p>Score: {score}</p>

      {/* Progress bar */}
      <div
        style={{
          height: "10px",
          width: "100%",
          background: "#eee",
          borderRadius: "5px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(score / 4) * 100}%`,
            background: getColor(),
            transition: "0.3s",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;