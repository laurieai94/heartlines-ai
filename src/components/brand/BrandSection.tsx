import React from "react";

interface BrandSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const BrandSection: React.FC<BrandSectionProps> = ({ title, children, className = "" }) => {
  return (
    <section className={`brand-section mb-12 print:mb-8 print:break-inside-avoid ${className}`}>
      <h2 className="text-2xl font-brand text-primary mb-6 pb-2 border-b border-primary/20 print:text-xl">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default BrandSection;
