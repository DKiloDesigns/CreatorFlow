export default function TailwindSimplePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Tailwind CSS Status
      </h1>
      
      <div className="bg-red-500 text-white p-4 rounded mb-4">
        This should be a red box with white text if Tailwind is working
      </div>
      
      <div className="bg-blue-500 text-white p-4 rounded mb-4">
        This should be a blue box with white text if Tailwind is working
      </div>
      
      <div className="bg-green-500 text-white p-4 rounded mb-4">
        This should be a green box with white text if Tailwind is working
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Current Configuration:
        </h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
          <li>Tailwind CSS: v3.4.1</li>
          <li>PostCSS Configuration: Using standard tailwindcss plugin</li>
          <li>Color Theme: Converted from OKLCH to RGB/HEX</li>
        </ul>
      </div>
    </div>
  );
}