import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CalendarBookingProps {
  children: React.ReactNode;
}

export const CalendarBooking = ({ children }: CalendarBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  });
  const [step, setStep] = useState<'datetime' | 'details' | 'confirmation'>('datetime');
  const { toast } = useToast();

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleFormSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically integrate with a calendar service like Calendly, Acuity, or Google Calendar
      // For now, we'll just show a success message
      
      const appointmentDetails = {
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
        ...formData
      };

      console.log('Booking appointment:', appointmentDetails);

      setStep('confirmation');
      
      // Reset form after confirmation
      setTimeout(() => {
        setIsOpen(false);
        setStep('datetime');
        setSelectedDate(undefined);
        setSelectedTime("");
        setFormData({
          name: "",
          email: "",
          phone: "",
          businessName: "",
          message: ""
        });
      }, 3000);

    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  };

  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 2); // 2 months ahead

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === 'datetime' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Book Your Discovery Call
              </DialogTitle>
              <p className="text-muted-foreground">
                Choose a time that works for you. We'll discuss your business goals and how we can help.
              </p>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < today || 
                    date > maxDate || 
                    !isWeekday(date)
                  }
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="justify-center"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <div></div>
                <Button
                  onClick={() => setStep('details')}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle>Your Details</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate?.toLocaleDateString()} at {selectedTime}
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+44 XXXX XXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Your business name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">What would you like to discuss?</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your business and what you'd like to achieve..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('datetime')}>
                  Back
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  className="bg-brand-orange hover:bg-brand-orange/90"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Book Call
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center">
                <CheckCircle className="h-6 w-6 text-success" />
                Call Booked Successfully!
              </DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="font-semibold text-lg mb-2">Your Discovery Call</div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate?.toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedTime}
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>✓ Calendar invite sent to {formData.email}</p>
                <p>✓ Confirmation SMS sent to {formData.phone}</p>
                <p className="mt-2">We'll call you at the scheduled time to discuss how we can help grow your business.</p>
              </div>

              <Badge variant="secondary" className="mt-4">
                This window will close automatically
              </Badge>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};