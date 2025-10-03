import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Badge } from "@src/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";

interface WorkoutEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  location: string;
  participants: number;
  maxParticipants: number;
  price: number;
  instructor: string;
}

interface ScheduleScreenProps {
  events: WorkoutEvent[];
  onJoinEvent: (eventId: string) => void;
}

export function WorkoutsScreen({ events, onJoinEvent }: ScheduleScreenProps) {
  const today = new Date().toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="page-title">Все тренировки</h1>
        <p className="text-muted-foreground capitalize font-medium">{today}</p>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="glass-card overflow-hidden border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-card-foreground">{event.title}</CardTitle>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0"
                >
                  {event.price}₽
                </Badge>
              </div>
              <p className="text-muted-foreground">Инструктор: {event.instructor}</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span>{event.time} ({event.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={16} className="text-primary" />
                  <span>{event.participants}/{event.maxParticipants} участников</span>
                </div>
                
                <Button 
                  size="sm"
                  onClick={() => onJoinEvent(event.id)}
                  disabled={event.participants >= event.maxParticipants}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-md"
                >
                  {event.participants >= event.maxParticipants ? 'Места закончились' : 'Записаться'}
                </Button>
              </div>

              {event.participants >= event.maxParticipants && (
                <p className="text-destructive text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  Тренировка заполнена
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card className="glass-card text-center py-12 border-0 shadow-lg">
          <CardContent>
            <p className="text-muted-foreground">На сегодня тренировок нет</p>
            <p className="text-sm text-muted-foreground mt-2">
              Создайте новую тренировку или проверьте расписание на другие дни
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}