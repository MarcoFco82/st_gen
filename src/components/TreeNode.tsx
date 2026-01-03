import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FileNode } from '../types';
import { useProjectStore } from '../store/useProjectStore';

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  onSelect: (node: FileNode) => void;
  selectedId: string | null;
}

export function TreeNode({ node, depth, onSelect, selectedId }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  
  const { renameNode, deleteNode, addNode } = useProjectStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      renameNode(node.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setEditName(node.name);
      setIsEditing(false);
    }
  };

  const isSelected = selectedId === node.id;
  const isFolder = node.type === 'folder';

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`group flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-teal/30 ${
          isSelected ? 'bg-teal/50' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-aqua/50 hover:text-aqua"
        >
          ⠿
        </span>
        
        {isFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-aqua w-4"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        
        <span className="text-aqua">
          {isFolder ? '📁' : '📄'}
        </span>
        
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white text-zinc-800 px-1 text-sm outline-none border border-teal rounded"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 text-sm text-zinc-800"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {node.name}
          </span>
        )}
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isFolder && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addNode(node.id, 'folder', 'nueva-carpeta');
                }}
                className="text-xs text-aqua hover:text-celadon"
                title="Agregar carpeta"
              >
                +📁
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addNode(node.id, 'file', 'nuevo-archivo.ts');
                }}
                className="text-xs text-aqua hover:text-celadon"
                title="Agregar archivo"
              >
                +📄
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(node.id);
            }}
            className="text-xs text-accent hover:text-orange-400"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      </div>
      
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}