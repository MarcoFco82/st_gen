import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

interface CopyButtonProps {
  getText: () => string;
  label?: string;
}

export function CopyButton({ getText, label = 'COPY' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(getText());
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm font-medium bg-teal hover:bg-aqua hover:text-forest text-celadon rounded transition-colors"
    >
      {copied ? 'COPIED!' : label}
    </button>
  );
}