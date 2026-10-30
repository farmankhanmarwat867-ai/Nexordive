'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../context/AdminStore';
import { BlogCardItem } from '../types/content';

export const BlogSection: React.FC = () => {
  const { content } = useAdmin();
  const blogData = content?.blog;

  const rawBlogs = blogData?.blogs || [];
  const blogs = rawBlogs
    .filter((b: BlogCardItem) => b.visible !== false)
    .sort((a: BlogCardItem, b: BlogCardItem) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="blog" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0d5363]">
            {blogData?.sectionEyebrow || 'OUR BLOG'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {blogData?.sectionTitle || 'Latest From Blog'}
          </h2>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog: BlogCardItem, idx: number) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
            >
              {/* Image banner */}
              <div className="w-full h-56 overflow-hidden bg-slate-900">
                <img
                  src={blog.image || '/assets/khyber/blog1.png'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text info */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-[#0d5363] mb-3">
                    {blog.date}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#0d5363] transition-colors leading-snug">
                    {blog.title}
                  </h3>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0d5363]">
                  <a
                    href={blog.link || '#'}
                    className="flex items-center justify-between w-full hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
