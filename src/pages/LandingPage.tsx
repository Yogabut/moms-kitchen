import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Clock, Heart, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  const features = [
    {
      icon: Clock,
      title: 'Pengiriman Tepat Waktu',
      description: 'Kami pastikan makanan tiba tepat waktu untuk acara Anda',
    },
    {
      icon: Heart,
      title: 'Cita Rasa Autentik',
      description: 'Masakan rumahan dengan resep turun temurun',
    },
    {
      icon: Users,
      title: 'Porsi Fleksibel',
      description: 'Dari 10 hingga 500 porsi, kami siap melayani',
    },
  ];

  const testimonials = [
    {
      name: 'Ibu Siti',
      text: 'Makanannya enak banget! Tamu-tamu saya pada suka semua. Pasti order lagi!',
      rating: 5,
    },
    {
      name: 'Bapak Rahman',
      text: 'Pelayanan cepat dan makanan fresh. Sangat recommended untuk acara kantor.',
      rating: 5,
    },
    {
      name: 'Ibu Maya',
      text: 'Harga terjangkau tapi kualitas premium. Terima kasih Dapur Ibu!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Cita Rasa Rumahan untuk Setiap Acara Anda
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Dari pertemuan kecil hingga pesta besar, kami hadirkan masakan Indonesia yang lezat dan berkesan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" variant="secondary" className="gap-2 group">
                  Lihat Menu
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
                  Hubungi Kami
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kenapa Pilih Dapur Ibu?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lebih dari 10 tahun pengalaman melayani berbagai acara dengan dedikasi penuh
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-8 pb-8">
                    <div className="w-14 h-14 rounded-full gradient-hero mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tentang Dapur Ibu
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Dapur Ibu dimulai dari kecintaan terhadap masakan rumahan yang hangat dan penuh cinta. 
                Sejak tahun 2013, kami telah melayani ribuan acara, dari ulang tahun, pernikahan, 
                hingga acara korporat.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Setiap menu kami dibuat dengan bahan-bahan pilihan dan resep yang telah diwariskan 
                turun temurun. Kami percaya bahwa makanan bukan hanya tentang rasa, tapi juga tentang 
                menciptakan kenangan indah bersama orang-orang tercinta.
              </p>
              <Link to="/menu">
                <Button variant="default" className="gap-2">
                  Pesan Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-8xl">🍲</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kata Mereka Tentang Kami
            </h2>
            <p className="text-muted-foreground">
              Kepuasan pelanggan adalah prioritas utama kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Memesan untuk Acara Anda?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" variant="secondary">
                  Lihat Menu Lengkap
                </Button>
              </Link>
              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
                  WhatsApp Kami
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
