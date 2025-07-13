import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const currencies = ["usd", "eur", "gbp", "cny", "jpy"];

interface ConversionResponse {
  value: number;
}

function App() {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("usd");
  const [converted, setConverted] = useState<number | null>(null);
  const [prevConverted, setPrevConverted] = useState<number | null>(null);

  const fetchConversion = async () => {
    try {
      const res = await axios.get<ConversionResponse>(
        `http://localhost:5000/api/convert/${currency}`
      );
      console.log("res", res);

      const rate = res.data.value;
      console.log("amount", amount, rate);

      const convertedValue = amount * rate;
      console.log("convertedValue", convertedValue);
      setPrevConverted(converted);
      setConverted(convertedValue);
    } catch (err) {
      console.error("Error fetching rate:", err);
    }
  };

  const handleConvert = () => {
    fetchConversion();
  };

  const getChange = () => {
    if (converted === null || prevConverted === null) return null;
    const diff = converted - prevConverted;
    return diff.toFixed(2);
  };

  const isIncrease = () =>
    converted !== null && prevConverted !== null && converted > prevConverted;

  return (
    <div className="app">
      <h1>Crypto Converter</h1>

      <div className="form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur.toUpperCase()}
            </option>
          ))}
        </select>
        <button onClick={handleConvert}>Convert</button>
      </div>

      {converted !== null && (
        <div className="result">
          <p>
            Converted: <strong>{converted.toFixed(2)} WUC</strong>
          </p>
          {prevConverted !== null && converted !== prevConverted && (
            <p
              className={isIncrease() ? "green" : "red"}
              style={{ fontWeight: "bold" }}
            >
              {isIncrease() ? "↑" : "↓"} {getChange()} WUC
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
