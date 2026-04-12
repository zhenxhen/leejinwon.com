import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

export const DigitalGarden: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">

            {/* Header / Navigation */}
            <header className="mb-0">
                <Link
                    to="/"
                    className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
                >
                    ← Back to Projects
                </Link>
                <h1 className="title mb-2">
                    Digital Garden
                </h1>
                <p className="subtitle text-gray-600 max-w-2xl mb-2">
                    Sound Engineering Project, 2026
                </p>
            </header>

            {/* Main Video + Overview (single column video, overview directly below) */}
            <section className="mb-12">
                {/* Video */}
                <div style={{ padding: '65% 0 0 0', position: 'relative' }}>
                    <iframe
                        src="https://player.vimeo.com/video/1182395253?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=1"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title="Digital Garden"
                    ></iframe>
                </div>

                {/* Overview – directly below, no divider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mt-0">
                    <div>
                        <h2 className="mb-8 text-lg">Overview</h2>
                        <ul className="space-y-4 text-gray-600">
                            <li>
                                <span className="block text-gray-400 mb-1">Medium</span>
                                MIDI, Smart Phones
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Year</span>
                                2026
                            </li>
                            <li>
                                <span className="block text-gray-400 mb-1">Tools</span>
                                Python, Arduino, Max
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-8 text-lg">Mission</h2>
                        <div className="project-description space-y-6">
                            <p>
                                This project visualises the concept of digital conversion. Physical instruments are transformed into digital ones through MIDI, while networking systems such as social media have become new modes of expressing our lives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 1 */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
                            Nurturing Digital Life
                        </h2>
                        <div className="project-description space-y-6">
                            <p>
                                Within a constructed experimental environment, this project explores digital conversion through a posthumanist lens, allowing participants to experience the act of nurturing digital life by &#39;watering&#39; it with digital sound.
                            </p>
                        </div>
                    </div>
                    <div className="w-full" style={{ padding: '120% 0 0 0', position: 'relative' }}>
                        <iframe
                            src="https://player.vimeo.com/video/1182395618?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1&amp;loop=1"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            title="Digital Garden"
                        ></iframe>
                    </div>
                </div>
            </section>


            {/* Publications */}
            <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
                <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
                    Publications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 text-gray-500">
                    <div>
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
