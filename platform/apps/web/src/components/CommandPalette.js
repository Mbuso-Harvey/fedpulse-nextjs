'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Radio, Building2, Users } from 'lucide-react';

const PAGES = [
  { id: 'dashboard', title: 'Dashboard', desc: 'Overview and metrics', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'renewal-watch', title: 'Renewal Watch', desc: 'Track expiring contracts', icon: Radio, href: '/dashboard/renewal-watch' },
  { id: 'departments', title: 'Departments', desc: 'Browse government departments', icon: Building2, href: '/dashboard/departments' },
  { id: 'suppliers', title: 'Suppliers', desc: 'Analyze vendor intelligence', icon: Users, href: '/dashboard/suppliers' }
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const filteredPages = PAGES.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href) => {
    setIsOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const handleKeyNav = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, filteredPages.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredPages[activeIndex]) {
          handleSelect(filteredPages[activeIndex].href);
        }
      }
    };
    document.addEventListener('keydown', handleKeyNav);
    return () => document.removeEventListener('keydown', handleKeyNav);
  }, [isOpen, activeIndex, filteredPages]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div className="p-4" onClick={e => e.stopPropagation()}>
        <div className="p-4">
          <Search className="p-4" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="p-4"
            placeholder="Search pages, actions, and data..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
          <div className="p-4">ESC</div>
        </div>
        
        <div className="p-4">
          <div className="p-4">Pages</div>
          {filteredPages.length > 0 ? (
            filteredPages.map((page, index) => {
              const Icon = page.icon;
              return (
                <div 
                  key={page.id} 
                  className={` ${index === activeIndex ? '' : ''}`}
                  onClick={() => handleSelect(page.href)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Icon className="p-4" size={18} />
                  <div className="p-4">
                    <div className="p-4">{page.title}</div>
                    <div className="p-4">{page.desc}</div>
                  </div>
                  {index === activeIndex && <div className="p-4">Enter to open</div>}
                </div>
              );
            })
          ) : (
            <div className="p-4">No results found for "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
