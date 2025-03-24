
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-fitness-secondary to-white" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCA1NiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTU2IDI4VjBIMFYyOEgxN0MxNy4yNjUyIDI4IDI4LjA3NzkgMjggMjguMDc3OSAyOEMyOC4wNzc5IDI4IDM4LjcwOTkgMjggMzkgMjhINTZaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] bg-bottom bg-repeat-x opacity-60" />
      </div>

      <Header transparent={true} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 md:pt-40 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Track Your Runs.</span>
              <br />
              <span>Achieve Your Goals.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The ultimate running companion that helps you track your progress, set new personal records, and connect with other runners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Explore Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Mock App Preview */}
          <div className="relative mx-auto max-w-md md:max-w-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border-8 border-white bg-gray-100">
              <div className="relative h-full w-full bg-white">
                <div className="absolute inset-0 flex flex-col">
                  {/* Mock UI */}
                  <div className="flex-shrink-0 bg-fitness-primary text-white p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">FitRun</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow p-4 flex flex-col gap-4">
                    <div className="glass-panel p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">Today's Goal</div>
                        <div className="text-lg font-bold">5.0 km</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-fitness-secondary flex items-center justify-center text-fitness-primary">
                        75%
                      </div>
                    </div>
                    <div className="bg-fitness-secondary rounded-xl p-4">
                      <div className="text-xs text-gray-600 mb-1">Last Run</div>
                      <div className="text-lg font-bold mb-2">Morning Run</div>
                      <div className="flex justify-between text-sm">
                        <div>3.75 km</div>
                        <div>22:45</div>
                        <div>6:04/km</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 glass-panel p-3">
                        <div className="text-xs text-gray-500 mb-1">Week</div>
                        <div className="text-base font-bold">12.4 km</div>
                      </div>
                      <div className="flex-1 glass-panel p-3">
                        <div className="text-xs text-gray-500 mb-1">Month</div>
                        <div className="text-base font-bold">42.6 km</div>
                      </div>
                    </div>
                    <div className="mt-auto flex justify-center">
                      <div className="glass-panel py-3 px-8 rounded-full text-fitness-primary font-medium">
                        Start Run
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Features</span> Made for Runners
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to track your running journey, set new goals, and stay motivated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Accurate GPS Tracking',
                description: 'Track your runs with precision, even when offline. View your route on a detailed map.'
              },
              {
                title: 'Comprehensive Metrics',
                description: 'Monitor distance, pace, elevation gain, calories burned, and more during your run.'
              },
              {
                title: 'Personal Records',
                description: 'Automatically track your best performances and celebrate new personal records.'
              },
              {
                title: 'Detailed Analytics',
                description: 'Dive deep into your running data with beautiful visualizations and insights.'
              },
              {
                title: 'Goal Setting',
                description: 'Set daily, weekly, or monthly goals and track your progress toward achieving them.'
              },
              {
                title: 'Training Plans',
                description: 'Follow customized training plans for 5K, 10K, half marathon, or full marathon races.'
              },
            ].map((feature, index) => (
              <div key={index} className="glass-panel p-6 transition-all duration-300 hover:shadow-md">
                <div className="h-10 w-10 bg-fitness-secondary rounded-lg flex items-center justify-center text-fitness-primary mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-fitness-primary to-fitness-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of runners who are tracking their progress and achieving their goals with FitRun.
          </p>
          <Link to="/register">
            <Button 
              className="bg-white text-fitness-primary hover:bg-gray-100" 
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-fitness-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 text-gradient">FitRun</div>
            <p className="text-gray-400 mb-6">Your Perfect Running Companion</p>
            <div className="flex justify-center space-x-6 mb-8">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} FitRun. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
