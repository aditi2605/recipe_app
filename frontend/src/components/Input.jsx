export default function Input({ label, value, onChange }){
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-yellow-200 rounded-md shadow-md focus:ring-green-500 focus:border-green-500"
            required
            />
        </div>
    )
}