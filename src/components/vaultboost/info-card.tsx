import type { FC, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InfoCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  footerText: string;
}

export const InfoCard: FC<InfoCardProps> = ({ title, value, icon, footerText }) => {
  return (
    <Card className="shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-2">{footerText}</p>
      </CardContent>
    </Card>
  );
};
