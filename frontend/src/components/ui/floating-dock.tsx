import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FloatingDockItem {
    title: string;
    icon: React.ReactNode;
    href: string;
}

interface FloatingDockProps {
    items: FloatingDockItem[];
    className?: string;
    mobileClassName?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                'mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl bg-background/80 backdrop-blur-md px-4 pb-3 border border-border/50 shadow-xl',
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
}

function IconContainer({
    mouseX,
    title,
    icon,
    href,
}: FloatingDockItem & { mouseX: MotionValue }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

    const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
    const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    return (
        <a href={href}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="aspect-square rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center relative border border-primary/20 hover:border-primary/40 transition-colors"
            >
                <motion.div
                    style={{ width: widthIcon, height: heightIcon }}
                    className="flex items-center justify-center text-primary"
                >
                    {icon}
                </motion.div>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 2, x: '-50%' }}
                        className="px-2 py-0.5 whitespace-pre rounded-md bg-background border border-border absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs text-foreground"
                    >
                        {title}
                    </motion.div>
                )}
            </motion.div>
        </a>
    );
}
