import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { LinkCard } from '../LinkCard';

export const SamsungReminder: React.FC = () => {
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
                    Samsung Reminder
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl mb-2">
                    Galaxy One UI, 2025
                </p>
            </header>

            {/* Main Image */}
            <section className="mb-12">
                <div className="w-full max-w-7xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                    {/* Placeholder for now, can use the thumbnail or a detail image */}
                    <img src="/thumbnail/1.png" alt="Efficient Daily Experiences" className="w-full h-full object-cover" />
                </div>

                {/* Overview & Motivation */}
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 mb-1">Role</span>
                                UX Designer
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
                                Teams of 2 designers
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                Galaxy One UI Reminder project focuses on making daily life easier by turning the smartphone into a smart, proactive assistant. By using on-device AI and an intuitive category system, we created a seamless experience that help users stay productive and organized with minimal effort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-lg mb-4">I focused on</h2>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black">
                            • On-device-AI based on user intent
                            <br />
                            • Experience in task classification
                            <br />
                            • Enhancement of productivity experience
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Set goals to enhance productivity within the Galaxy ecosystem and worked towards creating a smarter user experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Content Section 1 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black">
                            AI Contextual Reminder
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                By leveraging on-device AI, the app understands the user's daily life and proactively recommends reminders that fit the specific context of their routine.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[70%] mx-auto overflow-hidden mb-8">
                    <img src="/Reminder/Reminder.png" alt="AI Context Reminder" className="w-full h-auto block" />
                </div>
            </section>

            {/* Content Section 2 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Category System
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We developed a new category system from the ground up, creating a framework that allows users to efficiently classify and manage their tasks based on their specific purposes and needs.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-[70%] mx-auto overflow-hidden mb-8">
                    <img src="/Reminder/Reminder2.png" alt="Category System" className="w-full h-auto block" />
                </div>
            </section>

            {/* Outcome Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <h2 className="text-lg mb-4 text-black">Outcome</h2>
                    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-12 max-w-4xl">

                        Driving Global Market Leadership and Unprecedented Commercial Success
                    </h2>

                    <div className="grid grid-cols-1 dt:grid-cols-3 gap-4 lg:gap-24 items-top mb-16">
                        <div>
                            <span className="block text-4xl mb-4 text-black">50% Higher Sales</span>
                            <p className="project-description text-gray-600">
                                Achieved a 50% surge in overall sales through optimized market strategies and enhanced product value.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">26% User Increased</span>
                            <p className="project-description text-gray-600">
                                Successfully expanded the active user base by 26% through intuitive UI improvements and new core features.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">On-device AI Integrated</span>
                            <p className="project-description text-gray-600">
                                Pioneered a more secure and responsive experience by integrating cutting-edge on-device AI capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Publications */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
                    Reviews
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-4 items-top mb-16">
                    <LinkCard
                        url="https://www.youtube.com/watch?v=O2F1jaHl13c"
                        title="One UI 7 Reminder App Overhaul!"
                        description="Samsung is completely changing the Reminder app in the upcoming One UI 7 update. Here's a firsthand look at the new UI and AI features."
                        image="https://img.youtube.com/vi/O2F1jaHl13c/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://www.youtube.com/watch?v=DKPWccM3Nzc&t=2s"
                        title="How to Use Reminder App"
                        description="Samsung Reminder for over two years now and I think it is the best reminder app right now."
                        image="https://img.youtube.com/vi/DKPWccM3Nzc/maxresdefault.jpg"
                        source="youtube.com"
                    />
                    <LinkCard
                        url="https://tech.yahoo.com/apps/articles/samsung-reminder-ultimate-app-galaxy-160015369.html"
                        title="The Ultimate App for Galaxy Users"
                        description=" Samsung Reminder has been my go-to for the past year, and after the recent One UI 8 update, it has only gotten better."
                        image="https://s.yimg.com/ny/api/res/1.2/LXsCXQD41fErEwcdqLzXQA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xMzUw/https://media.zenfs.com/en/how_to_geek_999/29c0da602fc6e207e5ba954b8e323897"
                        source="tech.yahoo.com"
                    />
                    <LinkCard
                        url="https://www.makeuseof.com/samsung-made-reminder-app-even-better/"
                        title="Samsung Made Its Reminder App Even Better"
                        description="Samsung has made its Reminder app even better with the One UI 8 update, adding new features and improving the user experience."
                        image="https://static0.makeuseofimages.com/wordpress/wp-content/uploads/wm/2025/10/samsung-reminder-app-open-a-galaxy-z-flip-6-kept-on-a-logi-mx-mini-keyboard.jpg?q=70&fit=crop&w=1600&h=900&dpr=1"
                        source="makeuseof.com"
                    />
                    <LinkCard
                        url="https://sammyguru.com/samsungs-reminder-app-gets-a-fresh-look-with-ui-overhaul-in-one-ui-8/"
                        title="Fresh Look with UI Overhaul in One UI 8"
                        description="One UI 8’s Reminder app is already here, with a huge overhaul"
                        image="https://sammyguru.com/wp-content/uploads/2024/12/IMG_0149-scaled.jpeg"
                        source="sammyguru.com"
                    />
                    <LinkCard
                        url="https://galaxystore.samsung.com/detail/com.samsung.android.app.reminder?langCd=tr"
                        title="Samsung Reminder"
                        description="Samsung’s Reminder app has been completely redesigned with a fresh new look and feel, bringing a more modern and intuitive user experience."
                        image="https://www.sammyfans.com/wp-content/uploads/2024/11/Samsung-Reminder-One-ui-7-icon-1000x576.jpg"
                        source="galaxystore"
                    />
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
