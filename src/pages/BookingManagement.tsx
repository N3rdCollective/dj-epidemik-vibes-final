import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { EditBookingDialog } from "@/components/admin/booking/EditBookingDialog";

const BookingManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['dj-bookings'],
    queryFn: async () => {
      console.log('Fetching DJ bookings...');
      const { data, error } = await supabase
        .from('dj_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching DJ bookings:', error);
        toast.error('Failed to load DJ bookings');
        throw error;
      }

      console.log('Fetched DJ bookings:', data);
      return data || [];
    },
  });

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;
  if (isLoading) return <div className="container mx-auto px-4 py-8 mt-16">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">DJ Booking Requests</h1>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Rate/Hour</TableHead>
                <TableHead>Equipment Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>
                    {booking.event_date ? format(new Date(booking.event_date), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell>{booking.event_type}</TableCell>
                  <TableCell>
                    {booking.start_time && booking.end_time ? (
                      `${format(parseISO(booking.start_time), 'h:mm a')} - ${format(parseISO(booking.end_time), 'h:mm a')} (+2hrs setup/breakdown)`
                    ) : (
                      booking.event_duration || 'N/A'
                    )}
                  </TableCell>
                  <TableCell>{booking.number_of_guests}</TableCell>
                  <TableCell>{booking.needs_equipment ? 'Yes' : 'No'}</TableCell>
                  <TableCell>${booking.rate_per_hour || '0'}</TableCell>
                  <TableCell>${booking.equipment_cost || '0'}</TableCell>
                  <TableCell>${booking.total_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <EditBookingDialog booking={booking} onUpdate={refetch} />
                  </TableCell>
                </TableRow>
              ))}
              {(!bookings || bookings.length === 0) && (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-4">
                    No booking requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default BookingManagement;