import { useState, useMemo } from 'react';

const BASE_PRICE = 50;
const PRICE_PER_CHARACTER = 0.5;

function JerseyBuilder({ leftLogos, rightLogos, jerseyColors, createJersey }) {
  const [backName, setBackName] = useState('');
  const [leftLogoId, setLeftLogoId] = useState('');
  const [rightLogoId, setRightLogoId] = useState('');
  const [jerseyColorId, setJerseyColorId] = useState(jerseyColors[0]?.id || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedLeftLogo = leftLogos.find(l => l.id === Number(leftLogoId));
  const selectedRightLogo = rightLogos.find(l => l.id === Number(rightLogoId));
  const selectedColor = jerseyColors.find(c => c.id === Number(jerseyColorId));

  const totalPrice = useMemo(() => {
    let price = BASE_PRICE;
    price += backName.length * PRICE_PER_CHARACTER;
    if (selectedLeftLogo) price += Number(selectedLeftLogo.price_modifier);
    if (selectedRightLogo) price += Number(selectedRightLogo.price_modifier);
    if (selectedColor) price += Number(selectedColor.price_modifier);
    return price.toFixed(2);
  }, [backName, selectedLeftLogo, selectedRightLogo, selectedColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createJersey({
        back_name: backName,
        left_logo_id: leftLogoId || null,
        right_logo_id: rightLogoId || null,
        jersey_color_id: jerseyColorId || null
      });
      setSuccess('Added to favorites.');
      setBackName('');
      setLeftLogoId('');
      setRightLogoId('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="builder-card">
      <div className="jersey-preview" style={{ backgroundColor: selectedColor?.hex_color || '#cccccc' }}>
        <div className="jersey-collar" />
        {selectedLeftLogo && (
          <img src={selectedLeftLogo.image_url} alt={selectedLeftLogo.name} className="logo left-chest" />
        )}
        {selectedRightLogo && (
          <img src={selectedRightLogo.image_url} alt={selectedRightLogo.name} className="logo right-chest" />
        )}
        <div className="back-name-preview">{backName || 'YOUR NAME'}</div>
      </div>

      <form onSubmit={handleSubmit} className="jersey-form">
        <label>
          Back name
          <input
            type="text"
            value={backName}
            onChange={(e) => setBackName(e.target.value)}
            placeholder="e.g. RONALDO"
            required
          />
        </label>

        <label>
          Jersey color
          <div className="swatch-row">
            {jerseyColors.map(color => (
              <button
                type="button"
                key={color.id}
                className={`swatch ${Number(jerseyColorId) === color.id ? 'swatch-active' : ''}`}
                style={{ backgroundColor: color.hex_color }}
                onClick={() => setJerseyColorId(color.id)}
                aria-label={color.name}
                title={`${color.name}${Number(color.price_modifier) > 0 ? ` (+$${color.price_modifier})` : ''}`}
              />
            ))}
          </div>
        </label>

        <label>
          Left chest logo
          <select value={leftLogoId} onChange={(e) => setLeftLogoId(e.target.value)}>
            <option value="">None</option>
            {leftLogos.map(logo => (
              <option key={logo.id} value={logo.id}>
                {logo.name} (+${Number(logo.price_modifier).toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <label>
          Right chest logo
          <select value={rightLogoId} onChange={(e) => setRightLogoId(e.target.value)}>
            <option value="">None</option>
            {rightLogos.map(logo => (
              <option key={logo.id} value={logo.id}>
                {logo.name} (+${Number(logo.price_modifier).toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <div className="price-row">
          <span>Total</span>
          <span className="price-value">${totalPrice}</span>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn-primary">★ Add to Favorites</button>
      </form>
    </div>
  );
}

export default JerseyBuilder;