declare module 'rehype-stringify' {
  import { Plugin } from 'unified';
  
  interface RehypeStringifyOptions {
    allowDangerousHtml?: boolean;
    [key: string]: any;
  }
  
  const rehypeStringify: Plugin<[RehypeStringifyOptions?]>;
  
  export default rehypeStringify;
} 