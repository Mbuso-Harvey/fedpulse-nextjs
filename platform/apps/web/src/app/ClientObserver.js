'use client';
import { useEffect } from 'react';

export default function ClientObserver() {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Trigger number counter if it's the live data section
          if (entry.target.id === 'live-data') {
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(counter => {
              const targetStr = counter.getAttribute('data-target');
              const isFloat = targetStr.includes('.');
              const target = parseFloat(targetStr);
              const prefix = counter.getAttribute('data-prefix') || '';
              const suffix = counter.getAttribute('data-suffix') || '';
              
              const duration = 2000;
              const steps = 60;
              const stepTime = Math.abs(Math.floor(duration / steps));
              let current = 0;
              
              const timer = setInterval(() => {
                current += target / steps;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                
                let displayVal = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
                counter.textContent = `${prefix}${displayVal}${suffix}`;
              }, stepTime);
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    // Sticky header
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
