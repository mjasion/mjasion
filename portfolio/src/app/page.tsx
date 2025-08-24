import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ExperienceSection from '@/components/Experience';
import ProjectsSection from '@/components/Projects';
import BlogSection from '@/components/Blog';
import { getAllPosts } from '@/lib/markdown';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />

      {/* Hero Featured Cards Section - matches LanderX design */}
      <div className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Distinguish yourself card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Distinguish yourself</h3>
                <p className="text-gray-300 mb-6">Elevate your brand with a golden tick and connect with top-tier associates.</p>
                <div className="flex items-center space-x-4">
                  {['LanderX', 'Crystalio', 'Robinson jr'].map((name) => (
                    <div key={name} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full border border-white/20"></div>
                      <span className="text-sm text-gray-300">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Insights card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise Insights</h3>
                <p className="text-gray-300 mb-6">Automate everything from workflow optimization to real-time sentiment analysis and market monitoring.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-blue-400 font-medium">Web Business</div>
                    <div className="text-sm text-purple-400 font-medium">SAAS Startup&apos;s</div>
                    <div className="text-sm text-green-400 font-medium">Marketing Agencies</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-orange-400 font-medium">E-commerce Brands</div>
                    <div className="text-sm text-pink-400 font-medium">Tech Innovators</div>
                    <div className="text-sm text-teal-400 font-medium">Creative Studios</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Business Data Solutions card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Business Data Solutions</h3>
                <p className="text-gray-300 mb-6">Your data-driven guide to making informed business decisions.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Monthly Visits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Last 24hrs</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div>100% score anytime</div>
                    <div>Watch Stats & Growth</div>
                  </div>
                </div>
              </div>

              {/* Boost Sales card */}
              <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Boost Sales</h3>
                <p className="text-gray-300 mb-6">Convert more leads with targeted strategies and smarter tools.</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Monthly Visits', 'Retention', 'Conversion', 'Top Referrals', 'Last 24hrs', 'Grow Income'].map((item, i) => (
                    <div key={item} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${['blue', 'green', 'purple', 'orange', 'pink', 'teal'][i % 6]}-500`}></div>
                      <span className="text-xs text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="features" className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
              BENEFITS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Innovative tools and powerful insights designed to elevate your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1 - Instant Savings */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Instant Savings</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get immediate savings on every purchase, powered by AI to optimize your transactions.
              </p>
            </div>

            {/* Card 2 - Real-Time Insights */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Real-Time Insights</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Make smarter decisions with live data and actionable insights, delivered in real-time to stay ahead of the curve
              </p>
            </div>

            {/* Card 3 - Flexible Plans */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Flexible Plans</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Choose plans that adapt to your business needs, offering unparalleled scalability and cost-effectiveness
              </p>
            </div>

            {/* Card 4 - Secure Transactions */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Secure Transactions</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Prioritize safety with cutting-edge encryption and robust security features for every interaction
              </p>
            </div>

            {/* Card 5 - Adaptive Systems */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Adaptive Systems</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Leverage AI-driven systems that evolve with your business, ensuring efficiency and innovation at every step
              </p>
            </div>

            {/* Card 6 - Dedicated Support */}
            <div className="group relative p-6 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Dedicated Support</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access expert assistance 24/7 to ensure you&apos;re never alone on your growth journey
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section - matches LanderX */}
      <div id="pricing" className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
              PRICING & PLANS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Flexible Pricing Plans
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose a plan that fits your business needs and unlock the full potential of our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">$12</span>
                  <span className="text-gray-400 ml-2">/ month</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300">
                  Get Started Now
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 font-medium mb-4">Includes:</p>
                <div className="space-y-3">
                  {['Unlimited AI usage here', 'Premium support', 'Customer care on point', 'Collaboration tools', 'Regular updates'].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Plan - Popular */}
            <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">$17</span>
                  <span className="text-gray-400 ml-2">/ month</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300">
                  Get Started Now
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 font-medium mb-4">Includes:</p>
                <div className="space-y-3">
                  {['Integrations with 3rd-party', 'Advanced analytics', 'Team performance tracking', 'Top grade security', 'Priority customer support', 'Detailed usage reports'].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="relative p-8 bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm border border-white/10 rounded-3xl">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300">
                  Get Started Now
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-400 font-medium mb-4">Includes:</p>
                <div className="space-y-3">
                  {['Dedicated account manager', 'Custom reports & dashboards', 'Most performance usage', 'Tailored onboarding and training', 'Customizable API access', 'Dedicated success manager'].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExperienceSection />
      <ProjectsSection />
      <BlogSection posts={posts} />

      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Portfolio. Built with Next.js, Tailwind CSS, and Framer Motion.
          </p>
        </div>
      </footer>
    </div>
  );
}
