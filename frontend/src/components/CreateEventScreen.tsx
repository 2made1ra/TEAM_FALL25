import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui/select";
import { CalendarDays, Clock, MapPin, DollarSign, Users } from "lucide-react";

interface CreateEventScreenProps {
  onCreateEvent: (event: any) => void;
  onSendNotification: () => void;
}

export function CreateEventScreen({ onCreateEvent, onSendNotification }: CreateEventScreenProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    maxParticipants: '',
    price: '',
    instructor: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      id: Date.now().toString(),
      title: formData.title,
      time: formData.time,
      duration: formData.duration,
      location: formData.location,
      participants: 0,
      maxParticipants: parseInt(formData.maxParticipants),
      price: parseInt(formData.price),
      instructor: formData.instructor,
      description: formData.description
    };

    onCreateEvent(newEvent);
    onSendNotification();
    
    // Сброс формы
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      location: '',
      maxParticipants: '',
      price: '',
      instructor: ''
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="page-title">Создать тренировку</h1>
        <p className="text-muted-foreground font-medium">Заполните информацию о новой тренировке</p>
      </div>

      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Детали тренировки</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название тренировки</Label>
              <Input
                id="title"
                placeholder="Например: Йога для начинающих"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Краткое описание тренировки..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  <CalendarDays size={16} className="inline mr-1" />
                  Дата
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  <Clock size={16} className="inline mr-1" />
                  Время
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Продолжительность</Label>
              <Select onValueChange={(value) => updateField('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите продолжительность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 мин">30 минут</SelectItem>
                  <SelectItem value="45 мин">45 минут</SelectItem>
                  <SelectItem value="60 мин">1 час</SelectItem>
                  <SelectItem value="90 мин">1.5 часа</SelectItem>
                  <SelectItem value="120 мин">2 часа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin size={16} className="inline mr-1" />
                Место проведения
              </Label>
              <Input
                id="location"
                placeholder="Адрес или название зала"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Инструктор</Label>
              <Input
                id="instructor"
                placeholder="Имя инструктора"
                value={formData.instructor}
                onChange={(e) => updateField('instructor', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">
                  <Users size={16} className="inline mr-1" />
                  Макс. участников
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="20"
                  value={formData.maxParticipants}
                  onChange={(e) => updateField('maxParticipants', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  <DollarSign size={16} className="inline mr-1" />
                  Цена (₽)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="500"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg"
            >
              Создать тренировку
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}