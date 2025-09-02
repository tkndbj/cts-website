export default function MobileNavigation({
  projects,
  currentProject,
  onProjectSelect,
}: {
  projects: Array<{ id: number; title: string; description: string }>;
  currentProject: number;
  onProjectSelect: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gray-900/95 backdrop-blur-lg border-t border-white/10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60 uppercase tracking-wider">
              Projeler
            </span>
            <span className="text-xs text-white/40">{currentProject}/4</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => onProjectSelect(p.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  currentProject === p.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/10 text-white/70 active:bg-white/20"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
