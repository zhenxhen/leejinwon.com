import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { LinkCard } from '../LinkCard';

export const SamsungCalendar: React.FC = () => {
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
                <h1 className="title mb-2">
                    Samsung Calendar
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl mb-2">
                    Galaxy One UI, 2025
                </p>
            </header>

            {/* Main Image */}
            <section className="mb-12">
                <div className="w-full max-w-7xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                    <img src="/thumbnail/2.png" alt="Efficient Planning Experience" className="w-full h-full object-cover" />
                </div>

                {/* Overview & Mission */}
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
                                6 months
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Company</span>
                                Samsung Electronics
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Participants</span>
                                Teams of 3 designers
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                The Samsung Calendar redesign for One UI focused on making shared planning intuitive, leveraging on-device AI to understand user intent, and simplifying the overall experience so staying organised feels effortless in daily life.
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
                            • On-device AI based on user intent
                            <br />
                            • Exploration of sharing experiences
                            <br />
                            • Usability improvement
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                I explored how sharing a schedule could feel as natural as a conversation, rather than a transaction. I also investigated how on-device AI could interpret what a user actually wants — not just what they typed — and surface it at the right moment. Throughout, I questioned every interaction point to ask whether it was truly simple or just familiar.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1: On-device AI */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            On-Device AI Based on Usage Patterns
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We added an AI-driven scheduling suggestion feature that learns from each user's behavioural patterns — such as recurring routines, frequently visited locations, and preferred time slots. Rather than relying on what the user types, the system proactively surfaces relevant event suggestions based on how they actually use the app.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/Calendar/Calendar1.png" alt="On-device AI scheduling suggestion" className="w-full h-full object-contain" />
                </div>
            </section>

            {/* Content Section 2: Shared Calendar */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Shared Calendar Experience
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We redesigned the shared calendar experience to make collaborative planning effortless. Users can create a shared calendar, invite others via a link, and manage permissions — all within a few taps. The new flow removes the friction of coordinating with others, so managing shared schedules feels as natural as managing a personal one.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/Calendar/Calendar2.png" alt="Shared calendar management" className="w-full h-full object-contain" />
                </div>
            </section>

            {/* Content Section 3: View Types */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Multiple Views and Interactions for Every Tempo
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Not everyone plans the same way. We introduced multiple view types — from a broad monthly overview to a focused daily timeline — so users can switch between perspectives depending on how they want to engage with their schedule. The goal was to give each person the right level of detail, at the right moment.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/Calendar/Calendar3.png" alt="Multiple calendar view types" className="w-full h-full object-contain" />
                </div>
            </section>

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
                        url="https://www.youtube.com/watch?v=jJQ_RP9BMck"
                        title="Calendar App Gets Super Useful Features"
                        description="Samsung is completely revamping the Calendar app in One UI 7, bringing a fresh design and smarter AI features to your daily planning."
                        image="https://img.youtube.com/vi/jJQ_RP9BMck/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://www.youtube.com/watch?v=cy32-KmX638"
                        title="Calendar Tips You NEED to Know To BOOST Productivity"
                        description="Shighlights the most powerful new features in the Samsung Calendar app with One UI 7 and 8."
                        image="https://img.youtube.com/vi/cy32-KmX638/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://www.youtube.com/watch?v=GvUpJwGUqjw"
                        title="Samsung Calendar & Reminder App Gets a Major Upgrade in One UI 7"
                        description="Samsung is completely revamping the Calendar and Reminder app in One UI 7, bringing a fresh design and smarter AI features to your daily planning."
                        image="https://img.youtube.com/vi/GvUpJwGUqjw/maxresdefault.jpg"
                        source="youtube.com"
                    />

                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
