export default function TailwindTestSimple() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-500">
        Tailwind Test Page
      </h1>
      <p className="mt-4 text-gray-700">
        If you can see this text styled properly, Tailwind is working!
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-red-500 p-4 text-white rounded">Red Box</div>
        <div className="bg-green-500 p-4 text-white rounded">Green Box</div>
        <div className="bg-blue-500 p-4 text-white rounded">Blue Box</div>
      </div>
    </div>
  );
}