import React from 'react';
import { Check, Trash2, Clock, Calendar } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// Componente que renderiza um único cartão de lembrete
export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggle, onDelete }) => {
  // Verifica se o lembrete está atrasado (não completado e tempo já passou)
  const isPastDue = !reminder.isCompleted && Date.now() > reminder.targetTime;
  
  // Formata a data para o padrão Angolano/Europeu (dia/mês hora:minuto)
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-AO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  // Calcula e formata o tempo restante de forma amigável
  const getTimeRemaining = (timestamp: number) => {
    const diff = timestamp - Date.now();
    if (diff < 0) return 'Atrasado';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 24) return `${Math.floor(hours / 24)} dias restantes`;
    if (hours > 0) return `${hours}h ${minutes % 60}m restantes`;
    return `${minutes}m restantes`;
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl p-4 mb-3 shadow-sm border
      transition-all duration-300 transform
      ${reminder.isCompleted 
        ? 'bg-gray-100 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 opacity-75' 
        : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
      }
      /* Lógica de cor da borda lateral: Vermelho se atrasado, Verde se completo, Azul padrão */
      ${isPastDue ? 'border-l-4 border-l-red-500' : reminder.isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-primary-500'}
    `}>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className={`font-semibold text-lg ${reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {reminder.title}
          </h3>
          {reminder.description && (
            <p className={`text-sm mt-1 ${reminder.isCompleted ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {reminder.description}
            </p>
          )}
          
          {/* Rodapé do cartão com Data e Tempo Restante */}
          <div className="flex items-center gap-4 mt-3 text-xs font-medium">
            <div className={`flex items-center gap-1 ${isPastDue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(reminder.targetTime)}</span>
            </div>
            {!reminder.isCompleted && (
               <div className={`flex items-center gap-1 ${isPastDue ? 'text-red-600 font-bold' : 'text-primary-600 dark:text-primary-400'}`}>
               <Clock className="w-3 h-3" />
               <span>{getTimeRemaining(reminder.targetTime)}</span>
             </div>
            )}
          </div>
        </div>

        {/* Botões de Ação: Concluir e Excluir */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onToggle(reminder.id)}
            className={`p-2 rounded-full transition-colors ${
              reminder.isCompleted 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-green-900/30 dark:hover:text-green-400'
            }`}
            title={reminder.isCompleted ? "Reabrir" : "Concluir"}
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};