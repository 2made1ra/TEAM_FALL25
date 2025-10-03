import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Badge } from "@src/components/ui/badge";
import { Separator } from "@src/components/ui/separator";
import { CheckCircle, CreditCard, Smartphone, Wallet, ArrowLeft } from "lucide-react";

interface PaymentScreenProps {
  selectedWorkout?: {
    title: string;
    time: string;
    instructor: string;
    price: number;
  } | null;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function PaymentScreen({ selectedWorkout, onPaymentComplete, onBack }: PaymentScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Банковская карта',
      icon: CreditCard,
      description: 'Visa, MasterCard, Мир'
    },
    {
      id: 'sbp',
      name: 'СБП',
      icon: Smartphone,
      description: 'Быстрые платежи'
    },
    {
      id: 'wallet',
      name: 'Электронный кошелек',
      icon: Wallet,
      description: 'ЮMoney, Qiwi'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Имитация процесса оплаты
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsCompleted(true);
    
    // Завершение оплаты через 2 секунды
    setTimeout(() => {
      onPaymentComplete();
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-screen">
        <Card className="glass-card w-full max-w-sm text-center border-0 shadow-2xl">
          <CardContent className="py-12">
            <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
            <h2 className="mb-4 page-title text-center">Оплата прошла успешно!</h2>
            <p className="text-muted-foreground mb-6">
              Вы записались на тренировку "{selectedWorkout?.title}"
            </p>
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md">
              Билет отправлен в чат
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedWorkout) {
    return (
      <div className="p-4 pb-20">
        <Card className="glass-card border-0 shadow-lg text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">Тренировка не выбрана</p>
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="mt-4 border-primary/20 hover:bg-primary/10"
            >
              Вернуться к расписанию
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <div className="space-y-1">
          <h1 className="page-title">Оплата тренировки</h1>
          <p className="text-muted-foreground font-medium">Выберите способ оплаты</p>
        </div>
      </div>

      {/* Информация о тренировке */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Детали заказа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Тренировка:</span>
            <span>{selectedWorkout.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Время:</span>
            <span>{selectedWorkout.time}</span>
          </div>
          <div className="flex justify-between">
            <span>Инструктор:</span>
            <span>{selectedWorkout.instructor}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>К оплате:</span>
            <span>{selectedWorkout.price}₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Способы оплаты */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Способ оплаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id 
                    ? 'border-primary bg-gradient-to-r from-purple-500/10 to-blue-500/10 shadow-md' 
                    : 'border-border hover:border-primary/50 hover:shadow-sm'
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <Icon size={24} className="text-muted-foreground" />
                <div className="flex-1">
                  <p>{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                {selectedPaymentMethod === method.id && (
                  <CheckCircle size={20} className="text-primary" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Кнопка оплаты */}
      <Button
        className="w-full"
        disabled={!selectedPaymentMethod || isProcessing}
        onClick={handlePayment}
      >
        {isProcessing ? 'Обработка платежа...' : `Оплатить ${selectedWorkout.price}₽`}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Нажимая "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности
      </p>
    </div>
  );
}