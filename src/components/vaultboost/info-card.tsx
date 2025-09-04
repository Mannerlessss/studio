import type { FC, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  isStatus?: boolean;
}

export const InfoCard: FC<InfoCardProps> = ({ title, value, icon, isStatus = false }) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        {isStatus ? (
          <Badge variant="outline" className="font-semibold">{value}</Badge>
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};
