import React from 'react';

interface LinkCardProps {
    url: string;
    title: string;
    description: string;
    image: string;
    source?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({ url, title, description, image, source }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 overflow-hidden h-full"
        >
            <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="w-full aspect-video overflow-hidden bg-gray-100 border-b border-gray-100 group-hover:border-gray-300 transition-colors">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-normal text-black mb-2 leading-tight">
                            {title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                            {description}
                        </p>
                        {source && (
                            <span className="block text-xs text-gray-400 mt-8 tracking-widest leading-none">
                                {source}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
};
