import React from 'react';
import { Reminder } from '../types';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ReportViewProps {
  reminders: Reminder[];
}

export const ReportView: React.FC<ReportViewProps> = ({ reminders }) => {
  const total = reminders.length;
  const completed = reminders.filter(r => r.isCompleted).length;
  
  // Tarefas actualmente em atraso (Não completas e prazo já passou)
  const currentOverdue = reminders.filter(r => !r.isCompleted && Date.now() > r.targetTime).length;
  
  // Tarefas completadas com atraso (Concluídas, mas a data de conclusão foi depois do prazo)
  const completedLate = reminders.filter(r => 
    r.isCompleted && r.completedAt && r.completedAt > r.targetTime
  ).length;

  // Total de "Procrastinação" = Tarefas que estão atrasadas + Tarefas feitas fora do prazo
  const totalProcrastinated = currentOverdue + completedLate;
  
  // Taxa de conclusão
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Taxa de Pontualidade (Tarefas feitas no prazo / Total de tarefas feitas)
  const onTimeCount = completed - completedLate;
  const punctualityRate = completed > 0 ? Math.round((onTimeCount / completed) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          Relatório de Produtividade
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Card Total */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800">
            <span className="text-sm text-primary-600 dark:text-primary-300 font-medium">Total de Tarefas</span>
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-100">{total}</div>
          </div>
          
          {/* Card Concluídas */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
            <span className="text-sm text-green-600 dark:text-green-300 font-medium">Concluídas</span>
            <div className="text-3xl font-bold text-green-700 dark:text-green-100">{completed}</div>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
            <span className="font-bold text-gray-900 dark:text-white">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Seção de Análise de Procrastinação */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Análise de Atrasos
        </h3>

        <div className="space-y-4">
            {/* Indicador de Pontualidade */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Pontualidade (Entregue no prazo)</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{punctualityRate}%</span>
            </div>

            {/* Indicador de Tarefas Atrasadas (Pendentes) */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-red-800 dark:text-red-300">Em Atraso (Agora)</span>
                        <span className="text-xs text-red-600 dark:text-red-400">Tarefas que deviam estar prontas</span>
                    </div>
                </div>
                <span className="font-bold text-red-700 dark:text-red-200 text-lg">{currentOverdue}</span>
            </div>

            {/* Indicador de Tarefas Feitas com Atraso */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Concluídas com Atraso</span>
                        <span className="text-xs text-orange-600 dark:text-orange-400">Feitas depois do prazo</span>
                    </div>
                </div>
                <span className="font-bold text-orange-700 dark:text-orange-200 text-lg">{completedLate}</span>
            </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-center text-gray-500 dark:text-gray-400 italic">
            {totalProcrastinated === 0 && completed > 0 
                ? "Parabéns! Estás com uma disciplina impecável." 
                : totalProcrastinated > 2 
                    ? "Atenção: A procrastinação está a acumular-se. Tenta dividir as tarefas em passos menores."
                    : "Continua a focar-te nos prazos!"}
        </div>
      </div>

    </div>
  );
};