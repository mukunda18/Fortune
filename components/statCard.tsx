interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
    orange: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700',
  };

  return (
    <div className={`bg-linear-to-br ${colorClasses[color]} rounded-lg p-4 border`}>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        <span className="mr-2">{icon}</span>
        {value}
      </p>
    </div>
  );
}
