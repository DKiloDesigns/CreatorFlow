import { ThemeToggle } from '@/components/theme-toggle';

export default function TestDarkModePage() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dark Mode Test Page</h1>
        <ThemeToggle isLandingPage={false} />
      </div>
      
      {/* Classic solid cards, no gradients */}
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-green-100 text-green-900 dark:bg-green-800 dark:text-white">
          <h3 className="font-semibold">Green Card (Success)</h3>
          <p>This should have a darker green background in dark mode</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-yellow-100 text-yellow-900 dark:bg-yellow-700 dark:text-white">
          <h3 className="font-semibold">Yellow Card (Warning)</h3>
          <p>This should have a darker yellow background in dark mode</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white">
          <h3 className="font-semibold">Blue Card (Info)</h3>
          <p>This should have a darker blue background in dark mode</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-purple-100 text-purple-900 dark:bg-purple-800 dark:text-white">
          <h3 className="font-semibold">Highlight Card</h3>
          <p>This should have a darker purple background in dark mode</p>
        </div>
        
        <button className="px-4 py-2 border-none rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors duration-200">
          CTA Button
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-lg border">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-base">
          <li>Make sure you're in dark mode (click the theme toggle in the navigation or above)</li>
          <li>Check if the cards above have darker, more visible backgrounds</li>
          <li>The backgrounds should be distinct from the page background</li>
        </ol>
      </div>
    </div>
  );
} 