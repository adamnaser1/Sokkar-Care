import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAppStore } from '@/store/useAppStore';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Bell, Ruler, Database, HelpCircle, LogOut, Trash2, Download, FileText, Printer, ChevronRight, Moon, Sun, Monitor, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const SettingsPage = ({ onBack, onNavigate }: Props) => {
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const notifications = useAppStore(s => s.notifications);
  const glucoseUnit = useAppStore(s => s.glucoseUnit);
  const weightUnit = useAppStore(s => s.weightUnit);
  const setNotifications = useAppStore(s => s.setNotifications);
  const setGlucoseUnit = useAppStore(s => s.setGlucoseUnit);
  const setWeightUnit = useAppStore(s => s.setWeightUnit);
  const resetData = useAppStore(s => s.resetData);
  const logout = useAppStore(s => s.logout);
  const { t, language, changeLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  const isRTL = language === 'ar';
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const exportCSV = () => {
    const header = 'Date,Heure,Valeur (mg/dL),Contexte,Notes\n';
    const rows = measurements.map(m => {
      const d = new Date(m.measuredAt);
      return `${d.toLocaleDateString(isRTL ? 'ar-TN' : 'fr-FR')},${d.toLocaleTimeString(isRTL ? 'ar-TN' : 'fr-FR')},${m.value},${m.context},${m.notes}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sokkar-care-journal.csv';
    a.click();
    toast.success(t.settings.csvDownloaded);
  };

  const exportJSON = () => {
    const data = JSON.stringify({ profile, measurements, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sokkar-care-backup.json';
    a.click();
    toast.success(t.settings.backupDownloaded);
  };

  const menuSections = [
    {
      id: 'profile',
      icon: User,
      label: t.settings.myProfile,
      sub: profile ? `${profile.firstName} ${profile.lastName}` : t.settings.notConfigured,
    },
    {
      id: 'notifications',
      icon: Bell,
      label: t.settings.notifications,
      sub: t.settings.remindersAlerts,
    },
    {
      id: 'appearance_units',
      icon: Ruler,
      label: t.settings.appearance + ' & ' + t.settings.units,
      sub: `${glucoseUnit} · ${weightUnit} · ${theme === 'dark' ? t.settings.themeDark : theme === 'light' ? t.settings.themeLight : t.settings.themeSystem}`,
    },
    {
      id: 'data',
      icon: Database,
      label: t.settings.data,
      sub: t.settings.exportBackup,
    },
    {
      id: 'support',
      icon: HelpCircle,
      label: t.settings.helpSupport,
      sub: t.settings.faqContact,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
        </motion.div>

        {/* Profile Card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('profile')}
            className={`p-5 rounded-2xl bg-card card-shadow-elevated mb-6 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all border border-primary/5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          >
            <div className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center overflow-hidden bg-muted">
              {profile.avatarData ? (
                <img src={profile.avatarData} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="text-primary" size={24} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">
                {profile.firstName} {profile.lastName?.charAt(0)}.
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.diabetesType === 'type1' ? t.profileForm.type1 : profile.diabetesType === 'type2' ? t.profileForm.type2 : t.profileForm.gestational}
              </p>
            </div>
          </motion.div>
        )}

        {/* Settings Menu */}
        <div className="flex flex-col gap-2 mb-6">
          {menuSections.map((section, i) => (
            <motion.div key={section.id}>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`w-full p-4 rounded-2xl bg-card card-shadow flex items-center gap-4 hover:shadow-md transition-all ${
                  activeSection === section.id ? 'ring-2 ring-primary/20' : ''
                } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{section.label}</p>
                  <p className="text-xs text-muted-foreground">{section.sub}</p>
                </div>
                <motion.div
                  animate={{ rotate: activeSection === section.id ? (isRTL ? -90 : 90) : (isRTL ? 180 : 0) }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pt-3">
                      {section.id === 'profile' && profile && (
                        <div className="p-4 rounded-2xl bg-muted/40 flex flex-col gap-3">
                          {[
                            { label: t.settings.fullName, value: `${profile.firstName} ${profile.lastName}` },
                            { label: t.settings.diabetesType, value: profile.diabetesType === 'type1' ? t.profileForm.type1 : profile.diabetesType === 'type2' ? t.profileForm.type2 : t.profileForm.gestational },
                            { label: t.settings.targetGlucose, value: `${profile.targetGlucose} ${glucoseUnit}` },
                            { label: t.settings.sensitivityFactor, value: `${profile.sensitivityFactor}` },
                          ].map((item, j) => (
                            <div key={j} className={`flex justify-between items-center py-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-sm text-muted-foreground">{item.label}</span>
                              <span className="font-medium text-foreground text-sm">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.id === 'notifications' && (
                        <div className={`p-4 rounded-2xl bg-muted/40 flex flex-col gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between h-12 rounded-xl border-primary text-primary"
                            onClick={() => {
                              if ('Notification' in window) {
                                Notification.requestPermission().then(perm => {
                                  if (perm === 'granted') {
                                    toast.success(isRTL ? 'تم تفعيل الإشعارات' : 'Notifications activées');
                                    setTimeout(() => {
                                      new Notification('Sokkar Care', { 
                                        body: isRTL ? 'الإشعارات تعمل بشكل جيد!' : 'Les alertes fonctionnent !', 
                                        icon: '/icon-192x192.png' 
                                      });
                                    }, 500);
                                  } else {
                                    toast.error(isRTL ? 'تم رفض الإشعارات' : 'Notifications refusées');
                                  }
                                });
                              } else {
                                toast.error(isRTL ? 'متصفحك لا يدعم الإشعارات' : 'Non supporté par le navigateur');
                              }
                            }}
                          >
                            <span className="flex items-center gap-2"><Bell size={16}/> {isRTL ? 'تفعيل وتجربة الإشعارات' : 'Activer et tester'}</span>
                            <ChevronRight size={16} />
                          </Button>

                          <div className="space-y-4 border-t border-border/50 pt-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Label className="text-sm font-semibold">{t.settings.measureReminders}</Label>
                              <Switch checked={notifications.measureReminders} onCheckedChange={v => setNotifications({ measureReminders: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                            </div>
                            {notifications.measureReminders && (
                              <div className="space-y-3 bg-card p-3 rounded-xl border border-border/50">
                                <Label className="text-xs text-muted-foreground">{isRTL ? 'أوقات التذكير' : 'Heures de rappel'}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  {notifications.measureTimes.map((time, idx) => (
                                    <div key={idx} className="relative">
                                      <Input type="time" value={time} onChange={(e) => {
                                        const newTimes = [...notifications.measureTimes];
                                        newTimes[idx] = e.target.value;
                                        setNotifications({ measureTimes: newTimes });
                                      }} className={`h-10 text-xs rounded-lg ${isRTL ? 'pl-8 text-right' : 'pr-8'}`} />
                                      <button onClick={() => {
                                        setNotifications({ measureTimes: notifications.measureTimes.filter((_, i) => i !== idx) });
                                      }} className={`absolute top-2.5 text-muted-foreground hover:text-destructive ${isRTL ? 'left-2' : 'right-2'}`}>
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  {notifications.measureTimes.length < 6 && (
                                    <Button variant="outline" size="sm" className="h-10 border-dashed" onClick={() => {
                                      setNotifications({ measureTimes: [...notifications.measureTimes, '12:00'] });
                                    }}>{isRTL ? '+ إضافة' : '+ Ajouter'}</Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4 border-t border-border/50 pt-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Label className="text-sm font-semibold">{t.settings.alertsHypoHyper}</Label>
                              <Switch checked={notifications.alertsEnabled} onCheckedChange={v => setNotifications({ alertsEnabled: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                            </div>
                            {notifications.alertsEnabled && (
                              <div className="grid grid-cols-2 gap-4 bg-card p-3 rounded-xl border border-border/50">
                                <div>
                                  <Label className="text-xs text-destructive mb-1 block">Hypo (&lt;)</Label>
                                  <Input type="number" value={notifications.hypoThreshold} onChange={e => setNotifications({ hypoThreshold: parseInt(e.target.value) || 70 })} className={`h-10 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} />
                                </div>
                                <div>
                                  <Label className="text-xs text-warning mb-1 block">Hyper (&gt;)</Label>
                                  <Input type="number" value={notifications.hyperThreshold} onChange={e => setNotifications({ hyperThreshold: parseInt(e.target.value) || 250 })} className={`h-10 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4 border-t border-border/50 pt-4">
                             <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Label className="text-sm font-semibold">{t.settings.injectionReminders}</Label>
                              <Switch checked={notifications.injectionReminders} onCheckedChange={v => setNotifications({ injectionReminders: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                            </div>
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Label className="text-sm font-semibold">{isRTL ? 'تذكير فحص التراكمي' : 'Rappel HbA1c (Tous les 3 mois)'}</Label>
                              <Switch checked={notifications.hba1cReminders} onCheckedChange={v => setNotifications({ hba1cReminders: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                            </div>
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Label className="text-sm font-semibold">{t.settings.newsAndTips}</Label>
                              <Switch checked={notifications.weeklyNews} onCheckedChange={v => setNotifications({ weeklyNews: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'appearance_units' && (
                        <div className={`p-4 rounded-2xl bg-muted/40 flex flex-col gap-5 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {/* Theme Selection */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">{t.settings.theme}</Label>
                            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {[
                                { id: 'light', icon: Sun, label: t.settings.themeLight },
                                { id: 'dark', icon: Moon, label: t.settings.themeDark },
                                { id: 'system', icon: Monitor, label: t.settings.themeSystem },
                              ].map(tItem => (
                                <button
                                  key={tItem.id}
                                  onClick={() => setTheme(tItem.id)}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                                    theme === tItem.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-muted-foreground border border-border/50'
                                  }`}
                                >
                                  <tItem.icon size={16} />
                                  {tItem.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Language Selection */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">{t.settings.language}</Label>
                            <Select value={language} onValueChange={(v: 'fr'|'ar') => changeLang(v as any)} dir={isRTL ? 'rtl' : 'ltr'}>
                              <SelectTrigger className="rounded-xl w-full bg-card">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="ar">العربية (Arabic)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Value Units */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">{t.settings.glucoseUnit}</Label>
                            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {(['mg/dL', 'mmol/L'] as const).map(u => (
                                <button
                                  key={u}
                                  onClick={() => setGlucoseUnit(u)}
                                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                                    glucoseUnit === u ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-muted-foreground border border-border/50'
                                  }`}
                                >
                                  {u}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">{t.settings.weightUnit}</Label>
                            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {(['kg', 'lb'] as const).map(u => (
                                <button
                                  key={u}
                                  onClick={() => setWeightUnit(u)}
                                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                                    weightUnit === u ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-muted-foreground border border-border/50'
                                  }`}
                                >
                                  {u}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'data' && (
                        <div className="flex flex-col gap-2">
                          {[
                            { icon: Download, label: t.settings.exportCSV, action: exportCSV },
                            { icon: FileText, label: t.settings.backupJSON, action: exportJSON },
                            { icon: Printer, label: t.settings.print, action: () => window.print() },
                          ].map((item, j) => (
                            <button
                              key={j}
                              onClick={item.action}
                              className={`flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-sm text-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <item.icon size={16} className="text-primary" />
                              {item.label}
                            </button>
                          ))}
                          <p className={`text-[11px] text-muted-foreground mt-1 mx-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.settings.localData}
                          </p>
                        </div>
                      )}

                      {section.id === 'support' && (
                        <div className={`p-4 rounded-2xl bg-muted/40 flex flex-col gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <button onClick={() => onNavigate('faq')} className={`text-sm text-primary hover:underline font-medium p-2 outline-none ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.settings.faq}
                          </button>
                          <button onClick={() => onNavigate('support')} className={`text-sm text-primary hover:underline font-medium p-2 outline-none ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.settings.contactSupport}
                          </button>
                          <button onClick={() => onNavigate('privacy')} className={`text-sm text-primary hover:underline font-medium p-2 outline-none ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.settings.privacy}
                          </button>
                          <div className="text-center text-xs text-muted-foreground mt-2 pt-3 border-t border-border/50">
                            <p>{t.settings.version}</p>
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

        {/* Danger Zone */}
        <div className="flex flex-col gap-2 mb-8">
          <Button 
            variant="outline" 
            onClick={() => {
              if (confirm(t.settings && t.settings.logout ? t.settings.logout + '?' : 'Logout?')) {
                logout();
              }
            }}
            className={`w-full text-muted-foreground border-border hover:bg-muted rounded-2xl h-12 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <LogOut size={16} /> {t.settings.logout}
          </Button>
          <Button
            variant="outline"
            className={`w-full text-destructive border-destructive/20 hover:bg-destructive/5 rounded-2xl h-12 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => {
              if (confirm(t.settings.deleteConfirm)) {
                resetData();
                toast.success(t.settings.dataDeleted);
              }
            }}
          >
            <Trash2 size={16} /> {t.settings.deleteAccount}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
