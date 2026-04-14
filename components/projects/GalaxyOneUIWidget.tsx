import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';
import { LinkCard } from '../LinkCard';

export const GalaxyOneUIWidget: React.FC = () => {
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
                    Galaxy One UI Widget
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl mb-2">
                    Galaxy One UI, 2024
                </p>
            </header>

            {/* Main Image */}
            <section className="mb-12">
                <div className="w-full max-w-7xl mx-auto aspect-video bg-gray-100 mb-16 overflow-hidden">
                    <video
                        src="/widget/main_widget.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Overview & Mission */}
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 mb-1">Role</span>
                                UX UI Designer
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Duration</span>
                                4 months
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Company</span>
                                Samsung Electronics
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Participants</span>
                                Teams of 4 designers
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                The Galaxy One UI Widget project aimed to transform the home screen into a more active and personalized control space. The mission was to move beyond the traditional "read-only" nature of widgets, creating an ecosystem where users can execute tasks instantly and tailor their view to match their immediate situational needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* "I focused on" Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-12 lg:gap-24 mb-16">
                    <div>
                        <h2 className="text-lg mb-4 text-black">I focused on</h2>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black">
                            • Active control over passive viewing
                            <br />
                            • Situational UI adaptability
                            <br />
                            • Frictionless micro-interactions
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                I focused on breaking the barrier between information and action. By designing widgets that function as mini-control centers, I enabled users to manipulate their environment directly from the home screen. I also prioritized layout flexibility, ensuring that users could pivot between broad and focused perspectives to match their immediate cognitive load and planning needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1: Interactive Widgets */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Interactive Without Opening
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Widgets are no longer just shortcuts. We redesigned key system widgets—such as Music, Reminders, and SmartThings—to allow users to complete tasks directly on the home screen. Checking off a task, skipping a track, or dimming the lights can all be done instantly, removing an entire layer of navigation.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/widget/widget1.jpg" alt="Interactive Widget UI" className="w-full h-full object-contain" />
                </div>
            </section>

            {/* Content Section 2: Purpose-Driven Widgets */}
            <section className="border-t border-gray-100 grid grid-cols-1 dt:grid-cols-2 pt-16 -mx-8 px-8 mb-32">
                <div className=" gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Purpose-Driven Single Widgets
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                We focused on creating widgets that are truly functional at the first layer. Instead of just "screening" data (viewing only), these widgets allow users to toggle specific system functions or complete tasks directly from the home screen.
                            </p>
                            <p>
                                For example, the alarm widget features a direct toggle, and the task list widget allows for immediate check-offs and quick addition of new items. This shift from "viewing" to "operating" provides a seamless experience that reduces the need to navigate into the full application for simple, frequent actions.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/widget/widget2.png" alt="Functional single purpose widgets" className="w-full h-full object-contain" />
                </div>
            </section>

            {/* Content Section 3: View Options */}
            <section className="grid grid-cols-1 dt:grid-cols-2 border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="w-full mx-auto overflow-hidden mb-8">
                    <img src="/widget/widget3.png" alt="Diverse view options for calendar widget" className="w-full h-full object-contain" />
                </div>
                <div className="gap-4 lg:gap-24 items-top mb-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Diverse View Options
                        </h2>
                    </div>
                    <div>
                        <div className="project-description space-y-6">
                            <p>
                                Understanding that every user's workflow is different, we introduced highly adaptable view options that can be adjusted to suit the user's specific purpose at any given moment.
                            </p>
                            <p>
                                Users can easily pivot between a comprehensive agenda list for long-term planning and a compact, focused view that combines a month-view calendar with immediate daily tasks. This flexibility ensures the interface remains relevant whether the user is in a "deep dive" or a "quick glance" state of mind.
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Outcome Section */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="mb-16">
                    <h2 className="text-lg mb-4 text-black">Outcome</h2>
                    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-12 max-w-4xl">
                        Streamlined Home Screen Usability and Increased Feature Adoption
                    </h2>

                    <div className="grid grid-cols-1 dt:grid-cols-3 gap-4 lg:gap-24 items-top mb-16">
                        <div>
                            <span className="block text-4xl mb-4 text-black">40% Higher Engagement</span>
                            <p className="project-description text-gray-600">
                                Experienced a 40% absolute increase in daily interactions directly from the home screen thanks to new interactive widget capabilities.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">Stack Adoption</span>
                            <p className="project-description text-gray-600">
                                Smart Stacks became one of the most utilized personalization features within the first month of rollout, significantly decluttering mobile screens.
                            </p>
                        </div>
                        <div>
                            <span className="block text-4xl mb-4 text-black">Contextual Surfacing</span>
                            <p className="project-description text-gray-600">
                                Context-aware surfacing reduced drop-off rates, helping users access specific actions effortlessly without opening full applications.
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
