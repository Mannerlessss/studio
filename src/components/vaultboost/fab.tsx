import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const Fab: FC = () => {
  return (
    <Button
      size="icon"
      className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary shadow-lg"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};
