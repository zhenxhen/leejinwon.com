import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { LinkCard } from '../LinkCard';

export const SamsungClock: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">
            {/* Header / Navigation */}
            <header className="mb-16">
                <Link
                    to="/"
                    className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
                >
                    ← Back to Projects
                </Link>
                <h1 className="title mb-6">
                    Samsung Clock
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl">
                    Clock App, 2024
                </p>
            </header>

            {/* Main Image */}
            <div className="w-full max-w-7xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                {/* Placeholder for now, can use the thumbnail or a detail image */}
                <img src="/thumbnail/4.png" alt="Efficient Daily Experiences" className="w-full h-full object-cover" />
            </div>

            {/* Introduction */}
            <section className="mb-12">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-24 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 mb-1">Role</span>
                                UX UI Designer
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Duration</span>
                                3 Weeks
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Company</span>
                                Samsung Electronics
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Participants</span>
                                Teams of 2 designers
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                The Samsung Clock redesign for One UI focused on expanding the app beyond a simple alarm tool — exploring how grouped alarms, unified time-tracking interactions, and a richer world clock experience could together elevate everyday time management into something more intuitive and effortless.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* "I focused on" Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-lg mb-4 text-gray-400">I focused on</h2>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black">
                            • Grouped alarm management
                            <br />
                            • Unified time-tracking interactions
                            <br />
                            • A richer world clock experience
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                I explored how the Clock app could grow beyond a single-purpose alarm tool into a genuine time management companion. I focused on how grouping alarms, unifying the stopwatch and timer with a shared visual language, and enriching the world clock with live geography and weather context could together make everyday time management more intuitive and effortless.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1: Alarm Group */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-24 items-center mb-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Discovering the Alarm Group Experience
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                We explored how grouping alarms together could simplify daily management at a glance. By uncovering diverse real-life scenarios — morning calls, routines, and shift work — we designed a flexible grouping system that lets users organise and control multiple alarms as a single unit, reducing friction and mental overhead.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <img src="/clock/clock1.png" alt="Alarm group experience with Morning Call and Workout groups" className="w-full h-full object-contain" />
                    </div>
                </div>
            </section>

            {/* Content Section 2: Time Management */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-24 items-center mb-4">
                    <div className="overflow-hidden md:order-1">
                        <img src="/clock/clock2.png" alt="Stopwatch and timer with unified visual language and lap history" className="w-full h-full object-contain" />
                    </div>
                    <div className="md:order-2">
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            A Unified Time Management Experience
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                We unified the visual language of the stopwatch and timer, giving both features a consistent circular dial metaphor and shared interaction patterns. Combined with history tracking, users can review their sessions at a glance — turning time management into a genuine productivity tool rather than a series of disconnected utilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 3: World Clock */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-24 items-center mb-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            A More Informative World Clock
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                We enriched the World Clock experience by integrating a live map backdrop alongside real-time weather information for each city. Rather than showing time alone, users can now take in geography, climate, and time zone differences together — making it easier to stay connected across borders and plan conversations with people around the world.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <img src="/clock/clock3.png" alt="World clock with map background and real-time weather for Seoul and London" className="w-full h-full object-contain" />
                    </div>
                </div>
            </section>


            {/* Outcome Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <h2 className="text-lg mb-4 text-gray-400">Outcome</h2>
                    <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-12 max-w-4xl">

                        Driving Global Market Leadership and Unprecedented Commercial Success
                    </h2>

                    <div className="grid grid-cols-1 dt:grid-cols-3 gap-4 lg:gap-24 items-top mb-16">
                        <div>
                            <span className="block text-2xl md:text-4xl  mb-4 text-black">50% Higher Sales</span>
                            <p className="project-description text-gray-600">
                                Achieved a 50% surge in overall sales through optimized market strategies and enhanced product value.
                            </p>
                        </div>
                        <div>
                            <span className="block text-2xl md:text-4xl  mb-4 text-black">26% User Increased</span>
                            <p className="project-description text-gray-600">
                                Successfully expanded the active user base by 26% through intuitive UI improvements and new core features.
                            </p>
                        </div>
                        <div>
                            <span className="block text-2xl md:text-4xl  mb-4 text-black">On-device AI Integrated</span>
                            <p className="project-description text-gray-600">
                                Pioneered a more secure and responsive experience by integrating cutting-edge on-device AI capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews / Mentions Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-16">
                    Reviews
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-4 items-top mb-16">
                    <LinkCard
                        url="https://www.youtube.com/watch?v=iG9hlsIhNMg"
                        title="Samsung One UI 7 Update - EVERY New Feature!"
                        description="Here is LITERALLY every, single, brand-new Samsung Galaxy One UI 7 feature! Including a bunch of features that everyone else missed!"
                        image="https://img.youtube.com/vi/iG9hlsIhNMg/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://www.youtube.com/watch?v=Ps_dMLIpO6c&t=43s"
                        title="Top Features YOU HAVE TO KNOW!!"
                        description="Explore redesigned widgets, enhanced lock screen functionality with live activities, and customized app icon styles. Hayls World also highlights improved gallery editing tools and new camera settings for a more personalized mobile experience."
                        image="https://img.youtube.com/vi/Ps_dMLIpO6c/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://www.youtube.com/watch?v=NRrpWbGdXEw"
                        title="The One UI 7 Features Everyone Missed!"
                        description="Here is LITERALLY every, single, brand-new Samsung Galaxy One UI 7 feature! Including a bunch of features that everyone else missed!"
                        image="https://img.youtube.com/vi/NRrpWbGdXEw/maxresdefault.jpg"
                        source="youtube.com"
                    />

                </div>
            </section>


            {/* Footer */}
            <Footer />

        </div>
    );
};
