import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { RsvpsTable } from "@/components/admin/RsvpsTable";

const RsvpManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">RSVP Management</h1>
        <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <RsvpsTable />
      </div>
    </div>
  );
};

export default RsvpManagement;