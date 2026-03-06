import React, { useState, useEffect } from 'react';
import { Plus, Bell, BarChart3, ListTodo, UserCircle } from 'lucide-react';
import { Reminder, ThemeMode, UserProfile } from './types';
import { StorageService } from './services/storage';
import { NotificationService } from './services/notification';
import { ReminderCard } from './components/ReminderCard';
import { AddReminderModal } from './components/AddReminderModal';
import { ThemeToggle } from './components/ThemeToggle';
import { ReportView } from './components/ReportView';
import { OnboardingScreen } from './components/OnboardingScreen';

const App: React.FC = () => {
  // Estados principais da aplicação
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'report'>('list');

  // Efeito de Inicialização 
  useEffect(() => {
    // Inicialização do Tema
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const sysPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (sysPrefersDark) {
      setTheme('dark');
    }

    // Carregar Utilizador
    const savedUser = StorageService.getUserProfile();
    setUser(savedUser);

    // Carregar dados salvos
    const loaded = StorageService.getReminders();
    setReminders(loaded);

    // Verificar permissões de notificação existentes
    if ('Notification' in window && Notification.permission === 'granted') {
      setHasNotificationPermission(true);
    }
  }, []);

  // Efeito para aplicação do Tema
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Verificador de Lembretes
  useEffect(() => {
    if (!user) return; // Não verificar se não tiver user

    const interval = setInterval(() => {
      const now = Date.now();
      reminders.forEach(reminder => {
        if (!reminder.isCompleted && reminder.targetTime <= now && reminder.targetTime > now - 60000) {
           NotificationService.sendNotification(`Olá ${user.name}, lembrete pendente!`, reminder.title);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders, user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const requestNotification = async () => {
    const granted = await NotificationService.requestPermission();
    setHasNotificationPermission(granted);
  };

  const handleUserSetup = (profile: UserProfile) => {
    StorageService.saveUserProfile(profile);
    setUser(profile);
  };

  const handleAddReminder = (title: string, description: string, targetTime: number) => {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      title,
      description,
      targetTime,
      createdAt: Date.now(),
      isCompleted: false,
    };
    
    const updated = StorageService.addReminder(newReminder);
    setReminders(updated);
    
    if (currentView === 'report') setCurrentView('list');

    const delay = targetTime - Date.now();
    if (delay > 0 && delay < 2147483647) {
      setTimeout(() => {
        const userName = user ? user.name : '';
        NotificationService.sendNotification(`Ei ${userName}, hora da tarefa!`, title);
      }, delay);
    }
  };

  const handleToggleComplete = (id: string) => {
    const updated = StorageService.toggleComplete(id);
    setReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = StorageService.deleteReminder(id);
    setReminders(updated);
  };

  // Se não houver utilizador configurado, mostrar Onboarding
  if (!user) {
    return (
      <div className="font-sans selection:bg-primary-200 dark:selection:bg-primary-900">
         <OnboardingScreen onComplete={handleUserSetup} />
      </div>
    );
  }

  // Listas derivadas
  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <div className="min-h-screen pb-24 font-sans selection:bg-primary-200 dark:selection:bg-primary-900">
      
      {/* Cabeçalho Fixo */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Área do Utilizador (Esquerda) */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('list')}>
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl shadow-sm">
              {user.avatar}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Olá,</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-none -mt-0.5">{user.name}</span>
            </div>
          </div>

          {/* Ações (Direita) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentView(prev => prev === 'list' ? 'report' : 'list')}
              className={`p-2 rounded-full transition-colors ${currentView === 'report' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              title={currentView === 'list' ? "Ver Relatórios" : "Ver Tarefas"}
            >
              {currentView === 'list' ? <BarChart3 className="w-5 h-5" /> : <ListTodo className="w-5 h-5" />}
            </button>
            
            {!hasNotificationPermission && (
              <button 
                onClick={requestNotification}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Activar Notificações"
              >
                <Bell className="w-5 h-5" />
              </button>
            )}
            <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        {currentView === 'report' ? (
          <ReportView reminders={reminders} />
        ) : (
          <>
            {/* Estado Vazio */}
            {reminders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bem-vindo, {user.name}!</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
                  Ainda não tens tarefas. Vamos criar o teu primeiro lembrete e acabar com a procrastinação?
                </p>
              </div>
            )}

            {/* Lista de Lembretes Ativos */}
            {activeReminders.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Activos ({activeReminders.length})
                </h2>
                <div className="space-y-2">
                  {activeReminders.sort((a,b) => a.targetTime - b.targetTime).map(reminder => (
                    <ReminderCard 
                      key={reminder.id} 
                      reminder={reminder} 
                      onToggle={handleToggleComplete}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Lembretes Concluídos */}
            {completedReminders.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Concluídos ({completedReminders.length})
                </h2>
                 <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                  {completedReminders.sort((a,b) => b.targetTime - a.targetTime).map(reminder => (
                    <ReminderCard 
                      key={reminder.id} 
                      reminder={reminder} 
                      onToggle={handleToggleComplete}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* FAB - Botão de Ação Flutuante (Apenas na vista de lista) */}
      {currentView === 'list' && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/40 hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Adicionar Lembrete"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Modal de Adição */}
      <AddReminderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddReminder}
      />

    </div>
  );
};

export default App;