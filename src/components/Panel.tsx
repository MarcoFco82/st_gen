import { CopyButton } from './CopyButton';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  onCopy?: () => string;
  actions?: React.ReactNode;
}

export function Panel({ title, children, onCopy, actions }: PanelProps) {
  return (
    <div className="flex flex-col h-full bg-forest rounded-lg border border-teal overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-amber border-b border-teal">
        <h2 className="text-sm font-semibold text-celadon">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
          {onCopy && <CopyButton getText={onCopy} />}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}