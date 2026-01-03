import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { FileNode } from '../types';

interface FileEditorProps {
  file: FileNode | null;
}

export function FileEditor({ file }: FileEditorProps) {
  const { updateNodeContent } = useProjectStore();
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(file?.content || '');
  }, [file?.id]);

  const handleSave = () => {
    if (file) {
      updateNodeContent(file.id, content);
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-aqua/50">
        Selecciona un archivo para editar
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-aqua">{file.name}</span>
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-aqua hover:bg-celadon text-forest rounded transition-colors"
        >
          Guardar
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full bg-white text-zinc-800 p-3 text-sm font-mono rounded border border-teal outline-none focus:border-aqua resize-none"
        placeholder="Pega el código aquí..."
        spellCheck={false}
      />
      <span className="text-xs text-aqua/70">
        {content.split('\n').length} líneas
      </span>
    </div>
  );
}