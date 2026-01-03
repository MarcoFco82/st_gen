import { useState } from 'react';
import { Header } from './components/Header';
import { ScaffoldPanel } from './components/ScaffoldPanel';
import { FileEditor } from './components/FileEditor';
import { FullCodePanel } from './components/FullCodePanel';
import { Panel } from './components/Panel';
import { useProjectStore } from './store/useProjectStore';
import type { FileNode } from './types';

function App() {
  const { 
    instructions, setInstructions,
    description, setDescription, 
    architecture, setArchitecture 
  } = useProjectStore();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  return (
    <div className="h-screen flex flex-col bg-teal text-celadon">
      <Header />
      
      <main className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Columna izquierda: Scaffold + Editor */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScaffoldPanel
              onSelectFile={setSelectedFile}
              selectedId={selectedFile?.id || null}
            />
          </div>
          <div className="h-64 bg-forest rounded-lg border border-teal p-4">
            <FileEditor file={selectedFile} />
          </div>
        </div>

        {/* Columna central: Instrucciones + Descripción + Arquitectura */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <Panel title="Instrucciones">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-full bg-transparent text-zinc-800 text-sm outline-none resize-none"
              placeholder="Instrucciones para el proyecto..."
            />
          </Panel>
          
          <Panel title="Descripción del Proyecto">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-full bg-transparent text-zinc-800 text-sm outline-none resize-none"
              placeholder="Describe tu proyecto..."
            />
          </Panel>

          <Panel title="Arquitectura">
            <textarea
              value={architecture}
              onChange={(e) => setArchitecture(e.target.value)}
              className="w-full h-full bg-transparent text-zinc-800 text-sm outline-none resize-none"
              placeholder="Define la arquitectura..."
            />
          </Panel>
        </div>

        {/* Columna derecha: Código completo */}
        <div className="overflow-hidden">
          <FullCodePanel />
        </div>
      </main>

      <footer className="bg-forest border-t border-teal px-4 py-2 text-center">
        <span className="text-aqua/70 text-sm">
          Desarrollado por <span className="font-bebas text-aqua tracking-wider">RENDERDEVO</span>
        </span>
      </footer>
    </div>
  );
}

export default App;