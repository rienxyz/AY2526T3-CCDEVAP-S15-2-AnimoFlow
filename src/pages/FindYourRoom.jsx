import "./find-your-room.css";

export default function FindYourRoom() {
  return (
    <body className="find-room-page">
    <div className="container">
      <h1 className="page-title">Find Your Room</h1>

      <div className="from-select-row">
        <label htmlFor="from-select">Where are you now?</label>

        <select id="from-select">
          <option value="">— Select your current location —</option>

          <optgroup label="Gates">
            <option value="Gate 1 (South)">Gate 1 (South)</option>
            <option value="Gate 2 (North)">Gate 2 (North)</option>
            <option value="Gate 3 (Velasco)">Gate 3 (Velasco)</option>
            <option value="Gate 4A (Gokongwei)">Gate 4A (Gokongwei)</option>
            <option value="Gate 5A (Andrew)">Gate 5A (Andrew)</option>
            <option value="Gate 6 (Razon)">Gate 6 (Razon)</option>
            <option value="Gate 7 (STRC)">Gate 7 (STRC)</option>
            <option value="Gate 8 (Agno)">Gate 8 (Agno)</option>
          </optgroup>
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          id="search-input"
          placeholder="Enter room code (e.g. LS305) or building name"
        />

        <button id="search-btn">
          Search
        </button>
      </div>

      <div id="results-area"></div>
    </div>
    </body>
  );
}