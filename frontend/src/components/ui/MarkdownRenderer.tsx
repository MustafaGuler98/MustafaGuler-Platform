import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'span'],
    attributes: {
        ...defaultSchema.attributes,
        span: ['style'],
    },
};

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
            components={{
                a: ({ node, className, children, href, ...props }) => {
                    const isExternal = href?.startsWith('http') || href?.startsWith('https');
                    const target = isExternal ? '_blank' : undefined;
                    const rel = isExternal ? 'noopener noreferrer' : undefined;

                    return (
                        <a
                            href={href}
                            target={target}
                            rel={rel}
                            className="text-primary no-underline hover:text-cyan-400 hover:underline transition-colors duration-200"
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
