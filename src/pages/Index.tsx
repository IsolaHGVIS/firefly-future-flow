
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, Calculator, User, ArrowRight, TrendingUp, Wallet, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-purple-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Track Your Path to <span className="text-fire-purple">Financial Independence</span>
              </h1>
              <p className="text-xl text-gray-600">
                Plan your journey to FIRE (Financial Independence, Retire Early) with our intuitive tools and visualizations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-fire-orange hover:bg-fire-orange/90"
                >
                  <Link to="/calculator">Try FIRE Calculator</Link>
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline"
                  className="border-fire-purple text-fire-purple hover:bg-fire-purple/10"
                >
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">FIRE Progress</span>
                    <span className="text-lg font-bold text-fire-purple">25%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-fire-purple rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">FIRE Number</p>
                      <p className="font-bold text-xl">$1,000,000</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Years to FIRE</p>
                      <p className="font-bold text-xl">15.5</p>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="text-fire-purple hover:underline flex items-center gap-1 text-sm font-medium"
                  >
                    View Complete Dashboard <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Plan Your Financial Independence</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Our tools help you calculate, track, and visualize your journey to financial freedom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3 bg-fire-purple"></div>
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-fire-purple/10 w-12 h-12 flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-fire-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">FIRE Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  View your financial progress with interactive charts and key metrics all in one place.
                </p>
                <Link 
                  to="/dashboard" 
                  className="text-fire-purple hover:text-fire-purple/80 inline-flex items-center gap-1"
                >
                  Explore Dashboard <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3 bg-fire-blue"></div>
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-fire-blue/10 w-12 h-12 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-fire-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">FIRE Calculator</h3>
                <p className="text-gray-600 mb-4">
                  Plan your retirement timeline with our advanced calculator that adapts to your financial goals.
                </p>
                <Link 
                  to="/calculator" 
                  className="text-fire-blue hover:text-fire-blue/80 inline-flex items-center gap-1"
                >
                  Use Calculator <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3 bg-fire-orange"></div>
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-fire-orange/10 w-12 h-12 flex items-center justify-center">
                  <User className="h-6 w-6 text-fire-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personal Finance</h3>
                <p className="text-gray-600 mb-4">
                  Track your monthly income, expenses, and savings rate to optimize your path to independence.
                </p>
                <Link 
                  to="/profile" 
                  className="text-fire-orange hover:text-fire-orange/80 inline-flex items-center gap-1"
                >
                  View Profile <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Use FIRE Track?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-fire-purple/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-fire-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Progress</h3>
              <p className="text-gray-600">
                See your journey to financial independence with clear visualizations and progress tracking.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-fire-green/20 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-fire-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Analysis</h3>
              <p className="text-gray-600">
                Get personalized insights to optimize your savings and accelerate your path to FIRE.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-fire-orange/20 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-fire-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Planning</h3>
              <p className="text-gray-600">
                Adjust your strategy as your life changes with flexible planning tools designed for you.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-fire-purple text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your FIRE Journey Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step toward financial independence and early retirement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-fire-purple hover:bg-gray-100"
            >
              <Link to="/calculator">Try FIRE Calculator</Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 bg-fire-purple rounded-full flex items-center justify-center mr-2">
                <span className="font-bold">F</span>
              </div>
              <span className="font-bold text-lg">FIRE Track</span>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/calculator" className="text-gray-300 hover:text-white">Calculator</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} FIRE Track. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
