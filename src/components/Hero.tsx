import { motion } from "framer-motion";
import { useEffect } from "react";

export const Hero = () => {
  useEffect(() => {
    const img = new Image();
    img.src = "lovable-uploads/be0bef3c-0975-405c-b967-8e5962c22b85.png";
    img.onload = () => console.log("Image loaded successfully");
    img.onerror = (e) => console.error("Error loading image:", e);
  }, []);

  return (
    <>
      {/* Full-screen Video Section */}
      <section className="h-screen relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://djepidemik.com/wp-content/uploads/2024/10/hero-video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Content Section Below Video */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <img 
              src="lovable-uploads/be0bef3c-0975-405c-b967-8e5962c22b85.png" 
              alt="DJ EPIDEMIK"
              className="w-[500px] md:w-[700px] mx-auto mb-6 filter brightness-200"
              onError={(e) => console.error("Image failed to load:", e)}
            />
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Experience the Epidemic of Sound
            </p>
            <button className="bg-primary text-black font-noto font-bold hover:bg-primary/80 px-8 py-3 rounded-full text-lg transition-colors">
              Book Now
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};