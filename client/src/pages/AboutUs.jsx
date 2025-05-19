import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">About Us</h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">Your trusted partner for fresh and quality groceries</p>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">Our Story</h2>
            <p className="text-lg text-gray-500 mb-6">
              Founded in 2025, Easy Grocery Store has been committed to providing high-quality groceries to our community. We believe in making grocery shopping convenient, affordable, and enjoyable for everyone.
            </p>
            <p className="text-lg text-gray-500">
              What started as a small local store has grown into a trusted online platform, connecting customers with the freshest produce and quality grocery items. Our journey has been driven by a passion for food and a commitment to customer satisfaction.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <img 
              src="/src/assets/about-story.jpg" 
              alt="Our grocery store" 
              className="rounded-lg shadow-lg object-cover h-96 w-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Our Mission Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 mt-10 lg:mt-0">
              <img 
                src="/src/assets/about-mission.jpg" 
                alt="Fresh produce" 
                className="rounded-lg shadow-lg object-cover h-96 w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80';
                }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">Our Mission</h2>
              <p className="text-lg text-gray-500 mb-6">
                To deliver fresh, quality products at competitive prices while providing exceptional customer service. We strive to support local farmers and suppliers while promoting sustainable practices.
              </p>
              <p className="text-lg text-gray-500">
                We're committed to reducing our environmental footprint by implementing eco-friendly packaging solutions and supporting sustainable farming practices. Our goal is to make healthy food accessible to everyone while preserving our planet for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-500">
              We ensure all our products meet the highest quality standards. We carefully select our suppliers and regularly check our products to maintain excellence.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh</h3>
            <p className="text-gray-500">
              We deliver fresh products directly from farms to your doorstep. Our efficient supply chain ensures that you receive the freshest groceries possible.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
            <p className="text-gray-500">
              Your satisfaction is our top priority. We're committed to providing exceptional customer service and addressing your needs promptly and effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;