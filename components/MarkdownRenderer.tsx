import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed prose-headings:font-semibold prose-a:text-blue-600 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-50">
      <ReactMarkdown
        components={{
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-bold mt-3 mb-1" {...props} />,
          p: ({node, ...props}) => <p className="mb-3" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;