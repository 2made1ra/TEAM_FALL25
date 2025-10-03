import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Badge } from "@src/components/ui/badge";
import { Separator } from "@src/components/ui/separator";
import { 
  User, 
  Edit3, 
  Camera, 
  Award, 
  Calendar, 
  Target, 
  TrendingUp,
  Save,
  X
} from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  description: string;
  avatar: string;
  stats: {
    workoutsAttended: number;
    workoutsCreated: number;
    totalParticipants: number;
    joinDate: string;
  };
}

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export function ProfileScreen({ profile, onUpdateProfile }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="page-title">Профиль</h1>
        <p className="text-muted-foreground font-medium">
          Управляйте своим профилем и статистикой
        </p>
      </div>

      {/* Основная информация профиля */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-card-foreground">Личная информация</CardTitle>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Edit3 size={16} className="mr-1" />
                Редактировать
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancel}
                  className="border-destructive/20 hover:bg-destructive/10"
                >
                  <X size={16} className="mr-1" />
                  Отмена
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0"
                >
                  <Save size={16} className="mr-1" />
                  Сохранить
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={editedProfile.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                  {getInitials(editedProfile.firstName, editedProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 border-primary/20"
                >
                  <Camera size={16} />
                </Button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {profile.description || "Нет описания"}
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя</Label>
                    <Input
                      id="firstName"
                      value={editedProfile.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input
                      id="lastName"
                      value={editedProfile.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Расскажите о себе..."
                    value={editedProfile.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-center mb-2">
                <Calendar size={24} className="text-blue-500" />
              </div>
              <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                {profile.stats.workoutsAttended}
              </div>
              <div className="text-sm text-muted-foreground">
                Посещено тренировок
              </div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center justify-center mb-2">
                <Target size={24} className="text-green-500" />
              </div>
              <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                {profile.stats.workoutsCreated}
              </div>
              <div className="text-sm text-muted-foreground">
                Создано тренировок
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Всего участников привлечено:</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                {profile.stats.totalParticipants}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">В приложении с:</span>
              <span className="font-medium">{profile.stats.joinDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Достижения */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="font-medium">Первая тренировка</div>
                  <div className="text-sm text-muted-foreground">Создали свою первую тренировку</div>
                </div>
              </div>
            </div>
            
            {profile.stats.workoutsAttended >= 5 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                    💪
                  </div>
                  <div>
                    <div className="font-medium">Активный участник</div>
                    <div className="text-sm text-muted-foreground">Посетили 5+ тренировок</div>
                  </div>
                </div>
              </div>
            )}
            
            {profile.stats.workoutsCreated >= 3 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    🎯
                  </div>
                  <div>
                    <div className="font-medium">Опытный тренер</div>
                    <div className="text-sm text-muted-foreground">Создали 3+ тренировки</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}