import React from "react";

export default function JerseyBuilder({
  leftLogos,
  rightLogos,
  jerseyColors,
  createJersey,
}) {
  const [backName, setBackName] = useState("");
  const [leftLogoId, setLeftLogoId] = useState("");
  const [rightLogoId, setRightLogoId] = useState("");
  const [jerseyColorId, setJerseyColorId] = useState(jerseyColors[0]?.id || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedLeftLogo = leftLogos.find((l) => l.id === Number(leftLogoId));
  const selectedRightLogo = rightLogos.find(
    (l) => l.id === Number(rightLogoId),
  );
  const selectedColor = jerseyColors.find(
    (c) => c.id === Number(jerseyColorId),
  );

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
    setError("");
    setSuccess("");

    try {
      await createJersey({
        back_name: backName,
        left_logo_id: leftLogoId || null,
        right_logo_id: rightLogoId || null,
        jersey_color_id: jerseyColorId || null,
      });
      setSuccess("Jersey created!");
      setBackName("");
      setLeftLogoId("");
      setRightLogoId("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="jersey-builder">
      <div
        className="jersey-preview"
        style={{ backgroundColor: selectedColor?.hex_color || '#cccccc' }}
      >
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
          Back Name
          <input
            type="text"
            value={backName}
            onChange={(e) => setBackName(e.target.value)}
            placeholder="e.g. RONALDO"
            required
          />
        </label>

        <label>
          Left Chest Logo
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
          Right Chest Logo
          <select value={rightLogoId} onChange={(e) => setRightLogoId(e.target.value)}>
            <option value="">None</option>
            {rightLogos.map(logo => (
              <option key={logo.id} value={logo.id}>
                {logo.name} (+${Number(logo.price_modifier).toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <label>
          Jersey Color
          <select value={jerseyColorId} onChange={(e) => setJerseyColorId(e.target.value)}>
            {jerseyColors.map(color => (
              <option key={color.id} value={color.id}>
                {color.name} (+${Number(color.price_modifier).toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <p className="total-price">Total: ${totalPrice}</p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Add to Cart</button>
      </form>
    </div>
  );
}
