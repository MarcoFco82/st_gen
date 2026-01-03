export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

export interface Snapshot {
  id: string;
  name: string;
  timestamp: number;
  scaffold: FileNode[];
  instructions: string;
  description: string;
  architecture: string;
}

export interface Project {
  name: string;
  instructions: string;
  description: string;
  architecture: string;
  scaffold: FileNode[];
  snapshots: Snapshot[];
}