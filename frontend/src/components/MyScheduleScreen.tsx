import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Badge } from "@src/components/ui/badge";
import { Clock, MapPin, Users, Calendar, Trash2 } from "lucide-react";

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

interface MyScheduleScreenProps {
  joinedEvents: WorkoutEvent[];
  createdEvents: WorkoutEvent[];
  onCancelRegistration: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function MyScheduleScreen({ 
  joinedEvents, 
  createdEvents, 
  onCancelRegistration, 
  onDeleteEvent 
}: MyScheduleScreenProps) {
  const today = new Date().toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const renderEventCard = (event: WorkoutEvent, isCreated: boolean = false) => (
    <Card key={event.id} className="glass-card overflow-hidden border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-card-foreground">{event.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className={`border-0 ${
                  isCreated 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}
              >
                {isCreated ? 'Создано вами' : 'Записан'}
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
                {event.price}₽
              </Badge>
            </div>
          </div>
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
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span>{event.participants}/{event.maxParticipants} участников</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          {isCreated ? (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onDeleteEvent(event.id)}
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <Trash2 size={16} className="mr-1" />
              Удалить
            </Button>
          ) : (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onCancelRegistration(event.id)}
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              Отменить запись
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="page-title">Мое расписание</h1>
        <p className="text-muted-foreground capitalize font-medium">{today}</p>
      </div>

      {/* Тренировки, на которые записан */}
      {joinedEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <h2 className="font-semibold text-lg">Записанные тренировки</h2>
          </div>
          <div className="space-y-4">
            {joinedEvents.map((event) => renderEventCard(event, false))}
          </div>
        </div>
      )}

      {/* Созданные тренировки */}
      {createdEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <h2 className="font-semibold text-lg">Созданные тренировки</h2>
          </div>
          <div className="space-y-4">
            {createdEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* Пустое состояние */}
      {joinedEvents.length === 0 && createdEvents.length === 0 && (
        <Card className="glass-card border-0 shadow-lg text-center py-12">
          <CardContent>
            <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">У вас пока нет тренировок</p>
            <p className="text-sm text-muted-foreground mt-2">
              Запишитесь на тренировку или создайте свою
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}