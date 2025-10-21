import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-kitchen.jpg';


export default function Hero() {
    return (
        <div>
            <section className="relative text-white min-h-screen flex items-center justify-center overflow-hidden">
                <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                
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
                        href="https://wa.me/6281945062598"
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
        </div>
    );
}
