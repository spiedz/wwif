import React, { useState } from 'react';
import { getFAQSchema } from '../utils/schema';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  includeSchema?: boolean;
}

/**
 * Accordion FAQ Item that expands on click
 */
const FAQAccordionItem = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <svg
          className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-2 px-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
};

/**
 * FAQ Section component with schema markup
 * Displays a list of questions and answers with structured data for SEO
 */
const FAQSection: React.FC<FAQSectionProps> = ({ 
  items, 
  title = "Frequently Asked Questions",
  includeSchema = true 
}) => {
  // Create FAQ schema JSON-LD
  const faqSchema = includeSchema ? getFAQSchema(items) : null;
  
  return (
    <section className="mb-20">
      {title && (
        <>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
          <div className="w-20 h-1 bg-primary/30 rounded mx-auto mb-10"></div>
        </>
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {items.map((item, index) => (
            <FAQAccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
      
      {/* Include FAQ schema markup if enabled */}
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </section>
  );
};

export default FAQSection; 