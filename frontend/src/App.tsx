import { useState } from "react";
import { BottomNavigation } from "@src/components/BottomNavigation";
import { WorkoutsScreen } from "@src/components/ScheduleScreen";
import { MyScheduleScreen } from "@src/components/MyScheduleScreen";
import { CreateEventScreen } from "@src/components/CreateEventScreen";
import { ProfileScreen } from "@src/components/ProfileScreen";
import { PaymentScreen } from "@src/components/PaymentScreen";
import { Toaster } from "@src/components/ui/sonner";
import { toast } from "sonner";

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

interface Notification {
  id: string;
  type: "new_workout" | "reminder" | "payment" | "cancellation";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

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

export default function App() {
  const [activeTab, setActiveTab] = useState("workouts");
  const [
    selectedWorkoutForPayment,
    setSelectedWorkoutForPayment,
  ] = useState<WorkoutEvent | null>(null);
  const [joinedEventIds, setJoinedEventIds] = useState<
    string[]
  >([]);
  const [createdEventIds, setCreatedEventIds] = useState<
    string[]
  >([]);

  // Начальные данные для демо
  const [events, setEvents] = useState<WorkoutEvent[]>([
    {
      id: "1",
      title: "Утренняя йога",
      time: "08:00",
      duration: "60 мин",
      location: 'Зал №1, фитнес-центр "Энергия"',
      participants: 8,
      maxParticipants: 15,
      price: 800,
      instructor: "Анна Петрова",
    },
    {
      id: "2",
      title: "Кроссфит",
      time: "18:00",
      duration: "90 мин",
      location: 'Зал №2, фитнес-центр "Энергия"',
      participants: 12,
      maxParticipants: 12,
      price: 1200,
      instructor: "Михаил Сидоров",
    },
    {
      id: "3",
      title: "Пилатес для начинающих",
      time: "19:30",
      duration: "45 мин",
      location: 'Студия "Гармония"',
      participants: 5,
      maxParticipants: 10,
      price: 600,
      instructor: "Елена Волкова",
    },
  ]);

  const [notifications, setNotifications] = useState<
    Notification[]
  >([
    {
      id: "1",
      type: "reminder",
      title: "Напоминание о тренировке",
      message:
        'Через час начинается "Утренняя йога". Не забудьте взять коврик!',
      time: "2 ч назад",
      isRead: false,
    },
    {
      id: "2",
      type: "new_workout",
      title: "Новая тренировка",
      message:
        'Добавлена новая тренировка "Пилатес для начинающих" на сегодня в 19:30',
      time: "5 ч назад",
      isRead: false,
    },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: "Александр",
    lastName: "Иванов",
    description:
      "Люблю активный образ жизни и помогаю другим достигать своих спортивных целей",
    avatar: "",
    stats: {
      workoutsAttended: 12,
      workoutsCreated: 3,
      totalParticipants: 45,
      joinDate: "Январь 2024",
    },
  });

  const handleCreateEvent = (newEvent: WorkoutEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    setCreatedEventIds((prev) => [...prev, newEvent.id]);
    setUserProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        workoutsCreated: prev.stats.workoutsCreated + 1,
      },
    }));
    toast.success("Тренировка успешно создана!");
    setActiveTab("workouts");
  };

  const handleSendNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: "new_workout",
      title: "Новая тренировка создана",
      message:
        "Участники получат уведомление о новой тренировке",
      time: "Только что",
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    toast.success("Уведомления отправлены участникам!");
  };

  const handleJoinEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event && event.participants < event.maxParticipants) {
      setSelectedWorkoutForPayment(event);
      setActiveTab("payment");
    }
  };

  const handlePaymentComplete = () => {
    if (selectedWorkoutForPayment) {
      // Увеличиваем количество участников
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedWorkoutForPayment.id
            ? { ...event, participants: event.participants + 1 }
            : event,
        ),
      );

      // Добавляем в список записанных тренировок
      setJoinedEventIds((prev) => [
        ...prev,
        selectedWorkoutForPayment.id,
      ]);

      // Обновляем статистику пользователя
      setUserProfile((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          workoutsAttended: prev.stats.workoutsAttended + 1,
        },
      }));

      // Добавляем уведомление об успешной оплате
      const paymentNotification: Notification = {
        id: Date.now().toString(),
        type: "payment",
        title: "Оплата прошла успешно",
        message: `Вы записались на "${selectedWorkoutForPayment.title}". Билет отправлен в чат.`,
        time: "Только что",
        isRead: false,
      };

      setNotifications((prev) => [
        paymentNotification,
        ...prev,
      ]);

      setSelectedWorkoutForPayment(null);
      setActiveTab("workouts");
      toast.success("Вы успешно записались на тренировку!");
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success("Все уведомления очищены");
  };

  const handleCancelRegistration = (eventId: string) => {
    // Уменьшаем количество участников
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              participants: Math.max(0, event.participants - 1),
            }
          : event,
      ),
    );

    // Удаляем из списка записанных
    setJoinedEventIds((prev) =>
      prev.filter((id) => id !== eventId),
    );

    // Обновляем статистику
    setUserProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        workoutsAttended: Math.max(
          0,
          prev.stats.workoutsAttended - 1,
        ),
      },
    }));

    toast.success("Запись на тренировку отменена");
  };

  const handleDeleteEvent = (eventId: string) => {
    // Удаляем тренировку
    setEvents((prev) =>
      prev.filter((event) => event.id !== eventId),
    );

    // Удаляем из списка созданных
    setCreatedEventIds((prev) =>
      prev.filter((id) => id !== eventId),
    );

    // Обновляем статистику
    setUserProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        workoutsCreated: Math.max(
          0,
          prev.stats.workoutsCreated - 1,
        ),
      },
    }));

    toast.success("Тренировка удалена");
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    toast.success("Профиль обновлен");
  };

  // Получаем списки тренировок для "Мое расписание"
  const joinedEvents = events.filter((event) =>
    joinedEventIds.includes(event.id),
  );
  const createdEvents = events.filter((event) =>
    createdEventIds.includes(event.id),
  );

  const renderScreen = () => {
    switch (activeTab) {
      case "workouts":
        return (
          <WorkoutsScreen
            events={events}
            onJoinEvent={handleJoinEvent}
          />
        );
      case "my-schedule":
        return (
          <MyScheduleScreen
            joinedEvents={joinedEvents}
            createdEvents={createdEvents}
            onCancelRegistration={handleCancelRegistration}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "create":
        return (
          <CreateEventScreen
            onCreateEvent={handleCreateEvent}
            onSendNotification={handleSendNotification}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            profile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case "payment":
        return (
          <PaymentScreen
            selectedWorkout={selectedWorkoutForPayment}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setActiveTab("workouts")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen telegram-mini-app relative">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-slate-900/50 dark:via-purple-900/50 dark:to-blue-900/50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {renderScreen()}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <Toaster />
    </div>
  );
}