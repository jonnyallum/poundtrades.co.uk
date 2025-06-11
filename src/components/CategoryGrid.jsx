import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Wrench, Home, Droplet } from 'lucide-react';

const categories = [
  {
    name: 'Building Materials',
    icon: <Package className="h-12 w-12 text-primary mx-auto mb-4" />,
    description: 'Bricks, timber, cement, and more.',
    link: '/category/building-materials',
  },
  {
    name: 'Tools & Equipment',
    icon: <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />,
    description: 'Power tools, hand tools, and machinery.',
    link: '/category/tools-equipment',
  },
  {
    name: 'Doors & Windows',
    icon: <Home className="h-12 w-12 text-primary mx-auto mb-4" />,
    description: 'Internal, external doors, and various window types.',
    link: '/category/doors-windows',
  },
  {
    name: 'Plumbing & Heating',
    icon: <Droplet className="h-12 w-12 text-primary mx-auto mb-4" />,
    description: 'Pipes, radiators, boilers, and fittings.',
    link: '/category/plumbing-heating',
  },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <Link to={category.link} key={index}>
          <div className="bg-card p-6 rounded-lg shadow-lg text-center transition-transform duration-300 hover:scale-105">
            {category.icon}
            <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
            <p className="text-muted-foreground text-sm">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;


