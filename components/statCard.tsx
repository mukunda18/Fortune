interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div>
      <p>
        {title}
      </p>
      <p>
        <span>{icon}</span>
        {value}
      </p>
    </div>
  );
}
