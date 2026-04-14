import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

/* ── Stacked horizontal bar chart ── */
const KEY_COLOR = '#f59e0b';
interface BarItem { label: string; value: number; key?: boolean; }

const StackedBar: React.FC<{
    title: string;
    data: BarItem[];
    isVisible: boolean;
    isDark: boolean;
    delay?: number;
}> = ({ title, data, isVisible, isDark, delay = 0 }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    const lightGrays = ['#1a1a1a', '#555555', '#888888', '#aaaaaa', '#cccccc'];
    const darkGrays = ['#e8e8e8', '#b0b0b0', '#808080', '#606060', '#484848'];
    const grays = isDark ? darkGrays : lightGrays;
    let gi = 0;
    const colors = data.map(d => d.key ? KEY_COLOR : grays[gi++ % grays.length]);

    return (
        <div className="mb-7">
            <p className="text-s text-gray-500 mb-2 leading-tight">{title}</p>
            {/* % labels */}
            <div className="flex w-full mb-0.5">
                {data.map((d, i) => (
                    <div key={i} style={{ flex: `0 0 ${(d.value / total) * 100}%`, overflow: 'hidden', opacity: isVisible ? 1 : 0, transition: `opacity 0.4s ease ${delay + 600 + i * 60}ms` }}>
                        <span className="text-xs block whitespace-nowrap leading-tight" style={{ color: colors[i] }}>{d.value}%</span>
                    </div>
                ))}
            </div>
            {/* Segmented bar */}
            <div className="flex w-full overflow-hidden mb-1.5" style={{ height: '5px', borderRadius: '3px', gap: '1px' }}>
                {data.map((d, i) => (
                    <div key={i} style={{ width: isVisible ? `${(d.value / total) * 100}%` : '0%', backgroundColor: colors[i], flexShrink: 0, height: '100%', transition: `width 1s ease ${delay + i * 100}ms` }} />
                ))}
            </div>
            {/* Labels */}
            <div className="flex w-full">
                {data.map((d, i) => (
                    <div key={i} style={{ flex: `0 0 ${(d.value / total) * 100}%`, overflow: 'hidden', opacity: isVisible ? 1 : 0, transition: `opacity 0.4s ease ${delay + 900 + i * 60}ms` }}>
                        <span className="text-xs block leading-tight line-clamp-2" style={{ color: d.key ? KEY_COLOR : undefined }}>{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Research section ── */
const ResearchSection: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isDark, setIsDark] = React.useState(false);
    const sectionRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); }
        }, { threshold: 0.05 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    React.useEffect(() => {
        const check = () => setIsDark(document.body.classList.contains('bloomy-dark-mode'));
        const mo = new MutationObserver(check);
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        check();
        return () => mo.disconnect();
    }, []);

    /* ── chart data ── */
    const commMethod: BarItem[] = [
        { label: 'Writing', value: 37.1 },
        { label: 'Gestures', value: 35.1 },
        { label: 'Speaking', value: 20.6 },
        { label: 'Sign', value: 7.2, key: true },
    ];
    const lipReading: BarItem[] = [
        { label: 'Can', value: 84.0, key: true },
        { label: 'Barely', value: 8.6 },
        { label: 'Can\'t', value: 7.4 },
    ];
    const engageConv: BarItem[] = [
        { label: 'Can', value: 5.0 },
        { label: 'Almost', value: 9.1, key: true },
        { label: 'Somewhat able to', value: 33.3 },
        { label: 'Barely', value: 29.7 },
        { label: 'Can\'t', value: 22.9 },
    ];
    const assistance: BarItem[] = [
        { label: 'Yes', value: 77.9, key: true },
        { label: 'No', value: 22.1 },
    ];
    const caregiver: BarItem[] = [
        { label: 'Spouse', value: 47.4, key: true },
        { label: 'Parents', value: 31.3 },
        { label: 'Children', value: 5.6 },
        { label: 'Family', value: 10.1 },
        { label: 'Assistant', value: 5.6 },
    ];
    const income: BarItem[] = [
        { label: 'Family income', value: 60.8, key: true },
        { label: 'Relatives', value: 11.9 },
        { label: 'Subsidies', value: 11.2 },
        { label: 'Pension', value: 9.2 },
        { label: 'Other', value: 6.9 },
    ];

    const hearingAids = [
        {
            pct: 76, stroke: KEY_COLOR,
            label: 'In-ear hearing aids', price: '$3,600',
            image: '/bloomy/In-ear hearing aids.png',
            features: ['Not visible', 'Risk of worsening hearing', 'Unsuitable for short ear', 'Not for long-term use', 'Quick battery drain'],
        },
        {
            pct: 24, stroke: '#9ca3af',
            label: 'Open-fit hearing aids', price: '$1,400',
            image: '/bloomy/Open-fit hearing aids.png',
            features: ['Visible', 'Can be used semi-permanently', 'Suitable for profound hearing loss', 'Can be worn for long periods', 'Adjustable ambient noise control'],
        },
    ];

    return (
        <section ref={sectionRef} className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Research</p>
            <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-4">
                People with hearing loss facing<br />communication barriers
            </h2>
            <p className="project-description mb-10 max-w-2xl">
                Differences are understood through communication. We offer empathy and solutions for overcoming communication challenges.
            </p>
            <div className="w-full mb-16 overflow-hidden bg-gray-50">
                <img src="/bloomy/Target.png" alt="Research target" className="w-full h-full object-contain" />
            </div>

            {/* 2-col: LEFT = 3 text blocks, RIGHT = all charts */}
            <div className="grid grid-cols-1 dt:grid-cols-1 gap-0" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
                <div className="grid grid-cols-1 gap-0" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)' }}>

                    {/* Actual 2-col layout via flex on dt */}
                    <div className="flex flex-col dt:flex-row gap-12 lg:gap-20">

                        {/* LEFT: 3 text sections */}
                        <div className="flex flex-col gap-12 dt:w-[38%] shrink-0">

                            {/* 1. Desire to Conceal */}
                            <div>
                                <h3 className="text-xl font-normal text-black mb-3">Desire to Conceal Disability</h3>
                                <p className="text-gray-500 text-s leading-relaxed mb-3">
                                    Visibility leads to irrational choices, driven by the pressure to hide differences.<sup>1)</sup>
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    ¹ Council of Information and Jury reference · Before invisible hearing aids · K-Welfare statistics · Invisible hearing aids (4C, IIC, CIC standards) · Olsen hearing aids in 1975, IPC standards.
                                </p>
                            </div>

                            {/* 2. Lack of Communication Methods */}
                            <div>
                                <h3 className="text-xl font-normal text-black mb-3">Lack of<br />Communication Methods</h3>
                                <p className="text-gray-500 text-s leading-relaxed mb-3">
                                    The commonly known communication method for individuals with hearing loss, sign language, was used by only 7.2%. In contrast, 84% reported that they are able to engage in spoken conversations.
                                </p>
                                <div className="text-xs text-gray-400 leading-relaxed space-y-1">
                                    <p>² Ministry of Health and Welfare / Disability Survey, 2019</p>
                                    <p>³ Korea Employment Agency for Persons with Disabilities / Disability Employment Panel Survey, 2021</p>
                                    <p>⁴ Ministry of Culture, Sports and Tourism · Korean Sign Language Use Survey, 2019</p>
                                </div>
                            </div>

                            {/* 3. Need for a Caregiver */}
                            <div>
                                <h3 className="text-xl font-normal text-black mb-3">Need for a Caregiver</h3>
                                <p className="text-gray-500 text-s leading-relaxed mb-3">
                                    They needed someone to assist them. In most cases, the person providing help was limited to family members. While family takes responsibility for their livelihood, they cannot always be present.
                                </p>
                                <div className="text-xs text-gray-400 leading-relaxed space-y-1">
                                    <p>⁵ Korea Employment Agency for Persons with Disabilities / Disability Employment Panel Survey, 2021</p>
                                    <p>⁶ Ministry of Health and Welfare / Disability Panel Survey, 2021</p>
                                    <p>⁷ Korea Employment Agency for Persons with Disabilities / Disability Employment Panel Survey, 2019</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: all charts */}
                        <div className="flex-1 min-w-0">

                            {/* Donut rings */}
                            <div className="grid grid-cols-2 gap-6 mb-16">
                                {hearingAids.map((item, idx) => {
                                    const r = 46;
                                    const circ = 2 * Math.PI * r;
                                    const track = isDark ? '#555' : '#e5e7eb';
                                    return (
                                        <div key={item.label} className="flex flex-col items-center dt:flex-row dt:items-start gap-4"
                                            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(8px)', transition: `opacity 0.7s ease ${idx * 200}ms, transform 0.7s ease ${idx * 200}ms` }}>
                                            {/* Ring */}
                                            <div className="relative shrink-0 w-24 h-24 mb-8 dt:mb-0">
                                                <svg viewBox="0 0 108 108" className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx="54" cy="54" r={r} fill="none" stroke={track} strokeWidth="5" />
                                                    <circle cx="54" cy="54" r={r} fill="none" stroke={item.stroke} strokeWidth="5" strokeLinecap="round"
                                                        strokeDasharray={circ}
                                                        strokeDashoffset={isVisible ? circ * (1 - item.pct / 100) : circ}
                                                        style={{ transition: `stroke-dashoffset 2s ease ${idx * 200 + 300}ms` }} />
                                                </svg>
                                                {/* image */}
                                                <div className="absolute inset-2 rounded-full overflow-hidden">
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.label} />
                                                </div>
                                                {/* % center-bottom */}
                                                <div className="absolute left-1/2 -translate-x-1/2 text-s font-normal leading-none" style={{ color: item.stroke, bottom: '-24px' }}>
                                                    {item.pct}%
                                                </div>
                                            </div>
                                            {/* text */}
                                            <div className="pt-1">
                                                <p className="text-s font-normal mb-0.5">{item.label}</p>
                                                <p className="text-s font-normal mb-2">{item.price}</p>
                                                <ul className="space-y-1">
                                                    {item.features.map(f => <li key={f} className="text-xs text-gray-500">{f}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bar charts group 1 */}
                            <StackedBar title="Primary Communication Method ²⁾" data={commMethod} isVisible={isVisible} isDark={isDark} delay={0} />
                            <StackedBar title="Level of Speech (Lip-reading) Comprehension ³⁾" data={lipReading} isVisible={isVisible} isDark={isDark} delay={100} />
                            <StackedBar title="Ability to Engage in Conversation ⁴⁾" data={engageConv} isVisible={isVisible} isDark={isDark} delay={200} />

                            <div className="border-t border-gray-100 my-8" />

                            {/* Bar charts group 2 */}
                            <StackedBar title="Availability of Assistance ⁵⁾" data={assistance} isVisible={isVisible} isDark={isDark} delay={300} />
                            <StackedBar title="Type of Primary Caregiver ⁶⁾" data={caregiver} isVisible={isVisible} isDark={isDark} delay={400} />
                            <StackedBar title="Main Household Income Source ⁷⁾" data={income} isVisible={isVisible} isDark={isDark} delay={500} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Bloomy: React.FC = () => {
    const [isDark, setIsDark] = React.useState(false);
    const focusedSectionRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (focusedSectionRef.current) {
                const rect = focusedSectionRef.current.getBoundingClientRect();
                const dark = rect.bottom < 0;
                setIsDark(dark);
                document.body.classList.toggle('bloomy-dark-mode', dark);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.classList.remove('bloomy-dark-mode');
        };
    }, []);

    const concepts = [
        {
            number: '01',
            title: 'Universally Accessible',
            image: '/bloomy/Universally Accessible.png',
            desc: 'Designed to work alongside sign language, lip reading, and written text — meeting users wherever they are in their communication journey.',
        },
        {
            number: '02',
            title: 'Translate Context & Situations',
            image: '/bloomy/Translate Context & Situations.png',
            desc: 'Ambient audio is analyzed and translated into contextual cues, helping users understand the emotional tone and urgency of a conversation.',
        },
        {
            number: '03',
            title: 'Alerts in Emergencies',
            image: '/bloomy/Alerts in Emergencies.png',
            desc: 'Critical sounds — fire alarms, car horns, someone calling a name — are detected and surfaced through haptic and visual alerts.',
        },
        {
            number: '04',
            title: 'Small Interactions',
            image: '/bloomy/Small Interactions.png',
            desc: 'Subtle wrist-based gestures allow users to confirm, dismiss, or respond without drawing attention or requiring precise touch on a small screen.',
        },
        {
            number: '05',
            title: "Caregiver's Ways",
            image: "/bloomy/Caregiver's Ways.png",
            desc: 'Designed to reduce reliance on caregivers by giving users the confidence and tools to navigate daily conversations independently.',
        },
    ];

    const hardwareFeatures = [
        {
            title: 'Bezel Display',
            desc: 'The direction and intensity of the sound are displayed along the bezel ring, giving an at-a-glance spatial understanding of the audio environment.',
        },
        {
            title: 'Micro Projector',
            desc: 'Text is projected onto the back of the hand, enabling discreet reading of transcribed conversations without looking away from the speaker.',
        },
        {
            title: 'Motion Sensor',
            desc: 'Detects sub-threshold wrist gestures to enable small interactions and context inference without requiring deliberate input.',
        },
        {
            title: 'Depth Sensor',
            desc: 'Maps the back of the hand for accurate micro-projection alignment, even during movement.',
        },
        {
            title: '4-Way Microphone',
            desc: 'Analyzes the intensity and direction of the sound, enabling spatial audio awareness and directional alerts.',
        },
    ];

    const appScreens = [
        {
            title: 'Home',
            image: '/bloomy/Home.png',
            desc: 'You can review your name and all previous conversations at a glance.',
        },
        {
            title: 'Bloom Your Name',
            image: '/bloomy/Bloom Your Name.png',
            desc: 'Begins the system and sets nicknames — you are called or set triggers that activate automatically.',
        },
        {
            title: 'Bloom Your Friend',
            image: '/bloomy/Bloom Your Friend.png',
            desc: 'Tap your friends using voice recognition to store and retrieve conversations.',
        },
    ];

    return (
        <div
            className={`w-full min-h-screen p-8 mt-12 md:mt-0 mx-auto bloomy-page${isDark ? ' bloomy-dark' : ''}`}
            style={{ backgroundColor: isDark ? '#353535' : '#ffffff', color: isDark ? '#f0f0f0' : '#000000', transition: 'background-color 0.7s ease, color 0.7s ease' }}
        >
            {/* Header / Navigation */}
            <header className="mb-16">
                <Link
                    to="/"
                    className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
                >
                    ← Back to Projects
                </Link>
                <h1 className="title mb-2">
                    Bloomy
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl mb-2">
                    Universal Wearable Device Project, 2023
                </p>
            </header>

            {/* Main Image */}
            <section className="mb-12">
                <div className="w-full max-w-7xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                    <img src="/thumbnail/6.png" alt="Bloomy Wearable Experience" className="w-full h-full object-cover" />
                </div>

                {/* Overview & Mission */}
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-24 lg:gap-24 items-top mb-12">
                    <div>
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 mb-1">Category</span>
                                Personal Project
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Duration</span>
                                4 Weeks
                            </li>

                            <li>
                                <span className="block text-gray-400 mb-1">Target</span>
                                People who are deaf or have difficulty in communication
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                Bloomy is a smartwatch and service designed for individuals who are deaf or have difficulty in communication. The goal is to provide appropriate communication methods that can help relieve the psychological burden felt during conversations.
                            </p>
                            <p>
                                The psychological pressure felt during conversations — the fear of mishearing, the reliance on caregivers, the avoidance of social situations — informed every design decision in Bloomy.
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* "I focused on" Section */}
            <section ref={focusedSectionRef} className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-lg mb-4 text-black">I focused on</h2>
                        <h2 className="text-2xl md:text-3xl font-normal leading-tight text-black">
                            • Universal wearable design
                            <br />
                            • Context-aware translation
                            <br />
                            • Proactive emergency interactions
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                I explored how a wearable could serve as a universal communication bridge rather than a single-purpose device. I focused on how spatial audio sensing, micro-projection, and haptic feedback could work together to create a seamless layer of awareness — letting users stay present in their physical environment while receiving the context they need.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Section with animated charts */}

            <ResearchSection />

            {/* Stakeholders Map */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Stakeholders Map</p>
                <div className="w-full mb-12 overflow-hidden">
                    <img src="/bloomy/Stakeholders Map.png" alt="Stakeholders Map" className="w-full h-full object-contain" />
                </div>
                {/* 4-column stakeholder text */}
                <div className="grid grid-cols-2 dt:grid-cols-4 gap-8">
                    {[
                        {
                            title: 'Family',
                            items: [
                                'Concern about other individuals',
                                'Burden regarding help, education, livelihood, and care',
                                'Temporary stability from assistants',
                                'Direct dependence on the individual with hearing loss',
                            ],
                        },
                        {
                            title: 'Friends',
                            items: [
                                'Tension and fear about conversations',
                                'Inconvenience about the disability itself',
                            ],
                        },
                        {
                            title: 'Unfamiliar Environment',
                            items: [
                                'Tension and fear about conversations',
                                'Shame in not knowing to disclose the disability',
                            ],
                        },
                        {
                            title: 'Personal Care Assistant',
                            items: [
                                'Temporary help provided',
                                'Burden regarding unfamiliar individuals',
                            ],
                        },
                    ].map((col) => (
                        <div key={col.title}>
                            <h3 className="text-base font-normal text-black mb-4">{col.title}</h3>
                            <ul className="space-y-2">
                                {col.items.map((item) => (
                                    <li key={item} className="text-sm text-gray-500 leading-relaxed flex gap-2">
                                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-gray-400 inline-block" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Empathy Insight */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Empathy Insight</p>
                {/* 4-column insight cards with individual images */}
                <div className="grid grid-cols-2 dt:grid-cols-4 gap-8">
                    {[
                        {
                            label: 'Shame',
                            image: '/bloomy/Shame.png',
                            desc: 'Reluctance to reveal the disability to others.',
                        },
                        {
                            label: 'Fear',
                            image: '/bloomy/Fear.png',
                            desc: 'Experiences difficulty understanding certain situations and contexts.',
                        },
                        {
                            label: 'Tension, Burden',
                            image: '/bloomy/Tension, Burden.png',
                            desc: 'Feels extreme tension and pressure in moments when conversation is necessary.',
                        },
                        {
                            label: 'Need for a Caregiver',
                            image: '/bloomy/Need for a Caregiver.png',
                            desc: 'Wants to live independently but encounters moments when a caregiver is needed.',
                        },
                    ].map((card) => (
                        <div key={card.label}>
                            <div className="w-25% aspect-square mb-4 overflow-hidden flex items-center justify-center">
                                <img src={card.image} alt={card.label} className="w-10% h-10% object-contain" />
                            </div>
                            <h3 className="text-base font-normal mb-2" style={{ color: KEY_COLOR }}>{card.label}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HMW */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">HMW</p>
                <p className="text-2xl md:text-3xl font-normal leading-relaxed text-black max-w-4xl">
                    How can we provide a{' '}
                    <span style={{ color: KEY_COLOR }}>Universally accessible</span>{' '}
                    solution that offers communication{' '}
                    <span style={{ color: KEY_COLOR }}>Context and situations</span>{' '}
                    via text,{' '}
                    <span style={{ color: KEY_COLOR }}>Alerts in emergencies</span>,
                    and enables discreet{' '}
                    <span style={{ color: KEY_COLOR }}>Small interactions</span>,
                    similar to a{' '}
                    <span style={{ color: KEY_COLOR }}>Caregiver's ways</span>?
                </p>
            </section>

            {/* Concept Mapping */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Concept Mapping</p>
                    <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black max-w-2xl">
                        Five pillars that guided every design decision
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 dt:grid-cols-3 gap-x-12 gap-y-12">
                    {concepts.map((c) => (
                        <div key={c.number} className="flex flex-col gap-3">
                            <div className="w-full bg-gray-50 mb-2">
                                <img src={c.image} alt={c.title} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-gray-300 text-sm font-mono">{c.number}</span>
                            <h3 className="text-xl font-normal text-black">{c.title}</h3>
                            <p className="text-gray-500 text-base leading-relaxed">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Work Flow */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Work Flow</p>
                <div className="w-full">

                    <img src="/bloomy/Work Flow.png" alt="Work Flow Diagram" className="w-full h-full object-contain" />
                </div>
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-24 lg:gap-24 items-top mb-16">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Smart Watch + Application
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Bloomy operates as two interconnected layers: a wearable that passively senses the audio environment and surfaces contextual alerts, paired with a companion app that manages contacts, transcriptions, and personalized trigger settings.
                            </p>
                            <p>
                                The two components communicate in real-time — the watch detects and acts immediately, while the app stores, reviews, and configures the experience for the user's specific needs.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Product Hardware */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Product</p>
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-24 lg:gap-24 items-top mb-16">
                    <div className="w-full">
                        <img src="/bloomy/Product.png" alt="Product Hardware Render" className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-12">
                        {hardwareFeatures.map((feat) => (
                            <div key={feat.title}>
                                <h3 className="text-xl font-normal text-black mb-3">{feat.title}</h3>
                                <p className="text-gray-500 text-base leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Application</p>
                    <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black max-w-2xl">
                        A companion app designed around hearing loss
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                    {appScreens.map((screen) => (
                        <div key={screen.title} className="flex flex-col gap-4">
                            <div className="w-full aspect-[9/16] overflow-hidden">
                                <img src={screen.image} alt={screen.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-normal text-black mb-2">{screen.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{screen.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Conversation / Inclusivity */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Expectation</p>
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-24 lg:gap-24 items-top">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Enabling equal participation in conversation
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Bloomy keeps users with hearing loss engaged in important meetings and discussions by focusing on face-to-face communication rather than taking notes or using a laptop. When everyone can use this tool, it breaks down the barriers between the majority and the minority, creating a more inclusive space for communication.
                            </p>
                            <p>
                                Furthermore, it helps those without disabilities engage with greater empathy — understanding the context and intensity of every exchange, not just the words.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <img src="/bloomy/Expectation.png" alt="Expectation — in-use scenario" className="w-full h-full object-contain" />
                </div>
            </section>



            {/* Footer */}
            <Footer />
        </div>
    );
};
