import React from 'react';
import { IconInvoice, IconUsers, IconChartBar, IconSettings, IconShieldLock, IconDeviceMobile } from '@tabler/icons-react';

export default function Features() {
  const features = [
    {
      title: "Smart Invoicing",
      description: "Create professional invoices in seconds. Auto-calculate VAT, discounts, and totals. Generate PDFs instantly.",
      icon: <IconInvoice className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Client Management",
      description: "Keep track of all your clients in one place. Store contact details, ICE numbers, and transaction history.",
      icon: <IconUsers className="w-8 h-8 text-green-500" />
    },
    {
      title: "Insightful Dashboard",
      description: "Get a clear view of your business performance. Track revenue, recent activities, and key metrics at a glance.",
      icon: <IconChartBar className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Customizable Settings",
      description: "Tailor the app to your business needs. Configure currency, VAT rates, and company details easily.",
      icon: <IconSettings className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Secure & Reliable",
      description: "Your data is safe with us. We use industry-standard encryption and secure authentication methods.",
      icon: <IconShieldLock className="w-8 h-8 text-red-500" />
    },
    {
      title: "Mobile Friendly",
      description: "Access your invoices and data from anywhere. Our responsive design works perfectly on all devices.",
      icon: <IconDeviceMobile className="w-8 h-8 text-teal-500" />
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            Everything you need to manage your billing
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 dark:text-neutral-400 mx-auto">
            Quick Bill provides a comprehensive suite of tools to streamline your invoicing process and grow your business.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white dark:bg-neutral-700 shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
