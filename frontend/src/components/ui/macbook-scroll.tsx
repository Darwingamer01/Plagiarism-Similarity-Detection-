"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionValue, useScroll, useTransform, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    IconBrightnessDown,
    IconBrightnessUp,
    IconCaretRightFilled,
    IconCaretUpFilled,
    IconChevronUp,
    IconMicrophone,
    IconMoon,
    IconPlayerSkipBack,
    IconPlayerSkipForward,
    IconPlayerTrackNext,
    IconPlayerTrackPrev,
    IconPower,
    IconSearch,
    IconVolume,
    IconVolume2,
    IconVolume3,
    IconWorld,
} from "@tabler/icons-react";

export const MacbookScroll = ({
    src,
    title,
}: {
    src?: string;
    showGradient?: boolean;
    title?: string | React.ReactNode;
    badge?: React.ReactNode;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (window && window.innerWidth < 768) {
            setIsMobile(true);
        }
    }, []);

    const scaleX = useTransform(
        scrollYProgress,
        [0, 0.3],
        [1.2, isMobile ? 1 : 1.5]
    );
    const scaleY = useTransform(
        scrollYProgress,
        [0, 0.3],
        [0.6, isMobile ? 1 : 1.5]
    );
    const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
    const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
    const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div
            ref={ref}
            className="min-h-[200vh] flex flex-col items-center py-0 md:py-80 justify-start flex-shrink-0 [perspective:1000px] transform md:scale-100 scale-[0.35] sm:scale-50"
        >
            <motion.h2
                style={{
                    translateY: textTransform,
                    opacity: textOpacity,
                }}
                className="dark:text-white text-neutral-800 text-3xl font-bold mb-20 text-center"
            >
                {title || (
                    <span>
                        This Macbook is built with Tailwindcss. <br /> No kidding.
                    </span>
                )}
            </motion.h2>
            {/* Lid */}
            <Lid
                src={src}
                scaleX={scaleX}
                scaleY={scaleY}
                rotate={rotate}
                translate={translate}
            />
            {/* Base area */}
            <div className="h-[22rem] w-[32rem] bg-gray-200 dark:bg-[#272729] rounded-2xl overflow-hidden relative -z-10">
                {/* above keyboard bar */}
                <div className="h-10 w-full relative">
                    <div className="absolute inset-x-0 mx-auto w-[80%] h-4 bg-[#050505]" />
                </div>
                <div className="flex relative">
                    <div className="mx-auto w-[10%] overflow-hidden  h-full">
                        <SpeakerGrid />
                    </div>
                    <div className="mx-auto w-[80%] h-full">
                        <Keypad />
                    </div>
                    <div className="mx-auto w-[10%] overflow-hidden  h-full">
                        <SpeakerGrid />
                    </div>
                </div>
                <Trackpad />
                <div className="h-2 w-20 mx-auto bg-gradient-to-t from-zinc-900 to-zinc-500 rounded-b-xl" />
            </div>
        </div>
    );
}; // end MacbookScroll

export const Lid = ({
    scaleX,
    scaleY,
    rotate,
    translate,
    src,
}: {
    scaleX: MotionValue<number>;
    scaleY: MotionValue<number>;
    rotate: MotionValue<number>;
    translate: MotionValue<number>;
    src?: string;
}) => {
    return (
        <div className="relative [perspective:100px]">
            <div
                style={{
                    transform: "perspective(1000px) rotateX(-25deg) translateZ(0px)",
                    transformOrigin: "bottom",
                    transformStyle: "preserve-3d",
                }}
                className="h-[12rem] w-[32rem] bg-[#010101] rounded-2xl p-2 relative"
            >
                <div
                    style={{
                        boxShadow: "0px 2px 0px 2px var(--neutral-900) inset",
                    }}
                    className="absolute inset-0 bg-[#010101] rounded-lg flex items-center justify-center"
                >
                    <span className="text-white">
                        <IconWorld className="h-20 w-20 text-neutral-800" />
                    </span>
                </div>
            </div>
            <motion.div
                style={{
                    scaleX: scaleX,
                    scaleY: scaleY,
                    rotateX: rotate,
                    translateY: translate,
                    transformStyle: "preserve-3d",
                    transformOrigin: "top",
                }}
                className="h-[22rem] w-[32rem] absolute inset-0 bg-[#010101] rounded-2xl p-2"
            >
                <div className="absolute inset-0 bg-[#272729] rounded-lg" />

                <img
                    src={src}
                    alt="Macbook display"
                    className="object-cover object-left-top absolute rounded-lg inset-0 h-full w-full"
                />
            </motion.div>
        </div>
    );
};

