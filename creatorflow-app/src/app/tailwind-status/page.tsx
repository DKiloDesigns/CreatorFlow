export default function TailwindStatusPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb' }}>
        Tailwind CSS Status Check
      </h1>
      
      <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Configuration</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
          <li>PostCSS Plugin: <code style={{ backgroundColor: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>@tailwindcss/postcss</code></li>
          <li>Config File: <code style={{ backgroundColor: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>tailwind.config.mjs</code></li>
          <li>CSS Import: <code style={{ backgroundColor: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>@tailwind base; @tailwind components; @tailwind utilities;</code></li>
        </ul>
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#b91c1c' }}>Tailwind CSS is NOT working</h2>
        <p>If you can see this message with red styling, but don't see the blue box below with Tailwind styling, then Tailwind CSS is not processing correctly.</p>
      </div>
      
      <div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        <h2 className="font-bold">This should have Tailwind styling</h2>
        <p>If you see this box with blue styling, then Tailwind CSS is working!</p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Next Steps</h2>
        <ol style={{ listStyleType: 'decimal', paddingLeft: '2rem' }}>
          <li>Check if the blue box above has styling</li>
          <li>If not, try downgrading Tailwind to v3.x</li>
          <li>Or try using a different PostCSS configuration</li>
        </ol>
      </div>
    </div>
  );
}