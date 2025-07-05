

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";


const GithubReadmeData: React.FC = () => {
  const [md, setMd] = useState<string>("Loading...");

  useEffect(() => {
    fetch("/GithubReadmeData.md")
      .then((res) => res.text())
      .then(setMd)
      .catch(() => setMd("# README not found"));
  }, []);

  return (
    <div className="prose max-w-none px-6 py-4 w-full h-full overflow-x-auto overflow-y-scroll" style={{ borderRadius: 12 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: (props) => (
            <img
              {...props}
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                maxHeight: props.height || 200,
                margin: '7px',
                borderRadius: 6,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
              alt={props.alt || ''}
            />
          ),
          a: (props) => (
            <a
              {...props}
              style={{
                color: "#3b81df",
                textDecoration: 'underline',
                ...props.style
              }}
              className={props.className}
              target={props.target || '_blank'}
              rel={props.rel || 'noopener noreferrer'}
            />
          ),
          table: (props) => (
            <table {...props} className="border-collapse border border-gray-300 dark:border-gray-600 w-full text-sm" />
          ),
          th: (props) => (
            <th {...props} className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-medium text-left tracking-wider" />
          ),
          td: (props) => (
            <td {...props} className="border border-gray-300 dark:border-gray-600 px-3 py-2 align-middle" />
          ),
          p: (props) => (
            <p {...props} className={"my-3 " + (props.className || '')} style={{...props.style, lineHeight: 1.7}} />
          ),
          h1: (props) => (
            <h1 {...props} className={"text-3xl font-bold mb-4 " + (props.className || '')} style={{...props.style, borderBottom: '2px solid #e5e7eb', paddingBottom: 16}} />
          ),
          h2: (props) => (
            <h2 {...props} className={"text-2xl font-semibold mt-8 mb-4 " + (props.className || '')} style={{...props.style, borderBottom: '1px solid #e5e7eb', paddingBottom: 8}} />
          ),
          h3: (props) => (
            <h3 {...props} className={"text-xl font-semibold mt-6 mb-2 " + (props.className || '')} style={{...props.style, paddingBottom: 8}} />
          ),
          ul: (props) => (
            <ul {...props} className={"list-disc ml-6 my-2 " + (props.className || '')} style={props.style} />
          ),
          ol: (props) => (
            <ol {...props} className={"list-decimal ml-6 my-2 " + (props.className || '')} style={props.style} />
          ),
          code: (props) => (
            <code {...props} className={"bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-[0.95em] " + (props.className || '')} style={props.style} />
          ),
          pre: (props) => (
            <pre {...props} className={"bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto my-3 " + (props.className || '')} style={props.style} />
          ),
          strong: (props) => (
            <strong {...props} className={"font-semibold " + (props.className || '')} style={props.style} />
          ),
          hr: (props) => (
            <hr {...props} className={"my-6 border-t border-gray-300 dark:border-gray-600 " + (props.className || '')} style={props.style} />
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
};

export default GithubReadmeData;