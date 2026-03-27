import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Bell, Ruler, Database, HelpCircle, LogOut, Trash2, Download, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: Props) => {
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const notifications = useAppStore(s => s.notifications);
  const glucoseUnit = useAppStore(s => s.glucoseUnit);
  const weightUnit = useAppStore(s => s.weightUnit);
  const setNotifications = useAppStore(s => s.setNotifications);
  const setGlucoseUnit = useAppStore(s => s.setGlucoseUnit);
  const setWeightUnit = useAppStore(s => s.setWeightUnit);
  const resetData = useAppStore(s => s.resetData);

  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'units', icon: Ruler, label: 'Unités' },
    { id: 'data', icon: Database, label: 'Données' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ];

  const exportCSV = () => {
    const header = 'Date,Heure,Valeur (mg/dL),Contexte,Notes\n';
    const rows = measurements.map(m => {
      const d = new Date(m.measuredAt);
      return `${d.toLocaleDateString('fr-FR')},${d.toLocaleTimeString('fr-FR')},${m.value},${m.context},${m.notes}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sokkar-care-journal.csv';
    a.click();
    toast.success('Export CSV téléchargé !');
  };

  const exportJSON = () => {
    const data = JSON.stringify({ profile, measurements, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sokkar-care-backup.json';
    a.click();
    toast.success('Sauvegarde téléchargée !');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <h1 className="text-2xl font-bold text-primary">Paramètres</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute inset-0 bg-secondary rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <tab.icon size={14} />
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && profile && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-card card-shadow flex flex-col gap-3">
                  {[
                    { label: 'Nom', value: `${profile.firstName} ${profile.lastName}` },
                    { label: 'Type de diabète', value: profile.diabetesType === 'type1' ? 'Type 1' : profile.diabetesType === 'type2' ? 'Type 2' : profile.diabetesType },
                    { label: 'Glycémie cible', value: `${profile.targetGlucose} mg/dL` },
                    { label: 'Facteur de sensibilité', value: `${profile.sensitivityFactor}` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                  <LogOut size={16} className="mr-2" /> Déconnexion
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => {
                    if (confirm('Supprimer toutes vos données ? Cette action est irréversible.')) {
                      resetData();
                      toast.success('Données supprimées');
                    }
                  }}
                >
                  <Trash2 size={16} className="mr-2" /> Supprimer mes données
                </Button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-4 rounded-2xl bg-card card-shadow flex flex-col gap-4">
                {[
                  { label: 'Rappels de mesure', sub: '4x/jour', checked: notifications.measureReminders, key: 'measureReminders', extra: notifications.measureReminders ? `Heures : ${notifications.measureTimes.join(', ')}` : null },
                  { label: "Rappels d'injection", sub: '2x/jour', checked: notifications.injectionReminders, key: 'injectionReminders', extra: notifications.injectionReminders ? `Heures : ${notifications.injectionTimes.join(', ')}` : null },
                  { label: 'Alertes hypo/hyper', sub: `< ${notifications.hypoThreshold} et > ${notifications.hyperThreshold} mg/dL`, checked: notifications.alertsEnabled, key: 'alertsEnabled', extra: null },
                  { label: 'News & conseils', sub: 'Email hebdomadaire', checked: notifications.weeklyNews, key: 'weeklyNews', extra: null },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <Switch
                        checked={item.checked}
                        onCheckedChange={v => setNotifications({ [item.key]: v })}
                      />
                    </div>
                    {item.extra && <p className="text-xs text-muted-foreground pl-2 mt-1">{item.extra}</p>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'units' && (
              <div className="p-4 rounded-2xl bg-card card-shadow flex flex-col gap-4">
                <div>
                  <Label className="text-sm font-medium">Glycémie</Label>
                  <div className="flex gap-2 mt-2">
                    {(['mg/dL', 'mmol/L'] as const).map(u => (
                      <motion.button
                        key={u}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGlucoseUnit(u)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          glucoseUnit === u ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {u}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Poids</Label>
                  <div className="flex gap-2 mt-2">
                    {(['kg', 'lb'] as const).map(u => (
                      <motion.button
                        key={u}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setWeightUnit(u)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          weightUnit === u ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {u}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Langue</Label>
                  <Select value={profile?.language || 'fr'} onValueChange={() => {}}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="flex flex-col gap-3">
                {[
                  { icon: Download, label: 'Exporter mes données (CSV)', action: exportCSV },
                  { icon: FileText, label: 'Télécharger ma sauvegarde (JSON)', action: exportJSON },
                  { icon: Printer, label: 'Imprimer mon journal', action: () => window.print() },
                ].map((item, i) => (
                  <motion.div key={i} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" onClick={item.action} className="w-full justify-start">
                      <item.icon size={16} className="mr-2" /> {item.label}
                    </Button>
                  </motion.div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  Vos données sont stockées localement sur votre appareil.
                </p>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-card card-shadow">
                  <p className="font-medium text-foreground mb-3">📞 Besoin d'aide ?</p>
                  <div className="flex flex-col gap-2">
                    <button className="text-left text-sm text-secondary hover:underline">Consulter la FAQ</button>
                    <button className="text-left text-sm text-secondary hover:underline">Contacter le support</button>
                    <button className="text-left text-sm text-secondary hover:underline">Politique de confidentialité</button>
                  </div>
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  <p>Sokkar Care v1.0.0 (MVP)</p>
                  <p className="mt-1">⚕️ Cette application ne remplace pas le conseil médical.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPage;
