import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { QuickTimeOption } from '../types';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, desc: string, targetTime: number) => void;
}

// Opções de tempo rápido para facilitar a usabilidade
const QUICK_TIMES: QuickTimeOption[] = [
  { label: '+30 min', minutes: 30 },
  { label: '+1 hora', minutes: 60 },
  { label: '+2 horas', minutes: 120 },
  { label: 'Amanhã', minutes: 24 * 60 },
];

export const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuickTime, setSelectedQuickTime] = useState<number | null>(null);
  const [customTime, setCustomTime] = useState('');

  // Reseta o formulário toda vez que o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setSelectedQuickTime(null);
      setCustomTime('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetTimestamp = Date.now();

    // Prioridade: Data Customizada > Tempo Rápido > Padrão (1 hora)
    if (customTime) {
      targetTimestamp = new Date(customTime).getTime();
    } else if (selectedQuickTime) {
      targetTimestamp = Date.now() + selectedQuickTime * 60 * 1000;
    } else {
      // Padrão para 1 hora se nada for selecionado
      targetTimestamp = Date.now() + 60 * 60 * 1000;
    }

    onAdd(title, description, targetTimestamp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Novo Lembrete</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Campo Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              autoFocus
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes..."
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Seleção de Tempo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Quando?
            </label>
            
            {/* Botões de Tempo Rápido (Chips) */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_TIMES.map((qt) => (
                <button
                  key={qt.label}
                  type="button"
                  onClick={() => {
                    setSelectedQuickTime(qt.minutes);
                    setCustomTime('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedQuickTime === qt.minutes
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  {qt.label}
                </button>
              ))}
            </div>

            {/* Entrada de Data/Hora Personalizada */}
            <input
              type="datetime-local"
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value);
                setSelectedQuickTime(null);
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Botões de Ação do Rodapé */}
          <div className="pt-2 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/30"
            >
              Salvar Lembrete
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};