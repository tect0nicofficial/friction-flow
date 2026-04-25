import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownSummary({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-2 text-[15px] font-semibold text-[#9cdcfe]">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 text-[14px] font-semibold text-[#9cdcfe]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1 text-[13px] font-semibold text-[#9cdcfe]">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed text-[#d4d4d4]">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5 text-[#d4d4d4]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5 text-[#d4d4d4]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-[#d4d4d4]">{children}</em>
        ),
        code: ({ children, className }) =>
          className ? (
            <code className="block whitespace-pre-wrap rounded-xs bg-[#1e1e1e] p-3 font-mono text-[12px] text-[#d4d4d4]">
              {children}
            </code>
          ) : (
            <code className="rounded bg-[#1e1e1e] px-1 py-0.5 font-mono text-[12px] text-[#ce9178]">
              {children}
            </code>
          ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-[#3c3c3c] pl-3 text-[#d4d4d4] opacity-90">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
