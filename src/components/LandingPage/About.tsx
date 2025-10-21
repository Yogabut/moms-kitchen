import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import nasiGorengImg from '@/assets/nasi-goreng.jpg';
import sateAyamImg from '@/assets/sate-ayam.jpg';
import rendangImg from '@/assets/rendang.jpg';

export default function About() {
    return (
        <div>
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
                    Sejak tahun 2023, kami telah melayani ribuan customer, dari catering harian, mingguan, 
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-soft">
                    <img src={nasiGorengImg} alt="Nasi Goreng" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden shadow-soft">
                    <img src={sateAyamImg} alt="Sate Ayam" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-2 aspect-video rounded-xl overflow-hidden shadow-soft">
                    <img src={rendangImg} alt="Rendang" className="w-full h-full object-cover" />
                    </div>
                </div>
                </motion.div>
            </div>
            </div>
        </section>
        </div>
    );
}
