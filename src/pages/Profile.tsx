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
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import {
  getUserProfile,
  updateUserProfile,
  TakeNameGoogle,
  nameProfile,
} from "../firebase.js";
import { getAuth } from "firebase/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [name, setName] = useState(null);
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
          setName(nameProfile);
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
        localStorage.setItem("userProfile", JSON.stringify(editedProfile));
        setUserProfile(editedProfile);
        toast.success("Profile updated successfully");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Calculate BMI
  const calculateBMI = () => {
    if (!userProfile?.ages.weight || !userProfile?.ages.height) return "N/A";

    const weight = parseFloat(userProfile.ages.weight);
    const heightInM = parseFloat(userProfile.ages.height) / 100;

    if (isNaN(weight) || isNaN(heightInM) || heightInM === 0) return "N/A";

    const bmi = weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return "N/A";

    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // If profile not loaded yet
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
                          src={userProfile.ages.profileImage}
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
                  {isEditing ? (
                    <input
                      type="text"
                      className="input-field text-xl text-center"
                      placeholder="Your Name"
                      value="John Doe"
                      readOnly
                    />
                  ) : (
                    name
                  )}
                </CardTitle>
                <p className="text-sm text-gray-500">Runner</p>
              </div>
            </CardHeader>
            <CardContent>
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
                  <div className="bg-white bg-opacity-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">
                      {isEditing ? (
                        <select
                          name="gender"
                          className="input-field text-center w-full"
                          value={editedProfile?.gender || ""}
                          onChange={handleInputChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not-to-say">
                            Prefer not to say
                          </option>
                        </select>
                      ) : (
                        userProfile.ages.gender.charAt(0).toUpperCase() +
                        userProfile.ages.gender.slice(1)
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
                      userProfile.ages.location || "Not specified"
                    )}
                  </p>
                </div>

                <div className="bg-white bg-opacity-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Primary Goal</p>
                  <p className="font-medium">
                    {isEditing ? (
                      <select
                        name="fitnessGoal"
                        className="input-field w-full"
                        value={editedProfile?.fitnessGoal || ""}
                        onChange={handleInputChange}
                      >
                        <option value="weight-loss">Weight Loss</option>
                        <option value="endurance">Improve Endurance</option>
                        <option value="speed">Increase Speed</option>
                        <option value="distance">Run Longer Distances</option>
                        <option value="race">Train for a Race</option>
                        <option value="health">General Health</option>
                      </select>
                    ) : (
                      userProfile.ages.fitnessGoal
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
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
                      userProfile.ages.experience.charAt(0).toUpperCase() +
                      userProfile.ages.experience.slice(1)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Tabs Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="stats" className="glass-panel">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="stats" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Stats</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center">
                  <Medal className="mr-2 h-4 w-4" />
                  <span>Achievements</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Schedule</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4 p-4">
                <h3 className="text-lg font-medium">Physical Stats</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Weight</div>
                      <div className="text-2xl font-bold mb-1">
                        {isEditing ? (
                          <input
                            type="number"
                            name="weight"
                            className="input-field text-center w-full"
                            value={editedProfile?.weight || ""}
                            onChange={handleInputChange}
                            min="30"
                            max="250"
                            step="0.1"
                          />
                        ) : (
                          userProfile.ages.weight
                        )}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          kg
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Height</div>
                      <div className="text-2xl font-bold mb-1">
                        {isEditing ? (
                          <input
                            type="number"
                            name="height"
                            className="input-field text-center w-full"
                            value={editedProfile?.height || ""}
                            onChange={handleInputChange}
                            min="100"
                            max="250"
                            step="1"
                          />
                        ) : (
                          userProfile.ages.height
                        )}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          cm
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">BMI</div>
                      <div className="text-2xl font-bold mb-1">
                        {calculateBMI()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getBMICategory()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-medium mt-6">Running Stats</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Total Distance
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        23.5
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          km
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Avg. Pace
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        5:32
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          min/km
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Calories</div>
                      <div className="text-2xl font-bold mb-1">
                        1,245
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          kcal
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="p-4">
                <h3 className="text-lg font-medium mb-4">Your Achievements</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "First Run",
                      description: "Completed your first run",
                      completed: true,
                      icon: <Medal className="h-5 w-5 text-yellow-500" />,
                    },
                    {
                      title: "5K Finisher",
                      description: "Completed a 5K run",
                      completed: true,
                      icon: <Medal className="h-5 w-5 text-yellow-500" />,
                    },
                    {
                      title: "10K Challenger",
                      description: "Complete a 10K run",
                      completed: false,
                      icon: <Medal className="h-5 w-5 text-gray-300" />,
                    },
                    {
                      title: "Early Bird",
                      description: "Complete a run before 7 AM",
                      completed: false,
                      icon: <Medal className="h-5 w-5 text-gray-300" />,
                    },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg ${
                        achievement.completed
                          ? "bg-fitness-secondary bg-opacity-30"
                          : "bg-gray-100 bg-opacity-50"
                      }`}
                    >
                      <div className="mr-3">{achievement.icon}</div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-500">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Personal Records</h3>

                  <div className="space-y-3">
                    {[
                      { distance: "1K", time: "4:15", date: "June 15, 2023" },
                      { distance: "5K", time: "23:42", date: "July 3, 2023" },
                    ].map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white bg-opacity-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{record.distance}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            Best time
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-fitness-primary">
                            {record.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="p-4">
                <h3 className="text-lg font-medium mb-4">Training Schedule</h3>

                <div className="grid grid-cols-7 gap-2 mb-6">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => {
                      const isActive = userProfile.ages.trainDays.includes(
                        day.toLowerCase()
                      );
                      return (
                        <div
                          key={day}
                          className={`flex flex-col items-center glass-panel p-3 ${
                            isActive ? "bg-fitness-secondary bg-opacity-30" : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-fitness-primary"
                                : "text-gray-500"
                            }`}
                          >
                            {day}
                          </span>
                          <div
                            className={`mt-2 w-4 h-4 rounded-full ${
                              isActive ? "bg-fitness-primary" : "bg-gray-200"
                            }`}
                          >
                            {isEditing && (
                              <input
                                type="checkbox"
                                className="opacity-0 absolute"
                                checked={editedProfile?.trainDays.includes(
                                  day.toLowerCase()
                                )}
                                onChange={(e) => {
                                  if (editedProfile) {
                                    if (e.target.checked) {
                                      setEditedProfile({
                                        ...editedProfile,
                                        trainDays: [
                                          ...editedProfile.trainDays,
                                          day.toLowerCase(),
                                        ],
                                      });
                                    } else {
                                      setEditedProfile({
                                        ...editedProfile,
                                        trainDays:
                                          editedProfile.trainDays.filter(
                                            (d) => d !== day.toLowerCase()
                                          ),
                                      });
                                    }
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <h3 className="text-lg font-medium mb-4">Favorite Run Types</h3>

                <div className="space-y-2">
                  {[
                    "Road running",
                    "Trail running",
                    "Track",
                    "Treadmill",
                    "Interval training",
                    "Long distance",
                  ].map((type) => {
                    const value = type.toLowerCase().replace(" ", "-");
                    const isSelected =
                      userProfile.ages.runTypes.includes(value);
                    return (
                      <div
                        key={type}
                        className={`p-3 rounded-lg flex items-center justify-between ${
                          isSelected
                            ? "bg-fitness-secondary bg-opacity-30"
                            : "bg-white bg-opacity-50"
                        }`}
                      >
                        <span className="font-medium">{type}</span>
                        {isEditing ? (
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-fitness-primary rounded border-gray-300 focus:ring-fitness-primary"
                            checked={editedProfile?.runTypes.includes(value)}
                            onChange={(e) => {
                              if (editedProfile) {
                                if (e.target.checked) {
                                  setEditedProfile({
                                    ...editedProfile,
                                    runTypes: [
                                      ...editedProfile.runTypes,
                                      value,
                                    ],
                                  });
                                } else {
                                  setEditedProfile({
                                    ...editedProfile,
                                    runTypes: editedProfile.runTypes.filter(
                                      (t) => t !== value
                                    ),
                                  });
                                }
                              }
                            }}
                          />
                        ) : (
                          isSelected && (
                            <Heart className="h-4 w-4 text-fitness-primary" />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
