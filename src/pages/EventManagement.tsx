import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEvents } from "@/hooks/useEvents";
import { EventForm } from "@/components/admin/EventForm";
import { EventsTable } from "@/components/admin/EventsTable";

interface Event {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_time: string;
  end_time: string;
  type: string;
  packages?: any;
  is_imported?: boolean;
  is_live?: boolean;
}

const EventManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { events: cameloEvents } = useEvents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: dbEvents, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      console.log('Fetching all events for admin...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }

      console.log('Fetched database events:', data);
      return data || [];
    },
  });

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedEvent(undefined);
    refetch();
  };

  if (!user || !isAdmin) return null;

  // Combine and format both database and Camelo events
  const allEvents = [
    ...(dbEvents || []),
    ...cameloEvents.map(event => ({
      id: event.icalLink,
      title: `${event.venue} Event`,
      venue: event.venue,
      location: event.location,
      start_time: new Date(event.date).toISOString(),
      is_imported: true,
      is_live: true // Camelo events are always live
    }))
  ];

  console.log('All events (combined):', allEvents);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Event Management</h1>
        <div className="flex gap-4">
          <Button onClick={() => {
            setSelectedEvent(undefined);
            setIsDialogOpen(true);
          }}>
            Add New Event
          </Button>
          <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <EventsTable 
            events={allEvents} 
            onEventUpdate={refetch}
            onEditEvent={handleEditEvent}
          />
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm onSuccess={handleSuccess} event={selectedEvent} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;