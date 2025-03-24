
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { Camera, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  profileImage: string | null;
  age: string;
  gender: string;
  location: string;
  fitnessGoal: string;
  experience: string;
  runTypes: string[];
  trainDays: string[];
  weight: string;
  height: string;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    profileImage: null,
    age: '',
    gender: '',
    location: '',
    fitnessGoal: '',
    experience: '',
    runTypes: [],
    trainDays: [],
    weight: '',
    height: ''
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name as keyof FormData] as string[], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof FormData] as string[]).filter(item => item !== value)
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profileImage: null
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Store profile data in localStorage (for demo purposes only)
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      setIsLoading(false);
      toast.success('Profile setup complete!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-fitness-secondary bg-opacity-30">
      <Header />
      
      <div className="container mx-auto max-w-2xl px-4 pt-32 pb-20">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Profile Setup</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-fitness-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-panel p-8 animate-fade-in">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium mb-4">Personal Information</h2>
                
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {formData.profileImage ? (
                      <>
                        <img 
                          src={formData.profileImage} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <button 
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                        <Camera className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Camera className="h-4 w-4" />}
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                    >
                      {formData.profileImage ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </label>
                </div>
                
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your age"
                    min="13"
                    max="120"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="City, Country"
                  />
                </div>
                
                {/* Fitness Goal */}
                <div>
                  <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 mb-1">Primary Fitness Goal</label>
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="" disabled>Select your main goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="endurance">Improve Endurance</option>
                    <option value="speed">Increase Speed</option>
                    <option value="distance">Run Longer Distances</option>
                    <option value="race">Train for a Race</option>
                    <option value="health">General Health</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium mb-4">Running Preferences</h2>
                
                {/* Experience Level */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Running Experience</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="" disabled>Select your experience level</option>
                    <option value="beginner">Beginner (just starting)</option>
                    <option value="novice">Novice (running for less than a year)</option>
                    <option value="intermediate">Intermediate (1-3 years of experience)</option>
                    <option value="advanced">Advanced (3+ years of experience)</option>
                    <option value="elite">Elite (competitive runner)</option>
                  </select>
                </div>
                
                {/* Favorite Run Types */}
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">Favorite Run Types</span>
                  <div className="space-y-2">
                    {['Road running', 'Trail running', 'Track', 'Treadmill', 'Interval training', 'Long distance'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          name="runTypes"
                          value={type.toLowerCase().replace(' ', '-')}
                          checked={formData.runTypes.includes(type.toLowerCase().replace(' ', '-'))}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-fitness-primary rounded border-gray-300 focus:ring-fitness-primary"
                        />
                        <span className="ml-2 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Training Schedule */}
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">Typical Training Days</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <label key={day} className="flex flex-col items-center glass-panel p-2">
                        <input
                          type="checkbox"
                          name="trainDays"
                          value={day.toLowerCase()}
                          checked={formData.trainDays.includes(day.toLowerCase())}
                          onChange={handleCheckboxChange}
                          className="sr-only"
                        />
                        <span className={`text-sm font-medium ${formData.trainDays.includes(day.toLowerCase()) ? 'text-fitness-primary' : 'text-gray-500'}`}>
                          {day}
                        </span>
                        <div className={`mt-1 w-4 h-4 rounded-full ${formData.trainDays.includes(day.toLowerCase()) ? 'bg-fitness-primary' : 'bg-gray-200'}`}></div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium mb-4">Physical Stats</h2>
                
                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your weight in kilograms"
                    step="0.1"
                    min="30"
                    max="250"
                  />
                </div>
                
                {/* Height */}
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your height in centimeters"
                    step="1"
                    min="100"
                    max="250"
                  />
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    This information helps us calculate your calorie burn and provide personalized training recommendations.
                  </p>
                  
                  <div className="glass-panel p-4 bg-fitness-success bg-opacity-30">
                    <h3 className="text-lg font-medium mb-2">Almost there!</h3>
                    <p className="text-sm text-gray-700">
                      Complete your profile setup to access all features of the app. You can always update your information later in your profile settings.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
