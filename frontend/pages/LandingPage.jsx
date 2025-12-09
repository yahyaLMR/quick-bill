import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconFileInvoice, 
  IconUsers, 
  IconDeviceAnalytics, 
  IconBolt,
  IconCheck
} from '@tabler/icons-react';
import  Image1  from "../src/assets/image1.webp";
import  Image2  from "../src/assets/image2.webp";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
              Invoicing made <span className="text-blue-600 dark:text-blue-500">simple</span>.
            </h1>
            <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-10">
              Create professional invoices, manage clients, and track payments effortlessly. 
              The perfect tool for freelancers and small businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register" 
                className="px-8 py-4 text-lg font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Get Started for Free
              </Link>
              <Link 
                to="/features" 
                className="px-8 py-4 text-lg font-semibold rounded-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-16 relative max-w-5xl mx-auto"
            >
              <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                <img
                  src={Image1}
                  alt="Dashboard Preview"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Everything you need to get paid</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Stop wasting time on spreadsheets and manual billing. Quick Bill automates your workflow so you can focus on your work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<IconFileInvoice size={32} />}
              title="Smart Invoicing"
              description="Create beautiful, professional invoices in seconds. Customize with your logo and brand colors."
            />
            <FeatureCard 
              icon={<IconUsers size={32} />}
              title="Client Management"
              description="Keep track of all your clients in one place. Store details, history, and preferences."
            />
            <FeatureCard 
              icon={<IconDeviceAnalytics size={32} />}
              title="Insightful Reports"
              description="Visualize your earnings and track outstanding payments with our intuitive dashboard."
            />
          </div>
        </div>
      </section>

      {/* Benefits / How it works */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Why choose Quick Bill?
              </h2>
              <div className="space-y-6">
                <BenefitItem text="Zero setup fees, cancel anytime" />
                <BenefitItem text="Secure and reliable data storage" />
                <BenefitItem text="Export to PDF with one click" />
                <BenefitItem text="Mobile-friendly interface" />
                <BenefitItem text="Dark mode support included" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full"></div>
              <div className="relative hover:scale-160 transition-transform duration-500 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img 
                  src={Image2} 
                  alt="Invoice List Interface" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            Ready to streamline your business?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10">
            Join thousands of freelancers and small business owners who trust Quick Bill.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
          >
            Start for Free <IconBolt className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 transition-colors"
    >
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
        <IconCheck size={14} stroke={3} />
      </div>
      <span className="text-lg text-neutral-700 dark:text-neutral-300">{text}</span>
    </div>
  );
}
