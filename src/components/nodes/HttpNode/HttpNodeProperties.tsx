export default function HttpNodeProperties() {
  return (
    <div>
      <h2>HTTP Node Properties</h2>
      <div>
        <label>Label</label>
        <input type="text" />
      </div>
      <div>
        <label>Method</label>
        <select>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </div>
      <div>
        <label>URL</label>
        <input type="text" />
      </div>
    </div>
  );
}