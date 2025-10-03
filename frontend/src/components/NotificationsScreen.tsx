import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Bell, Calendar, Users, DollarSign, Check } from "lucide-react";

interface Notification {
  id: string;
  type: 'new_workout' | 'reminder' | 'payment' | 'cancellation';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationsScreenProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsScreen({ notifications, onMarkAsRead, onClearAll }: NotificationsScreenProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_workout':
        return <Calendar className="text-blue-500" size={20} />;
      case 'reminder':
        return <Bell className="text-yellow-500" size={20} />;
      case 'payment':
        return <DollarSign className="text-green-500" size={20} />;
      case 'cancellation':
        return <Users className="text-red-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'new_workout':
        return <Badge variant="secondary">Новая тренировка</Badge>;
      case 'reminder':
        return <Badge variant="outline">Напоминание</Badge>;
      case 'payment':
        return <Badge className="bg-green-100 text-green-800">Оплата</Badge>;
      case 'cancellation':
        return <Badge variant="destructive">Отмена</Badge>;
      default:
        return <Badge variant="secondary">Уведомление</Badge>;
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="page-title">Уведомления</h1>
          <p className="text-muted-foreground font-medium">
            {notifications.filter(n => !n.isRead).length} непрочитанных
          </p>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="border-primary/20 hover:bg-primary/10"
          >
            Очистить все
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`glass-card border-0 shadow-lg transition-all ${
              !notification.isRead 
                ? 'ring-2 ring-primary/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20' 
                : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    {getNotificationBadge(notification.type)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {notification.message}
              </p>
              {!notification.isRead && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 hover:from-green-500/20 hover:to-blue-500/20"
                >
                  <Check size={14} />
                  Отметить как прочитанное
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="glass-card border-0 shadow-lg text-center py-12">
          <CardContent>
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">У вас пока нет уведомлений</p>
            <p className="text-sm text-muted-foreground mt-2">
              Здесь будут появляться уведомления о новых тренировках и изменениях
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}