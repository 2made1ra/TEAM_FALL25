import { Dumbbell, Calendar, Plus, User } from "lucide-react";
import { Button } from "@src/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'workouts', label: 'Тренировки', icon: Dumbbell },
    { id: 'my-schedule', label: 'Мое расписание', icon: Calendar },
    { id: 'create', label: 'Создать', icon: Plus },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-card border-t-0 px-4 py-3 shadow-2xl">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-primary border border-primary/20 shadow-md' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}