import { Panel } from './Panel';
import { useProjectStore } from '../store/useProjectStore';
import type { FileNode } from '../types';

export function FullCodePanel() {
  const { instructions, description, architecture, scaffold } = useProjectStore();

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

  const generateCodeFiles = (): string => {
    const renderFile = (node: FileNode, path: string = ''): string => {
      const currentPath = path ? `${path}/${node.name}` : `root/${node.name}`;
      
      if (node.type === 'file') {
        const separator = '='.repeat(50);
        return `${separator}\n${currentPath}\n${separator}\n${node.content || '// vacío'}\n\n`;
      }
      
      if (node.children) {
        return node.children.map((child) => renderFile(child, path ? `${path}/${node.name}` : node.name)).join('');
      }
      
      return '';
    };

    return scaffold.map((node) => renderFile(node)).join('');
  };

  const generateFullCode = (): string => {
    const sections: string[] = [];
    const divider = '\n' + '#'.repeat(50) + '\n';

    if (instructions.trim()) {
      sections.push(`${divider}# INSTRUCCIONES${divider}\n${instructions}\n`);
    }

    if (description.trim()) {
      sections.push(`${divider}# DESCRIPCIÓN DEL PROYECTO${divider}\n${description}\n`);
    }

    if (architecture.trim()) {
      sections.push(`${divider}# ARQUITECTURA${divider}\n${architecture}\n`);
    }

    const scaffoldText = generateScaffoldText();
    if (scaffoldText.trim()) {
      sections.push(`${divider}# ESTRUCTURA DE ARCHIVOS${divider}\n${scaffoldText}`);
    }

    const codeFiles = generateCodeFiles();
    if (codeFiles.trim()) {
      sections.push(`${divider}# CÓDIGO${divider}\n${codeFiles}`);
    }

    return sections.join('\n') || 'Agrega contenido para generar el documento completo';
  };

  const fullCode = generateFullCode();

  return (
    <Panel title="Código Completo" onCopy={generateFullCode}>
      <pre className="text-xs text-zinc-800 font-mono whitespace-pre-wrap break-all">
        {fullCode}
      </pre>
    </Panel>
  );
}