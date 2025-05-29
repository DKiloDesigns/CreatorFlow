export default function TailwindBasicPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-500">
        Basic Tailwind Test
      </h1>
      <p className="mt-4 text-gray-700">
        This page uses only basic Tailwind classes.
      </p>
      <div className="mt-8 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Blue Button
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Green Button
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Red Button
        </button>
      </div>
    </div>
  );
}