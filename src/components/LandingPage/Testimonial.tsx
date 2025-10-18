import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '@/components/LandingPage/Hero';
import Features from '@/components/LandingPage/Features';
import About from '@/components/LandingPage/About';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Clock, Heart, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import heroImage from '@/assets/hero-kitchen.jpg';
import nasiGorengImg from '@/assets/nasi-goreng.jpg';
import sateAyamImg from '@/assets/sate-ayam.jpg';
import rendangImg from '@/assets/rendang.jpg';

export default function Testimonial() {

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
    <div>
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
    </div>
  );
}