export const Trackpad = () => {
    return (
        <div
            className="w-[40%] mx-auto h-32 rounded-xl my-1"
            style={{
                boxShadow: "0px 0px 1px 1px #00000020 inset",
            }}
        ></div>
    );
};

export const Keypad = () => {
    return (
        <div className="h-full rounded-md bg-[#050505] mx-1 p-1">
            {/* First Row */}
            <div className="flex justify-between">
                {keys.map((key, idx) => (
                    <KBtn
                        key={idx}
                        className={key.className}
                        children={key.children}
                        onClick={() => { }}
                    />
                ))}
            </div>
            {/* Second Row */}
            <div className="flex justify-between my-1">
                <KBtn className="w-10">
                    <span className="block">~</span>
                    <span className="block mt-1">`</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">!</span>
                    <span className="block mt-1">1</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">@</span>
                    <span className="block mt-1">2</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">#</span>
                    <span className="block mt-1">3</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">$</span>
                    <span className="block mt-1">4</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">%</span>
                    <span className="block mt-1">5</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">^</span>
                    <span className="block mt-1">6</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">&</span>
                    <span className="block mt-1">7</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">*</span>
                    <span className="block mt-1">8</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">(</span>
                    <span className="block mt-1">9</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">)</span>
                    <span className="block mt-1">0</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">&mdash;</span>
                    <span className="block mt-1">_</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">+</span>
                    <span className="block mt-1">=</span>
                </KBtn>
                <KBtn
                    className="w-10 items-end justify-end pr-[4px] pb-[2px]"
                    children={<IconX className="h-4 w-4" />}
                />
            </div>
            {/* Third Row */}
            <div className="flex justify-between my-1">
                <KBtn
                    className="w-[2.8rem] items-start pl-1 pt-1"
                    children={<span className="text-xs">tab</span>}
                />
                <KBtn className="w-10">
                    <span className="block">Q</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">W</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">E</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">R</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">T</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">Y</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">U</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">I</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">O</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">P</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">{`{`}</span>
                    <span className="block mt-1">{'['}</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">{`}`}</span>
                    <span className="block mt-1">{']'}</span>
                </KBtn>
                <KBtn className="w-[2.85rem] items-end justify-end pr-1 pb-1">
                    <span className="text-xs">|</span>
                    <span className="block mt-1">\</span>
                </KBtn>
            </div>
            {/* Fourth Row */}
            <div className="flex justify-between my-1">
                <KBtn
                    className="w-[3.65rem] items-start pl-1 pt-1"
                    children={<span className="text-xs">caps lock</span>}
                />
                <KBtn className="w-10">
                    <span className="block">A</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">S</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">D</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">F</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">G</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">H</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">J</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">K</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">L</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">:</span>
                    <span className="block mt-1">;</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">"</span>
                    <span className="block mt-1">'</span>
                </KBtn>
                <KBtn
                    className="w-[5.4rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">return</span>}
                />
            </div>
            {/* Fifth Row */}
            <div className="flex justify-between my-1">
                <KBtn
                    className="w-[4.65rem] items-start pl-1 pt-1"
                    children={<span className="text-xs">shift</span>}
                />
                <KBtn className="w-10">
                    <span className="block">Z</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">X</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">C</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">V</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">B</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">N</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">M</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">{`<`}</span>
                    <span className="block mt-1">{`,`}</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">{`>`}</span>
                    <span className="block mt-1">{`.`}</span>
                </KBtn>
                <KBtn className="w-10">
                    <span className="block">{`?`}</span>
                    <span className="block mt-1">{`/`}</span>
                </KBtn>
                <KBtn
                    className="w-[4.65rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">shift</span>}
                />
            </div>

            {/* Sixth Row */}
            <div className="flex justify-between my-1">
                <KBtn
                    className="w-[3rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">fn</span>}
                />
                <KBtn
                    className="w-[3rem] items-end justify-end pr-1 pb-1"
                    children={<IconChevronUp className="h-[6px] w-[6px]" />}
                />
                <KBtn
                    className="w-[3.25rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">command</span>}
                />
                <KBtn className="w-[14.8rem]"></KBtn>
                <KBtn
                    className="w-[3.25rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">command</span>}
                />
                <KBtn
                    className="w-[3rem] items-end justify-end pr-1 pb-1"
                    children={<span className="text-xs">option</span>}
                />
                <div className="w-[3rem] mt-[2px] h-6 p-[0.5px] rounded-[4px] flex flex-col justify-between items-center">
                    <KBtn className="w-full h-[12px] p-0 flex items-center justify-center">
                        <IconCaretUpFilled className="h-[6px] w-[6px]" />
                    </KBtn>
                    <div className="flex justify-between w-full h-[12px] gap-1">
                        <KBtn className="w-full h-full p-0 flex items-center justify-center">
                            <IconCaretLeftFilled className="h-[6px] w-[6px]" />
                        </KBtn>
                        <KBtn className="w-full h-full p-0 flex items-center justify-center">
                            <IconCaretDownFilled className="h-[6px] w-[6px]" />
                        </KBtn>
                        <KBtn className="w-full h-full p-0 flex items-center justify-center">
                            <IconCaretRightFilled className="h-[6px] w-[6px]" />
                        </KBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const KBtn = ({
    className,
    children,
    onClick,
}: {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}) => {
    return (
        <div
            className={cn(
                "p-[1.5px] rounded-[4px] bg-[#0A090D] shadow-[0px_0px_1px_1px_#00000080_inset] cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    "h-6 w-full bg-[#161519] rounded-[3px] flex items-center justify-center text-neutral-200 text-[10px]",
                    className
                )}
            >
                {children}
            </div>
        </div >
    );
};
const SpeakerGrid = () => {
    return (
        <div
            className="flex px-[0.5px] gap-[2px] mt-2 h-40"
            style={{
                backgroundImage:
                    "radial-gradient(circle, #000000 0.5px, transparent 0.6px)",
                backgroundSize: "3px 3px",
            }}
        ></div>
    );
};

// Mock icons if not using library directly or if components missing
const IconX = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)
const IconCaretLeftFilled = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M13.86 16.32a.75.75 0 0 1-1.23.51l-4-5.25a.75.75 0 0 1 0-.96l4-5.25a.75.75 0 0 1 1.23.51v10.44Z" /></svg>
)
const IconCaretDownFilled = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M16.32 10.14a.75.75 0 0 1 .51 1.23l-5.25 4a.75.75 0 0 1-.96 0l-5.25-4a.75.75 0 0 1 .51-1.23h10.44Z" /></svg>
)

const keys = [
    {
        children: <span className="text-[10px]">esc</span>,
        className: "w-10 pl-1 items-start",
    },
    {
        children: <IconBrightnessDown className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconBrightnessUp className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconSearch className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconMicrophone className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconMoon className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconPlayerTrackPrev className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconPlayerSkipBack className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconPlayerSkipForward className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconPlayerTrackNext className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconVolume3 className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconVolume2 className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconVolume className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
    {
        children: <IconPower className="h-[14px] w-[14px]" />,
        className: "w-10",
    },
];
