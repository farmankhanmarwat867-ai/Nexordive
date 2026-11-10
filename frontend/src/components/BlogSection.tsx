'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5363] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#0d5363]" />
            <span>{blogData?.sectionEyebrow || 'Engineering Insights & Knowledge'}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight text-balance">
            {blogData?.sectionTitle || 'Latest From Our Journal'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
            Practical architectures, case studies, and engineering deep dives from the NexorDive squad.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog: BlogCardItem, idx: number) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#0d5363]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-slate-900 relative">
                <img
                  src={blog.image || '/assets/khyber/blog1.png'}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text info */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#0d5363] mb-3">
                    <span className="font-bold uppercase tracking-wider">{blog.date}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>5 min read</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-[#0d5363] transition-colors leading-snug mb-3">
                    {blog.title}
                  </h3>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0d5363]">
                  <a
                    href={blog.link || '#'}
                    className="flex items-center justify-between w-full hover:underline group/link focus-visible:ring-2 focus-visible:ring-[#0d5363] rounded py-1"
                  >
                    <span>Read Full Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
