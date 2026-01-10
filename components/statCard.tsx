interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div style={{ borderLeft: `4px solid ${color}`, padding: '8px' }}>
      <strong>{icon} {title}</strong>
      <span>{value}</span>
    </div>
  );
}
