'use client';

import * as React from 'react';
import { Check, Copy, File } from 'lucide-react';
import { cn } from '@/lib/utils';

function CodeDisplay({ 
  filename, 
  code, 
  lang = 'tsx',
  icon: Icon = File,
  className = '' 
}) {
  const [highlightedCode, setHighlightedCode] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const highlight = async () => {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang,
          theme: 'github-dark',
        });
        setHighlightedCode(html);
      } catch (e) {
        console.error('Shiki error:', e);
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      }
    };
    highlight();
  }, [code, lang]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        'group relative border border-zinc-800 bg-[#0a0a0a] rounded-lg overflow-hidden shadow-2xl',
        className
      )}
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="flex items-center justify-between px-4 h-12 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-400 font-mono">
            {filename}
          </span>
        </div>
        
        <button 
          onClick={handleCopy} 
          className="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4 text-zinc-400" />
          )}
        </button>
      </div>
      
      <div 
        className={cn(
          'p-5 overflow-x-auto',
          'font-mono text-sm leading-relaxed',
          'scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          '[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0',
          '[&_code]:!bg-transparent [&_code]:!text-sm [&_code]:!leading-relaxed',
          '[&_.line]:block'
        )}
        style={{ backgroundColor: '#0a0a0a' }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }} 
      />
    </div>
  );
}

export { CodeDisplay };
