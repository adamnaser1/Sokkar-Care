import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { calculateInsulinDose } from '@/lib/glucose';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, History, AlertTriangle, ArrowLeft, Activity } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  onBack?: () => void;
  onNavigate: (view: string) => void;
}

const InsulinCalculator = ({ onBack, onNavigate }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const profile = useAppStore(s => s.profile);
  const calculatorHistory = useAppStore(s => s.calculatorHistory);
  const addCalculatorEntry = useAppStore(s => s.addCalculatorEntry);

  const [measured, setMeasured] = useState('');
  const [target, setTarget] = useState(String(profile?.targetGlucose || 120));
  const [sensitivity, setSensitivity] = useState(String(profile?.sensitivityFactor || 50));
  const [result, setResult] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const calculate = () => {
    const m = parseFloat(measured);
    const t = parseFloat(target);
    const s = parseFloat(sensitivity);
    if (!m || !t || !s) return;
    const dose = calculateInsulinDose(m, t, s);
    setResult(dose);
    addCalculatorEntry({
      id: crypto.randomUUID(),
      measured: m,
      target: t,
      sensitivity: s,
      result: dose,
      calculatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted text-primary">
                <ArrowLeft size={22} />
              </motion.button>
            )}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {t.calculator.doseTitle}
            </motion.h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center overflow-hidden bg-muted"
          >
            {profile?.avatarData ? (
              <img src={profile.avatarData} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Activity className="text-primary" size={20} />
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-card card-shadow mb-4"
        >
          <div className="flex flex-col gap-4">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <Label>{t.calculator.measuredGlucoseLabel}</Label>
              <Input
                type="number"
                value={measured}
                onChange={e => { setMeasured(e.target.value); setResult(null); }}
                placeholder="Ex: 180"
                className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <Label>{t.calculator.targetGlucoseLabel}</Label>
              <Input
                type="number"
                value={target}
                onChange={e => { setTarget(e.target.value); setResult(null); }}
                className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <Label>{t.calculator.sensitivityFactorLabel}</Label>
              <Input
                type="number"
                value={sensitivity}
                onChange={e => { setSensitivity(e.target.value); setResult(null); }}
                placeholder="Ex: 50"
                className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t.calculator.sensitivityFactorDesc}
              </p>
            </div>
            <Button size="lg" onClick={calculate} disabled={!measured || !target || !sensitivity} className={isRTL ? 'flex-row-reverse' : ''}>
              <Calculator size={18} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.calculator.calculate}
            </Button>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`p-5 rounded-2xl bg-secondary/10 border border-secondary/20 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <p className="text-sm text-muted-foreground mb-1">{t.calculator.recommendedDose}</p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="text-4xl font-bold text-secondary"
                >
                  {result}
                </motion.span>
                <span className="text-lg text-muted-foreground">{t.calculator.insulinUnits}</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (result / 10) * 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t.calculator.formula} : ({measured} - {target}) ÷ {sensitivity} = {result} U
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-warning/10 border border-warning/20 mb-4"
        >
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-foreground">{t.calculator.medicalCheckTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t.calculator.medicalCheckDesc}
              </p>
            </div>
          </div>
        </motion.div>

        {/* History Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-2 text-sm text-secondary font-medium mb-3 ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}
        >
          <History size={16} />
          {t.calculator.calculationHistory} ({calculatorHistory.length})
        </motion.button>

        <AnimatePresence>
          {showHistory && calculatorHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden flex flex-col gap-2"
            >
              {calculatorHistory.slice(0, 10).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-3 rounded-xl bg-card card-shadow flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm text-foreground">
                      {entry.measured} → {entry.target} mg/dL ({t.calculator.sensitivityFactorLabel}: {entry.sensitivity})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.calculatedAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'fr-FR')}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-secondary">{entry.result} U</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InsulinCalculator;
