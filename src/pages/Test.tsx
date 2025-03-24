import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Settings,
  Edit,
  Medal,
  Calendar,
  LogOut,
  Camera,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { getUserProfile, updateUserProfile } from "../firebase.js";
import { getAuth } from "firebase/auth";

const Test = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const auth = getAuth(); // Get authentication instance
        const user = auth.currentUser; // Check if user is logged in

        if (!user) {
          // Redirect to login page if the user is not authenticated
          console.error("User not authenticated");
          navigate("/login");
          return; // Stop further execution if user is not authenticated
        }

        const profileData = await getUserProfile(); // Fetch profile data from Firebase
        if (profileData) {
          setUserProfile(profileData); // Set the profile data if available
          setEditedProfile(profileData);
          console.log(userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserProfile(); // Call the function to fetch the profile when the component mounts
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (editedProfile) {
        updateUserProfile(editedProfile); // Update profile data in Firebase
        setUserProfile(editedProfile);
        toast.success("Profile updated successfully");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && editedProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({
          ...editedProfile,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateBMI = () => {
    if (!userProfile?.weight || !userProfile?.height) return "N/A";
    const weight = parseFloat(userProfile.weight);
    const heightInM = parseFloat(userProfile.height) / 100;
    if (isNaN(weight) || isNaN(heightInM) || heightInM === 0) return "N/A";
    const bmi = weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-fitness-secondary bg-opacity-30 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fitness-secondary bg-opacity-30">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleEditToggle}>
              {isEditing ? "Save Changes" : "Edit Profile"}
              {isEditing ? (
                <Settings className="ml-2 h-4 w-4" />
              ) : (
                <Edit className="ml-2 h-4 w-4" />
              )}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Log Out
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Card and Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1 glass-panel">
            <CardHeader className="pb-2 text-center">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {isEditing ? (
                    <>
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        {editedProfile?.profileImage ? (
                          <AvatarImage
                            src={editedProfile.profileImage}
                            alt="Profile"
                          />
                        ) : (
                          <AvatarFallback className="text-3xl bg-fitness-primary text-white">
                            {userProfile.profileImage ? (
                              "U"
                            ) : (
                              <User size={32} />
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <button
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md text-fitness-primary hover:bg-fitness-secondary transition-colors"
                        onClick={() =>
                          document
                            .getElementById("profile-image-upload")
                            ?.click()
                        }
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        id="profile-image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </>
                  ) : (
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      {userProfile.profileImage ? (
                        <AvatarImage
                          src={userProfile.profileImage}
                          alt="Profile"
                        />
                      ) : (
                        <AvatarFallback className="text-3xl bg-fitness-primary text-white">
                          <User size={32} />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                </div>
                <CardTitle className="text-xl font-bold">
                  {isEditing ? "John Doe" : userProfile.name}
                </CardTitle>
                <p className="text-sm text-gray-500">Runner</p>
              </div>
            </CardHeader>

            <CardContent>
              {/* Profile Information */}
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white bg-opacity-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          className="input-field text-center w-full"
                          value={editedProfile?.age || ""}
                          onChange={handleInputChange}
                          min="13"
                          max="120"
                        />
                      ) : (
                        userProfile.ages.age
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        className="input-field w-full"
                        value={editedProfile?.location || ""}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                      />
                    ) : (
                      userProfile.location || "Not specified"
                    )}
                  </p>
                </div>

                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Experience Level</p>
                  <p className="font-medium">
                    {isEditing ? (
                      <select
                        name="experience"
                        className="input-field w-full"
                        value={editedProfile?.experience || ""}
                        onChange={handleInputChange}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="novice">Novice</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="elite">Elite</option>
                      </select>
                    ) : (
                      userProfile.experience
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Test;
