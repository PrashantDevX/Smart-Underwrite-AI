import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'red';
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm font-medium mt-2',
                trendUp ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
