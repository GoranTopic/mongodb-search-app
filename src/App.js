import React, { useState } from 'react';
import ReactJson from '@microlink/react-json-view';
import './App.css'; // Assuming you have the necessary CSS for styling

function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('cedula');
  const [results, setResults] = useState(null);  // Initialize as null instead of an empty array
  const [loading, setLoading] = useState(false); // New state to manage loading

  // Array of themes
  const themes = ["monokai", "rjv-default", "summerfruit", "eighties", "chalk", "apathy"];

  const handleSearch = async () => {
    setLoading(true); // Start loading when search is triggered
    const response = await fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchType, query }),
    });
    // Assuming the response is JSON
    const data = await response.json();
    setResults(data);  // Set the results from the backend to the state
    setLoading(false); // Stop loading after data is fetched
  };

  const renderCard = (key, index) => {
    if (results && results[key]) {
      const theme = themes[index % themes.length]
      return (
        <div className="card" key={key}>
          <h3>{key}</h3> {/* Dynamic Title */}
          <ReactJson src={results[key]} theme={theme} 
            enableClipboard={true} displayDataTypes={false}
            collapseStringsAfterLength={10}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="App">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <div className="radio-group">
          <input
            type="radio"
            id="cedula"
            name="searchType"
            value="cedula"
            checked={searchType === 'cedula'}
            onChange={() => setSearchType('cedula')}
          />
          <label htmlFor="cedula">Cedula</label>
          <input
            type="radio"
            id="nombre"
            name="searchType"
            value="nombre"
            onChange={() => setSearchType('nombre')}
          />
          <label htmlFor="nombre">Nombre</label>
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Show loading spinner if data is being fetched */}
      {loading ? (
        <div className="loader"></div> // You can replace this with any spinner/loader
      ) : (
        <>
          {results ? (
            <div className="results">
              {renderCard('supercias', 0)}
              {renderCard('registro_social', 1)}
              {renderCard('cne', 2)}
              {renderCard('ant', 3)}
              {renderCard('procesos_judiciales', 4)}
              {/* Add more keys as needed */}
            </div>
          ) : (
            <div className="no-results">
              <p>No results to display</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;