declare module 'remark-prism' {
  import { Plugin } from 'unified';
  
  interface RemarkPrismOptions {
    plugins?: string[];
    theme?: string;
    transformInlineCode?: boolean;
    showLanguage?: boolean;
    showLineNumbers?: boolean;
    extensions?: Array<{
      name: string;
      alias?: string[];
      [key: string]: any;
    }>;
  }
  
  const remarkPrism: Plugin<[RemarkPrismOptions?]> | any;
  
  export default remarkPrism;
} 