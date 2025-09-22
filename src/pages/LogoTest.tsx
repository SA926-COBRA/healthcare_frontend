import React from 'react';
import { BRANDING } from '@/config/branding';

const LogoTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Prontivus Logo Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Logo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Main Logo (Horizontal)</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded">
              <img 
                src={BRANDING.assets.logo} 
                alt={BRANDING.name}
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.logo}</p>
          </div>

          {/* Transparent Logo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transparent Logo</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded bg-gradient-to-br from-blue-100 to-green-100">
              <img 
                src={BRANDING.assets.logoTransparent} 
                alt={BRANDING.name}
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.logoTransparent}</p>
          </div>

          {/* Monochrome Logo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monochrome Logo</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded">
              <img 
                src={BRANDING.assets.logoMonochrome} 
                alt={BRANDING.name}
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.logoMonochrome}</p>
          </div>

          {/* Gradient Logo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Gradient Logo</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded">
              <img 
                src={BRANDING.assets.logoGradient} 
                alt={BRANDING.name}
                className="h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.logoGradient}</p>
          </div>

          {/* Sublogo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sublogo</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded bg-gradient-to-br from-blue-100 to-green-100">
              <img 
                src={BRANDING.assets.sublogo} 
                alt={BRANDING.name}
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.sublogo}</p>
          </div>

          {/* Sublogo Gradient */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sublogo Gradient</h2>
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded">
              <img 
                src={BRANDING.assets.sublogoGradient} 
                alt={BRANDING.name}
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-red-500 hidden">❌ Logo failed to load</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Path: {BRANDING.assets.sublogoGradient}</p>
          </div>
        </div>

        {/* Branding Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Branding Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {BRANDING.name}</p>
              <p><strong>Slogan:</strong> {BRANDING.slogan}</p>
              <p><strong>Description:</strong> {BRANDING.description}</p>
            </div>
            <div>
              <p><strong>Owner:</strong> {BRANDING.contact.owner}</p>
              <p><strong>Email:</strong> {BRANDING.contact.email}</p>
              <p><strong>Website:</strong> {BRANDING.contact.website}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTest;
