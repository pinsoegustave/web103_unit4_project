import { useState, useEffect } from 'react';
import JerseyBuilder from './components/JerseyBuilder';
import JerseyList from './components/JerseyList';

const API_URL = 'http://localhost:3001';

function JerseysAPI() {
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
    if (!res.ok) throw new Error(data.error || 'Failed to create jersey');
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
    if (!res.ok) throw new Error(data.error || 'Failed to update jersey');
    await fetchJerseys();
    return data;
  };

  const deleteJersey = async (id) => {
    await fetch(`${API_URL}/jerseys/${id}`, { method: 'DELETE' });
    await fetchJerseys();
  };

  if (loading) return <p>Loading...</p>;

  const leftLogos = options.filter(o => o.type === 'left_chest');
  const rightLogos = options.filter(o => o.type === 'right_chest');
  const jerseyColors = options.filter(o => o.type === 'jersey_color');

  return (
    <div className="app">
      <h1>Jersey Builder</h1>
      <JerseyBuilder
        leftLogos={leftLogos}
        rightLogos={rightLogos}
        jerseyColors={jerseyColors}
        createJersey={createJersey}
      />
      <JerseyList
        jerseys={jerseys}
        leftLogos={leftLogos}
        rightLogos={rightLogos}
        jerseyColors={jerseyColors}
        updateJersey={updateJersey}
        deleteJersey={deleteJersey}
      />
    </div>
  );
}

export default JerseysAPI;