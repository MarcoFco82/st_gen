import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { FileNode, Project, Snapshot } from '../types';

interface ProjectStore extends Project {
  // Setters básicos
  setName: (name: string) => void;
  setInstructions: (instructions: string) => void;
  setDescription: (description: string) => void;
  setArchitecture: (architecture: string) => void;
  
  // Scaffold
  addNode: (parentId: string | null, type: 'file' | 'folder', name: string) => void;
  deleteNode: (id: string) => void;
  updateNodeContent: (id: string, content: string) => void;
  renameNode: (id: string, name: string) => void;
  moveNode: (nodeId: string, newParentId: string | null, index: number) => void;
  
  // Snapshots
  createSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  
  // Import/Export
  exportProject: () => string;
  importProject: (json: string) => void;
  resetProject: () => void;
}

const initialState: Project = {
  name: 'Nuevo Proyecto',
  instructions: '',
  description: '',
  architecture: '',
  scaffold: [],
  snapshots: [],
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ...initialState,

  setName: (name) => set({ name }),
  setInstructions: (instructions) => set({ instructions }),
  setDescription: (description) => set({ description }),
  setArchitecture: (architecture) => set({ architecture }),

  addNode: (parentId, type, name) => {
    const newNode: FileNode = {
      id: nanoid(),
      name,
      type,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    set((state) => {
      if (!parentId) {
        return { scaffold: [...state.scaffold, newNode] };
      }
      return { scaffold: addNodeToTree(state.scaffold, parentId, newNode) };
    });
  },

  deleteNode: (id) => {
    set((state) => ({ scaffold: deleteNodeFromTree(state.scaffold, id) }));
  },

  updateNodeContent: (id, content) => {
    set((state) => ({ scaffold: updateNodeInTree(state.scaffold, id, { content }) }));
  },

  renameNode: (id, name) => {
    set((state) => ({ scaffold: updateNodeInTree(state.scaffold, id, { name }) }));
  },

  moveNode: (nodeId, newParentId, index) => {
    set((state) => {
      const node = findNode(state.scaffold, nodeId);
      if (!node) return state;
      
      const withoutNode = deleteNodeFromTree(state.scaffold, nodeId);
      return { scaffold: insertNodeInTree(withoutNode, newParentId, node, index) };
    });
  },

  createSnapshot: (name) => {
    const state = get();
    const snapshot: Snapshot = {
      id: nanoid(),
      name,
      timestamp: Date.now(),
      scaffold: JSON.parse(JSON.stringify(state.scaffold)),
      instructions: state.instructions,
      description: state.description,
      architecture: state.architecture,
    };
    set((state) => ({ snapshots: [...state.snapshots, snapshot] }));
  },

  restoreSnapshot: (id) => {
    const snapshot = get().snapshots.find((s) => s.id === id);
    if (snapshot) {
      set({
        scaffold: JSON.parse(JSON.stringify(snapshot.scaffold)),
        instructions: snapshot.instructions,
        description: snapshot.description,
        architecture: snapshot.architecture,
      });
    }
  },

  deleteSnapshot: (id) => {
    set((state) => ({ snapshots: state.snapshots.filter((s) => s.id !== id) }));
  },

  exportProject: () => {
    const { name, instructions, description, architecture, scaffold, snapshots } = get();
    return JSON.stringify({ name, instructions, description, architecture, scaffold, snapshots }, null, 2);
  },

  importProject: (json) => {
    try {
      const project = JSON.parse(json) as Project;
      set({ ...project });
    } catch (e) {
      console.error('Error importing project:', e);
    }
  },

  resetProject: () => set({ ...initialState }),
}));

// Helper functions
function addNodeToTree(nodes: FileNode[], parentId: string, newNode: FileNode): FileNode[] {
  return nodes.map((node) => {
    if (node.id === parentId && node.children) {
      return { ...node, children: [...node.children, newNode] };
    }
    if (node.children) {
      return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
    }
    return node;
  });
}

function deleteNodeFromTree(nodes: FileNode[], id: string): FileNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return { ...node, children: deleteNodeFromTree(node.children, id) };
      }
      return node;
    });
}

function updateNodeInTree(nodes: FileNode[], id: string, updates: Partial<FileNode>): FileNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, id, updates) };
    }
    return node;
  });
}

function findNode(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function insertNodeInTree(nodes: FileNode[], parentId: string | null, node: FileNode, index: number): FileNode[] {
  if (!parentId) {
    const result = [...nodes];
    result.splice(index, 0, node);
    return result;
  }
  return nodes.map((n) => {
    if (n.id === parentId && n.children) {
      const newChildren = [...n.children];
      newChildren.splice(index, 0, node);
      return { ...n, children: newChildren };
    }
    if (n.children) {
      return { ...n, children: insertNodeInTree(n.children, parentId, node, index) };
    }
    return n;
  });
}