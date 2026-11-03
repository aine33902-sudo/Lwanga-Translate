import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BookOpen, Globe2, WifiOff } from 'lucide-react';
import SchoolLogo from './SchoolLogo';

export default function Project({ onTranslate, onOfflineHelp }: { onTranslate: () => void; onOfflineHelp: () => void }) {
  return (
    <motion.section className="project-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
      <div className="project-introduction">
        <div><span className="section-kicker">OUR KISWAHILI PROJECT</span><h2>Language is a bridge.<br /><em>Let's build it together.</em></h2><p>Lwanga Translate is a language-learning companion for the Kiswahili project at St. Charles Lwanga S.S. It brings English and Kiswahili a little closer, one word and one conversation at a time.</p></div>
        <SchoolLogo width={154} height={131} />
      </div>
      <div className="project-principles">
        <article><Globe2 size={23} strokeWidth={1.4} /><div><h3>Two languages. One conversation.</h3><p>Look up English or Kiswahili words, explore alternative meanings, and translate new sentences online. Keep teacher-checked words in your own dictionary and save the translations you want to remember.</p></div></article>
        <article><WifiOff size={23} strokeWidth={1.4} /><div><h3>Learning does not need a signal.</h3><p>A larger built-in dictionary, known phrases, and explicit personal verb forms work locally. Download the extended school lexicon once for thousands more meanings. Offline coverage is broad, not unlimited: unfamiliar sentences still need an online service.</p><button className="text-link" onClick={onOfflineHelp}>How offline translation works <ArrowUpRight size={15} /></button></div></article>
        <article><BookOpen size={23} strokeWidth={1.4} /><div><h3>A companion, not a classroom.</h3><p>Translation is a starting point, not the whole journey. Practice aloud, try new phrases, and check important translations with your Kiswahili teacher.</p></div></article>
      </div>
      <div className="project-ending"><p>Different words.<br /><em>Shared understanding.</em></p><button className="primary-button" onClick={onTranslate}>Let's translate <ArrowRight size={17} /></button></div>
    </motion.section>
  );
}