import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

const TrendChart: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const sectionRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const data = [
        { year: '2017', global: 3.4, community: 2.7 },
        { year: '2018', global: 3.7, community: 3.1 },
        { year: '2019', global: 4.1, community: 3.5 },
        { year: '2020', global: 4.5, community: 3.9 },
        { year: '2021', global: 4.9, community: 4.2 },
        { year: '2022', global: 5.3, community: 4.6 },
        { year: '2023', global: 5.4, community: 4.9 },
        { year: '2024', global: 5.5, community: 5.1 },
    ];

    const maxVal = 6;
    const chartHeight = 240;
    const chartWidth = 500;
    const paddingX = 30;
    const stepX = (chartWidth - paddingX * 2) / (data.length - 1);

    const getY = (val: number) => chartHeight - (val / maxVal) * chartHeight;
    const getX = (index: number) => paddingX + index * stepX;

    const pathD = `M ${data.map((d, i) => `${getX(i)},${getY(d.global)}`).join(' L ')}`;

    return (
        <div ref={sectionRef} className="w-full flex items-top justify-top h-full pt-8 lg:pt-0">
            <div className="w-full max-w-xl">
                <h3 className="text-2xl font-normal text-black mb-8">Online User Growth Trend (Billions)</h3>

                <div className="flex gap-8 mb-10 text-xs font-medium tracking-widest text-gray-400">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                        <span>Global Internet</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-gray-200"></span>
                        <span>Online Community</span>
                    </div>
                </div>

                <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]" style={{ fontFamily: 'inherit' }}>
                    <svg viewBox={`-10 -20 ${chartWidth + 20} ${chartHeight + 50}`} className="w-full h-full overflow-visible">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5, 6].map(val => (
                            <g key={val}>
                                <text x="0" y={getY(val)} dominantBaseline="middle" fill="#d1d5db" fontSize="11">{val}</text>
                                <line x1="20" y1={getY(val)} x2={chartWidth} y2={getY(val)} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                            </g>
                        ))}

                        {/* Bars */}
                        {data.map((d, i) => {
                            const barHeight = (d.community / maxVal) * chartHeight;
                            const yPos = chartHeight - barHeight;
                            return (
                                <g key={`bar-${i}`}>
                                    <rect
                                        x={getX(i) - 14}
                                        y={isVisible ? yPos : chartHeight}
                                        width="28"
                                        height={isVisible ? barHeight : 0}
                                        fill="#e5e7eb"
                                        rx="2"
                                        className="transition-all duration-1000 ease-out"
                                        style={{ transitionDelay: `${i * 100}ms` }}
                                    />
                                    <text
                                        x={getX(i)}
                                        y={isVisible ? yPos - 8 : chartHeight}
                                        textAnchor="middle"
                                        fill="#9ca3af"
                                        fontSize="10"
                                        className="transition-all duration-1000 ease-out opacity-0 pointer-events-none"
                                        style={{ transitionDelay: `${i * 100 + 400}ms`, opacity: isVisible ? 1 : 0 }}
                                    >
                                        {d.community.toFixed(1)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Line Chart */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-[1500ms] ease-in-out"
                            strokeDasharray="2000"
                            strokeDashoffset={isVisible ? 0 : 2000}
                        />

                        {/* Line Points */}
                        {data.map((d, i) => (
                            <g key={`point-${i}`} className="transition-all duration-500 ease-out" style={{ transitionDelay: `${1200 + i * 100}ms`, opacity: isVisible ? 1 : 0, transform: `scale(${isVisible ? 1 : 0})`, transformOrigin: `${getX(i)}px ${getY(d.global)}px` }}>
                                <circle
                                    cx={getX(i)}
                                    cy={getY(d.global)}
                                    r="4"
                                    fill="#000000"
                                />
                                <text
                                    x={getX(i)}
                                    y={getY(d.global) - 12}
                                    textAnchor="middle"
                                    fill="#000000"
                                    fontWeight="500"
                                    fontSize="11"
                                >
                                    {d.global.toFixed(1)}
                                </text>
                            </g>
                        ))}

                        {/* X Axis Labels */}
                        {data.map((d, i) => (
                            <text key={`label-${i}`} x={getX(i)} y={chartHeight + 24} textAnchor="middle" fill="#9ca3af" fontSize="11" opacity={isVisible ? 1 : 0} className="transition-opacity duration-1000" style={{ transitionDelay: `${i * 100}ms` }}>
                                {d.year}
                            </text>
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

const ResearchSection: React.FC = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const sectionRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const stats = [
        { label: 'Verbal Abuse', value: 49.7, color: 'bg-black' },
        { label: 'Stalking', value: 17.7, color: 'bg-gray-600' },
        { label: 'Sexual Violence', value: 8.3, color: 'bg-gray-400' },
        { label: 'Other', value: 24.3, color: 'bg-gray-200' },
    ];

    return (
        <section ref={sectionRef} className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
                The Violence of Language
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-top">
                <div className="w-full">
                    <h3 className="text-2xl font-normal text-black mb-8">The proportion of cyberbullying cases.</h3>
                    <p className="text-gray-500 mb-10 text-lg">
                        The rise of social media has transformed language use, with anonymity fostering malicious comments. Verbal abuse accounts for nearly half of all cyberbullying cases globally.
                    </p>
                    <div className="space-y-6">
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="group relative">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">{stat.label}</span>
                                    <span className="text-black">{isVisible ? stat.value : 0}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                                        style={{
                                            width: isVisible ? `${stat.value}%` : '0%',
                                            transitionDelay: `${i * 150}ms`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-full h-full">
                    <TrendChart />
                </div>
            </div>
        </section>
    );
};

export const Review: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">
            {/* Header / Navigation */}
            <header className="mb-8">
                <Link
                    to="/"
                    className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
                >
                    ← Back to Projects
                </Link>
                <h1 className="title mb-2">
                    REVIEW
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl">
                    AI Computing Project, 2025
                </p>
            </header>

            {/* Main Video & Overview (Vertical 2-Column Layout) */}
            <section className="layout-vertical-media">
                <div className="layout-vertical-media-left">
                    <div style={{ padding: '140% 0 0 0', position: 'relative' }}>
                        <iframe
                            src="https://player.vimeo.com/video/1182372948?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=1"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            title="REVIEW"
                        ></iframe>
                    </div>
                </div>

                <div className="layout-vertical-media-right">
                    <div className="mb-12">
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 tracking-wider mb-1 ">Medium</span>
                                AI Generated Text, Wearable Installation
                            </li>
                            <li>
                                <span className="block text-gray-400 tracking-wider mb-1 ">Year</span>
                                2025
                            </li>
                            <li>
                                <span className="block text-gray-400 tracking-wider mb-1 ">Tools</span>
                                SBC, Large Language Model, Thermal Printer, Camera
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                REVIEW is an AI-driven creative computing installation that uses a camera and printer to display distorted, negative language, critiquing harmful online comments and highlighting the impact of language on perception.
                            </p>
                            <p>
                                The motivation emerged from observing how rapidly online language environments have expanded. Despite its scale and impact, verbal violence is often dismissed as intangible or temporary, protected by anonymity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Relocating Online Language
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                Drawing from the idea of linguistic relativity (the Sapir-Whorf Hypothesis), the work focuses on the accumulation of negative, hostile, and distorted language that circulates widely in online environments.
                            </p>
                            <p>
                                By relocating online language into a physical, face-to-face context, the work highlights the tension between digital speech and its real-world consequences, transforming volatile keywords into a continuous printed form.
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-full">
                        <img src="/REVIEW/01.jpg" alt="Review Installation Wearable" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Interactive Research Section */}
            <ResearchSection />

            {/* Content Section 2 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div className="w-full h-full md:order-1 flex items-top justify-top">
                        <img src="/REVIEW/02.jpg" alt="Hardware System Close-up" className="w-full h-full object-cover" />
                    </div>
                    <div className="md:order-2">
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Real-time AI System
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                The work is constructed as an integrated system composed of AI-generated text, a camera, a compact thermal printer, and a single-board computer operating together as a continuous real-time loop.
                            </p>
                            <p>
                                A camera captures a first-person view, which is processed by an AI system trained on hostile online discourse. Rather than describing scenes objectively, the system outputs slang-heavy, condescending internet vernacular directly to the thermal printer in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            <section className="mb-32 -mx-8 px-8 md:mx-0 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    <div className="w-full aspect-3:4 md:aspect-[3/4] overflow-hidden">
                        <img src="/REVIEW/03.jpg" alt="Process documentation 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full aspect-3:4 md:aspect-[3/4] overflow-hidden">
                        <img src="/REVIEW/04.jpg" alt="Process documentation 2" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full aspect-3:4 md:aspect-[3/4] overflow-hidden">
                        <img src="/REVIEW/05.jpg" alt="Process documentation 3" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Publications */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
                    Publications
                </h2>
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div className="group">
                        <h3 className="text-xl text-black mb-4">Magazine & Interview</h3>
                        <p className="text-lg leading-relaxed">
                            <a target="_blank" href="https://neural.it/2026/01/review-embodying-hostile-language/" className="link-underline">Neural Magazine, Italy (2025)</a>
                            <br />
                            <a target="_blank" href="https://www.art-magazine.ai/edition/number-three" className="link-underline">AI Art Magazine, Germany (2026)</a>
                            <br />
                            <a target="_blank" href="https://nordsyncproject.com/online-seminar-10/" className="link-underline">NordSync Project, Norway (2026)</a>
                        </p>
                    </div>
                    <div className="group">
                        <h3 className="text-xl text-black mb-4">Exhibition</h3>
                        <p className="text-lg leading-relaxed">
                            <a target="_blank" href="https://load-gallery.com/exhibitions/global-fusion-barcelona" className="link-underline">Global Fusion Barcelona, Spain (2026)</a>
                            <br />
                            <a target="_blank" href="https://interplay-cci.co.uk/" className="link-underline">Interplay, UK (2026)</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
