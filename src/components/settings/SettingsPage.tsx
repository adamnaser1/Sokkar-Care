import { useState } from 'react';
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
  const setProfile = useAppStore(s => s.setProfile);
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
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Paramètres</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && profile && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nom</span>
                <span className="font-medium text-foreground">{profile.firstName} {profile.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Type de diabète</span>
                <span className="font-medium text-foreground">
                  {profile.diabetesType === 'type1' ? 'Type 1' : profile.diabetesType === 'type2' ? 'Type 2' : profile.diabetesType}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Glycémie cible</span>
                <span className="font-medium text-foreground">{profile.targetGlucose} mg/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Facteur de sensibilité</span>
                <span className="font-medium text-foreground">{profile.sensitivityFactor}</span>
              </div>
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
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Rappels de mesure</p>
                  <p className="text-xs text-muted-foreground">4x/jour</p>
                </div>
                <Switch
                  checked={notifications.measureReminders}
                  onCheckedChange={v => setNotifications({ measureReminders: v })}
                />
              </div>
              {notifications.measureReminders && (
                <p className="text-xs text-muted-foreground pl-2">
                  Heures : {notifications.measureTimes.join(', ')}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Rappels d'injection</p>
                  <p className="text-xs text-muted-foreground">2x/jour</p>
                </div>
                <Switch
                  checked={notifications.injectionReminders}
                  onCheckedChange={v => setNotifications({ injectionReminders: v })}
                />
              </div>
              {notifications.injectionReminders && (
                <p className="text-xs text-muted-foreground pl-2">
                  Heures : {notifications.injectionTimes.join(', ')}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Alertes hypo/hyper</p>
                  <p className="text-xs text-muted-foreground">
                    Seuils : &lt; {notifications.hypoThreshold} et &gt; {notifications.hyperThreshold} mg/dL
                  </p>
                </div>
                <Switch
                  checked={notifications.alertsEnabled}
                  onCheckedChange={v => setNotifications({ alertsEnabled: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">News & conseils</p>
                  <p className="text-xs text-muted-foreground">Email hebdomadaire</p>
                </div>
                <Switch
                  checked={notifications.weeklyNews}
                  onCheckedChange={v => setNotifications({ weeklyNews: v })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-4">
              <div>
                <Label className="text-sm font-medium">Glycémie</Label>
                <div className="flex gap-2 mt-2">
                  {(['mg/dL', 'mmol/L'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => setGlucoseUnit(u)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        glucoseUnit === u ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Poids</Label>
                <div className="flex gap-2 mt-2">
                  {(['kg', 'lb'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => setWeightUnit(u)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        weightUnit === u ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {u}
                    </button>
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
          </div>
        )}

        {activeTab === 'data' && (
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={exportCSV} className="justify-start">
              <Download size={16} className="mr-2" /> Exporter mes données (CSV)
            </Button>
            <Button variant="outline" onClick={exportJSON} className="justify-start">
              <FileText size={16} className="mr-2" /> Télécharger ma sauvegarde (JSON)
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="justify-start">
              <Printer size={16} className="mr-2" /> Imprimer mon journal
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Vos données sont stockées localement sur votre appareil.
            </p>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card card-shadow">
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
      </div>
    </div>
  );
};

export default SettingsPage;
