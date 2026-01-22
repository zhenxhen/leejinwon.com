import React from 'react';

export const Footer: React.FC = () => {
    return (
        <>
            {/* Closing Statement */}
            <section className="pb-20 border-t border-gray-100 pt-16 -mx-8 px-8">
                <h2 className="title leading-tight tracking-tight">
                    Human come before technology,<br />
                    building sustainable systems and platforms together.
                </h2>
            </section>

            {/* Contact */}
            <section className="pb-20 border-t border-gray-100 pt-16 -mx-8 px-8">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h2 className="subtitle text-gray-400 mb-8">Contact</h2>
                        <a href="mailto:jinn.human@gmail.com" className="subtitle hover:text-gray-600 transition-colors cursor-pointer inline-block border-b border-black pb-1">
                            jinn.human@gmail.com
                        </a>
                    </div>
                    <div className="mt-8 md:mt-0 mr-20 flex flex-col gap-1 text-gray-400">
                        {/* Spacer to align with email address */}
                        <div className="subtitle mb-8 invisible hidden md:block">Contact</div>
                        <a target="_blank" href="https://www.linkedin.com/in/jinwon-eugene-lee/" className="hover:text-black transition-colors">LinkedIn</a>
                        <a target="_blank" href="https://www.instagram.com/eeezeen/" className="hover:text-black transition-colors">Instagram</a>
                        <a target="_blank" href="https://drive.google.com/file/d/1m8HhnaSv1ECcNSok6q0YawZzTF1V4cFn/view?usp=sharing" className="hover:text-black transition-colors">View CV</a>
                    </div>
                </div>
            </section>
        </>
    );
};
