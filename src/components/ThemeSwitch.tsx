import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

export default function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      {(['light', 'dark'] as Theme[]).map(option => {
        const Icon = option === 'light' ? Sun : Moon;
        return <button key={option} type="button" className={`theme-option ${theme === option ? 'selected' : ''}`} aria-pressed={theme === option} aria-label={`Use ${option} theme`} title={`Use ${option} theme`} onClick={() => onChange(option)}>
          {theme === option && <motion.span className="theme-selection" layoutId="theme-selection" transition={{ type: 'spring', stiffness: 360, damping: 30 }} />}
          <Icon size={15} strokeWidth={1.7} /><span>{option === 'light' ? 'Light' : 'Dark'}</span>
        </button>;
      })}
    </div>
  );
}