import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useConsent } from '@/hooks/use-consent';

const CookieConsent = () => {
  const { t } = useTranslation();
  const { hasConsented, acceptAll, declineOptional } = useConsent();

  return (
    <AnimatePresence>
      {!hasConsented && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[hsl(var(--background))] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/10 overflow-hidden">
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent" />
              
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  {/* Icon & Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex-shrink-0">
                      <Cookie className="w-5 h-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                        {t.cookies.title}
                      </h3>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {t.cookies.description}{' '}
                        <a
                          href={`${import.meta.env.BASE_URL}Footer/Data Protection and Security.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[hsl(var(--primary))] hover:underline underline-offset-2 font-medium"
                        >
                          {t.cookies.privacyLink}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <motion.button
                      onClick={declineOptional}
                      className="px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full border border-foreground/20 hover:border-foreground/40 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t.cookies.decline}
                    </motion.button>
                    <motion.button
                      onClick={acceptAll}
                      className="px-6 py-2.5 text-sm font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--background))] rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-[hsl(var(--primary))]/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t.cookies.acceptAll}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
