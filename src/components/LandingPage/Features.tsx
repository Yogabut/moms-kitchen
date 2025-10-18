import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Heart, Users } from 'lucide-react';

export default function Features() {
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

    return (
        <div>
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
        </div>
    );
    }
