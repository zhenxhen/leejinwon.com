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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mt-12">
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
                                The Samsung Calendar project for One UI 7.0 was driven by the goal of transforming a static utility into a dynamic planning companion. We focused on streamlining schedule management through intuitive visual hierarchies and smarter event creation.
                            </p>
                            <p>
                                By leveraging intelligent algorithms and a cleaner design language, our mission was to ensure that users can navigate their complex schedules with absolute clarity while staying seamlessly connected across the Galaxy ecosystem.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* "I focused on" Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <div>
                        <h2 className="text-lg mb-4 text-black">I focused on</h2>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Intelligent scheduling assistance
                            <br />
                            Unified visual language for clarity
                            <br />
                            Seamless cross-device synchronization
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We prioritized the integration of AI-driven insights to help users manage their time more effectively, while ensuring the interface remained minimalist and focused on core content.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1: Intelligent Entry */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Intelligent Event Creation
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We redefined the event entry process by implementing natural language recognition. Users can now simply speak or type complex requests, and the app automatically populates time, location, and participants.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[70%] mx-auto overflow-hidden mb-8 bg-gray-50 aspect-video">
                    {/* Placeholder for feature image */}
                </div>
            </section>

            {/* Content Section 2: Unified View */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Unified Ecosystem Planning
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                The new calendar integrates deeply with Reminders and Galaxy AI to provide a holistic view of the user's day. It serves as the central hub for all time-sensitive tasks across all Galaxy devices.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[70%] mx-auto overflow-hidden mb-8 bg-gray-50 aspect-video">
                    {/* Placeholder for feature image */}
                </div>
            </section>

            {/* Outcome Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <h2 className="text-lg mb-4 text-black">Outcome</h2>
                    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-12 max-w-4xl">
                        Empowering Users with Frictionless Planning and Seamless Connectivity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        <div>
                            <span className="block text-4xl mb-4 text-black">40% Faster Entry</span>
                            <p className="project-description text-gray-600">
                                Implementation of natural language processing reduced the time required to create complex events by 40%.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">15% Higher Engagement</span>
                            <p className="project-description text-gray-600">
                                The streamlined UI and intelligent suggestions led to a 15% increase in weekly active users within the target demographic.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">30% AI-Assisted</span>
                            <p className="project-description text-gray-600">
                                Over 30% of all events were created using intelligent assistant features, highlighting high adoption of AI capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews / Mentions Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
                    Reviews
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <LinkCard
                        url="https://www.youtube.com/watch?v=O2F1jaHl13c"
                        title="One UI 7 Calendar Overhaul!"
                        description="A firsthand look at how Samsung is transforming the Calendar app with smarter AI integrations."
                        image="https://img.youtube.com/vi/O2F1jaHl13c/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    {/* Add more cards here as needed */}
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
