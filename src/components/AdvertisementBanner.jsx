import React from 'react';

const AdvertisementBanner = ({ companyName, title, description, imageUrl, websiteUrl }) => {
  return (
    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center transition-transform duration-300 hover:scale-105">
        <img src={imageUrl} alt={companyName} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
        <div className="p-6 flex-1">
          <span className="text-xs font-semibold text-primary mb-2 block">Featured Partner</span>
          <h3 className="text-2xl font-bold text-foreground mb-2">{companyName}</h3>
          <h4 className="text-xl font-semibold text-muted-foreground mb-3">{title}</h4>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          <span className="text-primary font-semibold flex items-center">
            Visit Website
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
};

export default AdvertisementBanner;


