/**
 * FALLBACK MARKDOWN PROCESSOR
 * 
 * This file provides a fallback markdown processor that uses basic string
 * replacement to handle simple HTML in markdown content. It's used when
 * rehype-raw and remark-gfm are unavailable.
 */

/**
 * Processes raw markdown and HTML content into HTML with basic formatting preserved
 * This is used as a fallback when rehype-raw is unavailable
 * 
 * @param content The mixed markdown and HTML content to process
 * @returns The processed HTML content
 */
export function processMixedContent(content: string): string {
  let processedContent = content;
  
  // Preserve important HTML elements
  const htmlElementsToPreserve = [
    { tag: 'div', attributes: ['style', 'class'] },
    { tag: 'img', attributes: ['src', 'alt', 'style'] },
    { tag: 'figure', attributes: ['style', 'class'] },
    { tag: 'figcaption', attributes: ['style', 'class'] },
    { tag: 'p', attributes: ['style', 'class'] },
    { tag: 'span', attributes: ['style', 'class'] },
    { tag: 'h1', attributes: ['style', 'class'] },
    { tag: 'h2', attributes: ['style', 'class'] },
    { tag: 'h3', attributes: ['style', 'class'] },
    { tag: 'h4', attributes: ['style', 'class'] },
    { tag: 'h5', attributes: ['style', 'class'] },
    { tag: 'h6', attributes: ['style', 'class'] },
    { tag: 'ul', attributes: ['style', 'class'] },
    { tag: 'ol', attributes: ['style', 'class'] },
    { tag: 'li', attributes: ['style', 'class'] },
    { tag: 'a', attributes: ['href', 'style', 'class', 'target'] },
  ];
  
  // Temporarily replace HTML elements with placeholders
  let placeholders: { placeholder: string; original: string }[] = [];
  let placeholderIndex = 0;
  
  htmlElementsToPreserve.forEach(({ tag }) => {
    // Match opening tags with attributes
    const openRegex = new RegExp(`<${tag}\\s+[^>]*>`, 'g');
    processedContent = processedContent.replace(openRegex, (match) => {
      const placeholder = `HTMLPLACEHOLDER${placeholderIndex++}HTMLPLACEHOLDER`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
    
    // Match closing tags
    const closeRegex = new RegExp(`</${tag}>`, 'g');
    processedContent = processedContent.replace(closeRegex, (match) => {
      const placeholder = `HTMLPLACEHOLDER${placeholderIndex++}HTMLPLACEHOLDER`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
    
    // Match self-closing tags
    const selfClosingRegex = new RegExp(`<${tag}\\s+[^>]*/>`, 'g');
    processedContent = processedContent.replace(selfClosingRegex, (match) => {
      const placeholder = `HTMLPLACEHOLDER${placeholderIndex++}HTMLPLACEHOLDER`;
      placeholders.push({ placeholder, original: match });
      return placeholder;
    });
  });
  
  // Perform basic markdown to HTML conversion
  processedContent = basicMarkdownToHtml(processedContent);
  
  // Restore HTML elements from placeholders
  placeholders.forEach(({ placeholder, original }) => {
    // Use global replace to ensure all instances are replaced
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processedContent = processedContent.replace(regex, original);
  });
  
  return processedContent;
}

/**
 * Very basic markdown to HTML conversion for simple elements
 * This is used as a fallback when remark/rehype processors are unavailable
 * It only handles the most common markdown syntax
 * 
 * @param markdown The markdown content to convert
 * @returns Basic HTML conversion
 */
function basicMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
  
  // Bold (process before italic to avoid conflicts)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic (be more careful with single asterisks and underscores)
  // Only match if not part of a bold pattern
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
  // Images (handle markdown images)
  html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');
  
  // Lists - unordered
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  
  // Lists - ordered
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Paragraphs (only apply to text not already in HTML tags)
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(paragraph => {
    // Skip if it's a placeholder or already has HTML tags
    if (paragraph.trim().includes('HTMLPLACEHOLDER') || 
        paragraph.trim().startsWith('<') ||
        paragraph.trim() === '') {
      return paragraph;
    }
    // Don't wrap list items in paragraphs
    if (paragraph.includes('<li>')) {
      return `<ul>${paragraph}</ul>`;
    }
    return `<p>${paragraph}</p>`;
  }).join('\n\n');
  
  return html;
}

export default processMixedContent; 