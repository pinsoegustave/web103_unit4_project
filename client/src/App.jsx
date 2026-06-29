import { useState, useEffect } from 'react';
import JerseyBuilder from './components/JerseyBuilder';
import JerseyList from './components/JerseyList';

const API_URL = 'http://localhost:3001';

function App() {
  const [options, setOptions] = useState([]);
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    const res = await fetch(`${API_URL}/options`);
    const data = await res.json();
    setOptions(data);
  };

  const fetchJerseys = async () => {
    const res = await fetch(`${API_URL}/jerseys`);
    const data = await res.json();
    setJerseys(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchOptions(), fetchJerseys()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const createJersey = async (jerseyData) => {
    const res = await fetch(`${API_URL}/jerseys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jerseyData)
    });
    const data = await res.json();
    if (!res.ok) console.log('Failed to create jersey');
    await fetchJerseys();
    return data;
  };

  const updateJersey = async (id, jerseyData) => {
    const res = await fetch(`${API_URL}/jerseys/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jerseyData)
    });
    const data = await res.json();
    if (!res.ok) console.log('Failed to create jersey');
    await fetchJerseys();
    return data;
  };

  const deleteJersey = async (id) => {
    await fetch(`${API_URL}/jerseys/${id}`, { method: 'DELETE' });
    await fetchJerseys();
  };

  if (loading) return <p className="loading-state">Loading...</p>;

  const leftLogos = options.filter(o => o.type === 'left_chest');
  const rightLogos = options.filter(o => o.type === 'right_chest');
  const jerseyColors = options.filter(o => o.type === 'jersey_color');

  return (
    <div className="app">
      <header className="hero">
        <p className="hero-eyebrow">Custom Kits, Made Yours</p>
        <h1 className="hero-title">DESIGN YOUR<br />OWN JERSEY</h1>
        <p className="hero-subtitle">
          Pick your colors, add your crest, make it yours. Saved kits live in your favorites below.
        </p>
      </header>

      <main className="builder-section">
        <JerseyBuilder
          leftLogos={leftLogos}
          rightLogos={rightLogos}
          jerseyColors={jerseyColors}
          createJersey={createJersey}
        />
      </main>

      <section className="favorites-section">
        <h2 className="section-title">Your Favorites</h2>
        <JerseyList
          jerseys={jerseys}
          leftLogos={leftLogos}
          rightLogos={rightLogos}
          jerseyColors={jerseyColors}
          updateJersey={updateJersey}
          deleteJersey={deleteJersey}
        />
      </section>
    </div>
  );
}

export default App;