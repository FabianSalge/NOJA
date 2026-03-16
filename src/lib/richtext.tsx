import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Options } from '@contentful/rich-text-react-renderer';

export const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li>{children}</li>
    ),
    [BLOCKS.HEADING_1]: (_node, children) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="text-2xl font-bold mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="text-xl font-bold mb-2">{children}</h3>
    ),
    [BLOCKS.HR]: () => (
      <hr className="my-6 border-foreground/20" />
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="border-l-4 border-foreground/30 pl-4 italic mb-4">{children}</blockquote>
    ),
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
        {children}
      </a>
    ),
  },
};
