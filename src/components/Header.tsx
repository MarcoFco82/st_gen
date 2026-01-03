import { useRef, useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';

export function Header() {
  const {
    name,
    setName,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    exportProject,
    importProject,
    resetProject,
    instructions,
    description,
    architecture,
    scaffold,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snapshotName, setSnapshotName] = useState('');
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countLines = (nodes: typeof scaffold): number => {
    return nodes.reduce((acc, node) => {
      if (node.type === 'file') return acc + (node.content?.split('\n').length || 0);
      if (node.children) return acc + countLines(node.children);
      return acc;
    }, 0);
  };

  const totalLines = (instructions + description + architecture).split('\n').length + countLines(scaffold);

  const handleExport = () => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        importProject(json);
      };
      reader.readAsText(file);
    }
  };

  const handleCreateSnapshot = () => {
    const snapName = snapshotName.trim() || `Snapshot ${snapshots.length + 1}`;
    createSnapshot(snapName);
    setSnapshotName('');
  };

  return (
    <header className="bg-forest border-b border-teal px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Izquierda: Fecha, Hora, Líneas */}
        <div className="flex items-center gap-6">
          <div className="font-elegant text-3xl text-aqua tracking-wide">
            {currentTime.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="font-elegant text-3xl text-accent">
            {currentTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="font-elegant text-3xl text-accent">
            {totalLines} líneas
          </div>
        </div>

        {/* Centro: Nombre del proyecto */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-xl font-bold bg-transparent text-celadon outline-none border-b border-transparent focus:border-aqua text-center"
        />

        {/* Derecha: Botones */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
          >
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-sm bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => setShowSnapshots(!showSnapshots)}
            className="px-3 py-1.5 text-sm bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
          >
            Snapshots ({snapshots.length})
          </button>
          <button
            onClick={() => {
              if (confirm('¿Resetear proyecto?')) resetProject();
            }}
            className="px-3 py-1.5 text-sm bg-accent hover:bg-orange-600 text-celadon rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {showSnapshots && (
        <div className="mt-3 p-3 bg-forest/50 rounded-lg border border-teal">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Nombre del snapshot..."
              className="flex-1 bg-white text-zinc-800 px-2 py-1 text-sm rounded border border-teal outline-none focus:border-aqua"
            />
            <button
              onClick={handleCreateSnapshot}
              className="px-3 py-1 text-sm bg-aqua hover:bg-celadon text-forest rounded transition-colors"
            >
              Crear
            </button>
          </div>
          
          {snapshots.length > 0 ? (
            <ul className="space-y-1">
              {snapshots.map((snap) => (
                <li
                  key={snap.id}
                  className="flex items-center justify-between bg-forest px-3 py-2 rounded border border-teal/50"
                >
                  <div>
                    <span className="text-sm text-zinc-800">{snap.name}</span>
                    <span className="text-xs text-aqua ml-2">
                      {new Date(snap.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreSnapshot(snap.id)}
                      className="text-xs text-aqua hover:text-celadon"
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => deleteSnapshot(snap.id)}
                      className="text-xs text-accent hover:text-orange-400"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-aqua/70">No hay snapshots guardados</p>
          )}
        </div>
      )}
    </header>
  );
}