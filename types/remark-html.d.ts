declare module 'remark-html' {
  import { Plugin } from 'unified';
  
  interface RemarkHtmlOptions {
    sanitize?: boolean;
    handlers?: Record<string, any>;
    defaultHandler?: (node: any, parent: any) => string;
  }
  
  const remarkHtml: Plugin<[RemarkHtmlOptions?]> | any;
  
  export default remarkHtml;
} 