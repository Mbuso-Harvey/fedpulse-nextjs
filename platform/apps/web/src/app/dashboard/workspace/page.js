import React from 'react';
import styles from './page.module.css';
import { Building2, Calendar, Target, Users, PenTool, CheckCircle2 } from 'lucide-react';

const columns = [
  {
    id: 'qualification',
    title: 'Qualification',
    icon: Target,
    cards: [
      { id: 1, title: 'Department of Defense Cloud Migration', agency: 'DoD', value: '$50M', dueDate: 'Oct 15, 2026', tags: ['Cloud', 'IT'] },
      { id: 2, title: 'Federal Aviation Admin Data Center', agency: 'FAA', value: '$25M', dueDate: 'Nov 01, 2026', tags: ['Infrastructure'] },
    ]
  },
  {
    id: 'teaming',
    title: 'Teaming',
    icon: Users,
    cards: [
      { id: 3, title: 'VA Health IT Modernization', agency: 'VA', value: '$120M', dueDate: 'Sep 30, 2026', tags: ['Health', 'IT'] },
      { id: 4, title: 'NASA Space Launch System Support', agency: 'NASA', value: '$85M', dueDate: 'Dec 12, 2026', tags: ['Engineering'] },
      { id: 5, title: 'Department of Energy Grid Security', agency: 'DoE', value: '$40M', dueDate: 'Oct 20, 2026', tags: ['Cybersecurity'] }
    ]
  },
  {
    id: 'proposal',
    title: 'Proposal Writing',
    icon: PenTool,
    cards: [
      { id: 6, title: 'HHS Medicaid Data Analytics', agency: 'HHS', value: '$65M', dueDate: 'Aug 15, 2026', tags: ['Data', 'Health'] },
      { id: 7, title: 'DHS Border Security Tech', agency: 'DHS', value: '$150M', dueDate: 'Aug 25, 2026', tags: ['Security'] }
    ]
  },
  {
    id: 'submitted',
    title: 'Submitted',
    icon: CheckCircle2,
    cards: [
      { id: 8, title: 'Treasury Financial Systems Upgrade', agency: 'Treasury', value: '$35M', dueDate: 'Jul 10, 2026', tags: ['Finance', 'IT'] },
      { id: 9, title: 'USDA Rural Broadband Initiative', agency: 'USDA', value: '$90M', dueDate: 'Jul 01, 2026', tags: ['Telecom'] }
    ]
  }
];

export default function CapturePipelinePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Capture Management Pipeline</h1>
      </header>
      
      <div className={styles.board}>
        {columns.map(column => {
          const Icon = column.icon;
          return (
            <div key={column.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>
                  <Icon size={20} />
                  {column.title}
                </h2>
                <span className={styles.cardCount}>{column.cards.length}</span>
              </div>
              
              <div className={styles.cardList}>
                {column.cards.map(card => (
                  <div key={card.id} className={styles.glassCard}>
                    <div className={styles.cardHeader}>
                      <div>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <div className={styles.agency}>
                          <Building2 size={14} />
                          <span>{card.agency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.tags}>
                      {card.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <div className={styles.value}>
                        {card.value}
                      </div>
                      <div className={styles.dueDate}>
                        <Calendar size={14} />
                        <span>{card.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
