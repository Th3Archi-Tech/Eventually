// Interface que define a estrutura de um Lembrete
export interface Reminder {
  id: string;          // Identificador único (UUID)
  title: string;       // Título do lembrete
  description: string; // Descrição detalhada
  targetTime: number;  // Horário alvo em milissegundos (timestamp)
  createdAt: number;   // Data de criação em milissegundos
  isCompleted: boolean;// Estado de conclusão (true/false)
  completedAt?: number;// Data real da conclusão (para relatórios de atraso)
}

// Interface para o Perfil do Utilizador
export interface UserProfile {
  name: string;
  avatar: string; // Pode ser um emoji ou URL
}

// Tipo para definir o tema da aplicação
export type ThemeMode = 'light' | 'dark';

// Interface para as opções de tempo rápido no modal
export interface QuickTimeOption {
  label: string;   // Texto exibido (ex: "+30 min")
  minutes: number; // Quantidade de minutos a adicionar
}