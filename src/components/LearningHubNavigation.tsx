import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Languages } from 'lucide-react';

export type HubView = 'translator' | 'phrasebook' | 'about';
const views: { id: HubView; label: string; Icon: typeof Languages }[] = [
  { id: 'translator', label: 'Translator', Icon: Languages },
  { id: 'phrasebook', label: 'Words & phrases', Icon: BookOpen },
  { id: 'about', label: 'Our project', Icon: GraduationCap },
];

export function LearningHubPanel({ view, active, children }: { view: HubView; active: boolean; children: ReactNode }) {
  return <motion.div className="hub-panel" id={`hub-panel-${view}`} role="tabpanel" aria-labelledby={`hub-tab-${view}`} tabIndex={active ? 0 : -1} hidden={!active} initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }} transition={{ duration: 0.22 }}>
    {children}
  </motion.div>;
}

export default function LearningHubNavigation({ view, onChange }: { view: HubView; onChange: (view: HubView) => void }) {
  return (
    <div className="learning-hub-navigation">
      <div className="hub-tabs" role="tablist" aria-label="Learning hub tools">
        {views.map(({ id, label, Icon }, index) => <button key={id} type="button" id={`hub-tab-${id}`} className={`hub-tab ${view === id ? 'active' : ''}`} role="tab" aria-selected={view === id} aria-controls={`hub-panel-${id}`} tabIndex={view === id ? 0 : -1} onClick={() => onChange(id)} onKeyDown={event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % views.length;
          else if (event.key === 'ArrowLeft') next = (index - 1 + views.length) % views.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = views.length - 1;
          else return;
          event.preventDefault();
          onChange(views[next].id);
          document.getElementById(`hub-tab-${views[next].id}`)?.focus();
        }}>
          <Icon size={15} strokeWidth={1.7} /><span>{label}</span>
          {view === id && <motion.span className="hub-tab-indicator" layoutId="hub-tab-indicator" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
        </button>)}
      </div>
      <span className="hub-caption">ONE PLACE. TWO LANGUAGES.</span>
    </div>
  );
}