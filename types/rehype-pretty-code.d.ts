declare module 'rehype-pretty-code' {
  import { Plugin } from 'unified';
  
  interface RehypePrettyCodeOptions {
    theme?: string;
    keepBackground?: boolean;
    tokensMap?: Record<string, string>;
    transformers?: any[];
    filterMetaString?: (meta: string) => string;
    getHighlighter?: (options: any) => any;
  }
  
  const rehypePrettyCode: Plugin<[RehypePrettyCodeOptions?]>;
  
  export default rehypePrettyCode;
} 