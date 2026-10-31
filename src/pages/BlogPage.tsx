'use client';

import React from 'react';
import { BlogSection } from '../components/BlogSection';

export const BlogPage: React.FC = () => {
  return (
    <div className="flex-1 bg-white pt-12 sm:pt-16">
      <BlogSection />
    </div>
  );
};
