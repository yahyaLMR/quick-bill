import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Quick Bill</h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xs">
              Simplifying invoicing for freelancers and small businesses. Create, send, and track invoices with ease.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} Quick Bill. All rights reserved by <a href="">YAHYA LMOURI</a>.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
