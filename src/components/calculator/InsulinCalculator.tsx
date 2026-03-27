import { useState } from 'react';
import { useAppStore, CalculatorEntry } from '@/store/useAppStore';
import { calculateInsulinDose } from '@/lib/glucose';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, History, AlertTriangle } from 'lucide-react';

const InsulinCalculator = () => {
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
        <h1 className="text-2xl font-bold text-primary mb-4">Calculateur de Dose</h1>

        <div className="p-5 rounded-xl bg-card card-shadow mb-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label>Glycémie mesurée (mg/dL)</Label>
              <Input
                type="number"
                value={measured}
                onChange={e => { setMeasured(e.target.value); setResult(null); }}
                placeholder="Ex: 180"
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <Label>Glycémie cible (mg/dL)</Label>
              <Input
                type="number"
                value={target}
                onChange={e => { setTarget(e.target.value); setResult(null); }}
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <Label>Facteur de sensibilité</Label>
              <Input
                type="number"
                value={sensitivity}
                onChange={e => { setSensitivity(e.target.value); setResult(null); }}
                placeholder="Ex: 50"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Généralement : 1500 ÷ (total unités insuline/jour)
              </p>
            </div>
            <Button size="lg" onClick={calculate} disabled={!measured || !target || !sensitivity}>
              <Calculator size={18} className="mr-2" /> Calculer
            </Button>
          </div>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="p-5 rounded-xl bg-secondary/10 border border-secondary/20 mb-4">
            <p className="text-sm text-muted-foreground mb-1">📊 Dose corrective recommandée</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-secondary">{result}</span>
              <span className="text-lg text-muted-foreground">unités d'insuline rapide</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-secondary transition-all"
                style={{ width: `${Math.min(100, (result / 10) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Formule : ({measured} - {target}) ÷ {sensitivity} = {result} U
            </p>
          </div>
        )}

        {/* Warning */}
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-4">
          <div className="flex gap-2">
            <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-foreground">À vérifier avec votre médecin</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ce calcul est indicatif et ne remplace pas le conseil médical professionnel.
                Adaptez toujours selon les recommandations de votre équipe soignante.
              </p>
            </div>
          </div>
        </div>

        {/* History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-secondary font-medium mb-3"
        >
          <History size={16} />
          Historique des calculs ({calculatorHistory.length})
        </button>

        {showHistory && calculatorHistory.length > 0 && (
          <div className="flex flex-col gap-2">
            {calculatorHistory.slice(0, 10).map(entry => (
              <div key={entry.id} className="p-3 rounded-lg bg-card card-shadow flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">
                    {entry.measured} → {entry.target} mg/dL (FS: {entry.sensitivity})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.calculatedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span className="text-lg font-bold text-secondary">{entry.result} U</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsulinCalculator;
