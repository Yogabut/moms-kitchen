import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-6">
      <motion.div
        className="text-center space-y-6 max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Number */}
        <motion.h1
          className="text-9xl font-extrabold text-primary drop-shadow-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          404
        </motion.h1>

        {/* Title */}
        <h2 className="text-3xl font-semibold tracking-tight">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          Maaf, halaman yang Anda cari tidak ditemukan atau mungkin sudah
          dipindahkan. Silakan kembali ke beranda dan lanjutkan eksplorasi Anda.
        </p>

        {/* Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild size="lg" className="rounded-full shadow-md">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
        </motion.div>

        {/* Decorative element */}
        <motion.div
          className="absolute -z-10 top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}
