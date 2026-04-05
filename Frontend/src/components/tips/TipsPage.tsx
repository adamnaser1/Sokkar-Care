import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useLanguage } from '@/hooks/useLanguage';
import { Syringe, AlertTriangle, TrendingUp, Moon, Dumbbell, ChevronRight, PlayCircle } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const TipsPage = () => {
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const incrementTipsRead = useAppStore(s => s.incrementTipsRead);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [emblaRef] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' }, [Autoplay({ delay: 4000 })]);

  const carouselSlides = [
    { id: 1, image: '/images/ramadan_slide.png', alt: 'Ramadan & Diabetes' },
    { id: 2, image: '/images/exercise_slide.png', alt: 'Exercise & Health' }
  ];

  const tipsData = [
    {
      id: 'injection', 
      icon: Syringe, 
      label: t.tips.injection.label, 
      emoji: '💉', 
      bgColor: 'bg-primary/10',
      content: t.tips.injection,
      videos: {
        fr: ['Ku_sP177x9c'],
        ar: ['7SLD3YQtNoE']
      }
    },
    {
      id: 'hypo', 
      icon: AlertTriangle, 
      label: t.tips.hypo.label, 
      emoji: '🔴', 
      bgColor: 'bg-destructive/10',
      content: t.tips.hypo,
      videos: {
        fr: ['QzJoEg7E-fA'],
        ar: ['5ywj7gtKzas']
      }
    },
    {
      id: 'hyper', 
      icon: TrendingUp, 
      label: t.tips.hyper.label, 
      emoji: '🟡', 
      bgColor: 'bg-warning/10',
      content: t.tips.hyper,
      videos: {
        fr: ['mYp7rKW_A84'],
        ar: ['TD6JCx0Vtxk']
      }
    },
    {
      id: 'ramadan', 
      icon: Moon, 
      label: t.tips.ramadan.label, 
      emoji: '🌙', 
      bgColor: 'bg-indigo-50',
      content: t.tips.ramadan,
      videos: {
        fr: ['xfqJ1PhSQ4c'],
        ar: ['PSWbIeG-itA']
      }
    },
    {
      id: 'exercise', 
      icon: Dumbbell, 
      label: t.tips.exercise.label, 
      emoji: '💪', 
      bgColor: 'bg-emerald-50',
      content: t.tips.exercise,
      videos: {
        fr: ['HzhwQxt2XYg', 'RCGgbWmdMmI'],
        ar: ['sFUZoALDBYw', 'OJgTsBTWy3w']
      }
    },
  ];

  const handleOpen = (id: string) => {
    setActiveTip(activeTip === id ? null : id);
    if (activeTip !== id) {
      incrementTipsRead();
    }
  };

  const openTip = activeTip ? tipsData.find(t => t.id === activeTip) : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          {t.tips.title}
        </motion.h1>
        <p className="text-sm text-muted-foreground mb-5">{t.tips.subtitle}</p>

        {/* Carousel Section */}
        <div className="mb-6 overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {carouselSlides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_80%] pr-4 mr-0">
                <img src={slide.image} alt={slide.alt} className="w-full h-48 object-cover rounded-2xl shadow-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Tip Cards List */}
        <div className="flex flex-col gap-3">
          {tipsData.map((tip, i) => (
            <motion.div key={tip.id}>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpen(tip.id)}
                className={`w-full p-4 rounded-2xl bg-card card-shadow flex items-center gap-4 hover:shadow-md transition-all ${isRTL ? 'flex-row-reverse text-right' : 'text-left'} ${activeTip === tip.id ? 'ring-2 ring-primary/30' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl ${tip.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{tip.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{tip.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tip.content.title}</p>
                </div>
                <motion.div
                  animate={{ rotate: activeTip === tip.id ? (isRTL ? -90 : 90) : (isRTL ? 180 : 0) }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={18} className="text-muted-foreground" />
                </motion.div>
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {activeTip === tip.id && openTip && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pt-4 pb-2 flex flex-col gap-4">
                      {/* Video Embeds */}
                      <div className="flex flex-col gap-3">
                        <p className={`text-xs font-bold text-muted-foreground flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <PlayCircle size={14} className="text-primary" />
                          {isRTL ? 'شاهد بالفيديو' : 'Regarder en vidéo'}
                        </p>
                        {(openTip as any).videos[language === 'ar' ? 'ar' : 'fr'].map((vId: string, vi: number) => (
                          <div key={vi} className="w-full aspect-video rounded-2xl overflow-hidden bg-black/5 relative card-shadow group border border-border/30">
                            <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${vId}?rel=0`} 
                              title="YouTube video player" 
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                              className="absolute inset-0 z-10"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                              <PlayCircle size={32} className="opacity-50" />
                              <span className="text-xs font-medium">{t.common.loading}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Sections dynamically generated from translation keys */}
                      {Object.keys(openTip.content).filter(k => k !== 'title' && k !== 'tipText' && k !== 'label').map((sectionKey, si) => {
                        const section = openTip.content[sectionKey as keyof typeof openTip.content] as any;
                        if (!section || !section.heading || !section.items) return null;
                        
                        return (
                          <div key={si} className="p-4 rounded-2xl bg-muted/40 border border-border/30">
                            <h3 className={`font-semibold text-foreground mb-3 text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {section.heading}
                            </h3>
                            <ul className="space-y-2">
                              {section.items.map((item: string, j: number) => (
                                <li key={j} className={`text-sm text-muted-foreground flex items-start gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                  {item.startsWith('→') ? (
                                    <span className={`text-primary font-medium ${isRTL ? 'mr-4' : 'ml-4'}`}>{item}</span>
                                  ) : (
                                    <>
                                      <span className="text-secondary flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                      <span className="flex-1 leading-relaxed">{item}</span>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                      
                      {openTip.content.tipText && (
                        <div className={`p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3 items-start ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                          <div className="text-xl">💡</div>
                          <div>
                            <p className="text-sm font-bold text-primary mb-1">{t.tips.tip}</p>
                            <p className="text-sm text-foreground leading-relaxed">{openTip.content.tipText}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 px-4 flex justify-center">
          <p className={`text-xs text-muted-foreground flex items-center gap-2 max-w-sm ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
            <span className="text-lg">⚕️</span>
            <span>{t.tips.disclaimer}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
