export default function NavItem({ icon, label, showLabel, onClick}) {
    return (
        <div className={`flex items-center ${
            showLabel ? 'justify-start' : 'justify-center'
            } gap-4 p-2 rounded hover:bg-white hover:text-green-700 cursor-pointer transition-all duration-200`}
            onClick={onClick}
        >
            <span className="text-xl">{icon}</span>
            {showLabel && <span className="text-base">{label}</span>}
        </div>
    )
}