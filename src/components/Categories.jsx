import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Groceries',
      description: 'Fresh food, pantry staples, and more',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'
    },
    {
      id: 2,
      name: 'Electronics',
      description: 'Latest tech and gadgets',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300'
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Everything for your home',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300'
    },
    {
      id: 4,
      name: 'Clothing',
      description: 'Fashion for the whole family',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'
    }
  ];

  return (
    <section className="categories">
      <div className="container">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 