import React from 'react';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for freelancers and small businesses just starting out.",
      features: [
        "Up to 5 Clients",
        "Unlimited Invoices",
        "Basic PDF Export",
        "Dashboard Analytics",
        "Email Support"
      ],
      cta: "Get Started",
      ctaLink: "/register",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Ideal for growing businesses that need more power and flexibility.",
      features: [
        "Unlimited Clients",
        "Unlimited Invoices",
        "Custom Branding",
        "Priority Support",
        "Advanced Reports",
        "Multi-currency Support"
      ],
      cta: "Start Free Trial",
      ctaLink: "/register",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific requirements and high volume.",
      features: [
        "Dedicated Account Manager",
        "Custom API Integration",
        "SLA Support",
        "Team Management",
        "Audit Logs",
        "White Labeling"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact", // Assuming a contact page or just a placeholder
      popular: false
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 dark:text-neutral-400 mx-auto">
            Choose the plan that best fits your business needs. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 bg-white dark:bg-neutral-800 border rounded-2xl shadow-sm flex flex-col ${
                plan.popular 
                  ? 'border-blue-600 ring-2 ring-blue-600' 
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold tracking-wide text-white uppercase">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-base font-medium text-neutral-500 dark:text-neutral-400">{plan.period}</span>}
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="shrink-0">
                      <IconCheck className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-neutral-600 dark:text-neutral-300">{feature}</p>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`w-full block text-center py-3 px-6 rounded-md font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
