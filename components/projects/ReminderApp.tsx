import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

export const ReminderApp: React.FC = () => {
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
                    Efficient Daily Experiences
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl">
                    Reminder App, 2025
                </p>
            </header>

            {/* Main Image */}
            <div className="w-full max-w-4xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                {/* Placeholder for now, can use the thumbnail or a detail image */}
                <img src="/Personal/tumbnail/1.png" alt="Efficient Daily Experiences" className="w-full h-full object-cover" />
            </div>

            {/* Introduction */}
            <section className="mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="col-span-1">
                        <h2 className="subtitle text-gray-400 mb-8">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Role</span>
                                UX UI Designer
                            </li>
                            <li>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                                3 Weeks
                            </li>
                            <li>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Tools</span>
                                Figma, Protopie
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="subtitle text-gray-400 mb-8">Challenge & Solution</h2>
                        <div className="subtitle text-gray-600 space-y-6">
                            <p>
                                Managing daily tasks can often feel overwhelming. The challenge was to create a reminder app that is not just functional but also intuitive and seamlessly integrated into the user's daily flow.
                            </p>
                            <p>
                                The solution involves a streamlined interface that prioritizes quick entry and clear visualization of tasks. By utilizing smart categorization and context-aware notifications, the app reduces cognitive load and helps users stay focused on what matters.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Intuitive Entry
                        </h2>
                        <p className="text-lg text-gray-600">
                            We designed a quick-add interface that allows users to create reminders with natural language processing. Just type "Meeting with John tomorrow at 2pm" and the app sets it all up for you.
                        </p>
                    </div>
                    <div className="aspect-[4/3] bg-gray-50">
                        {/* Image Placeholder */}
                    </div>
                </div>
            </section>

            {/* Content Section 2 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="aspect-[4/3] bg-gray-50 md:order-1">
                        {/* Image Placeholder */}
                    </div>
                    <div className="md:order-2">
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Context Aware
                        </h2>
                        <p className="text-lg text-gray-600">
                            Reminders shouldn't just be about time. We introduced location-based triggers and priority sorting to ensure users get the right nudge at the right moment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
