import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Panel } from './Panel';
import { TreeNode } from './TreeNode';
import { useProjectStore } from '../store/useProjectStore';
import type { FileNode } from '../types';

interface ScaffoldPanelProps {
  onSelectFile: (node: FileNode | null) => void;
  selectedId: string | null;
}

export function ScaffoldPanel({ onSelectFile, selectedId }: ScaffoldPanelProps) {
  const { scaffold, addNode, moveNode } = useProjectStore();
  const [newItemName, setNewItemName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveNode(active.id as string, null, scaffold.findIndex(n => n.id === over.id));
    }
  };

  const getAllIds = (nodes: FileNode[]): string[] => {
    return nodes.flatMap((node) => [
      node.id,
      ...(node.children ? getAllIds(node.children) : []),
    ]);
  };

  const generateScaffoldText = (): string => {
    const renderNode = (node: FileNode, indent: string = ''): string => {
      let result = `${indent}${node.name}${node.type === 'folder' ? '/' : ''}\n`;
      if (node.children) {
        node.children.forEach((child) => {
          result += renderNode(child, indent + '  ');
        });
      }
      return result;
    };
    return scaffold.map((node) => renderNode(node)).join('');
  };

  const handleAddRoot = (type: 'file' | 'folder') => {
    const name = newItemName.trim() || (type === 'folder' ? 'nueva-carpeta' : 'nuevo-archivo.ts');
    addNode(null, type, name);
    setNewItemName('');
  };

  return (
    <Panel title="Scaffold" onCopy={generateScaffoldText}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nombre..."
            className="flex-1 bg-forest text-celadon px-2 py-1 text-sm rounded border border-teal outline-none focus:border-aqua"
          />
          <button
            onClick={() => handleAddRoot('folder')}
            className="px-2 py-1 text-sm bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
          >
            +Carpeta
          </button>
          <button
            onClick={() => handleAddRoot('file')}
            className="px-2 py-1 text-sm bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
          >
            +Archivo
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={getAllIds(scaffold)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {scaffold.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  onSelect={(n) => onSelectFile(n.type === 'file' ? n : null)}
                  selectedId={selectedId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {scaffold.length === 0 && (
          <p className="text-aqua/50 text-sm text-center py-4">
            Agrega carpetas o archivos para comenzar
          </p>
        )}
      </div>
    </Panel>
  );
}