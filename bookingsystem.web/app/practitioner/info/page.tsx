"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UpdatePractitionerInfoRequest,
  PractitionerQualification,
  WeeklyAvailability,
  TimeSlot,
  PractitionerInfoResponse,
} from "@/src/types/practitioner";
import { practitionerApi } from "@/src/lib/practitionerApi";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PractitionerInfoPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  // User ID from login
  const [userId, setUserId] = useState("");

  // Form state - read-only fields (after loaded)
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // Editable fields
  const [bio, setBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Qualifications
  const [qualifications, setQualifications] = useState<
    PractitionerQualification[]
  >([]);

  // Availability
  const [weeklyAvailability, setWeeklyAvailability] = useState<
    WeeklyAvailability[]
  >(
    DAYS_OF_WEEK.map((day) => ({
      dayOfWeek: day,
      timeSlots: [],
    }))
  );

  // Get user ID from login
  useEffect(() => {
    const loadPractitionerInfo = async () => {
      // Get user ID from localStorage (set during login)
      const storedUserId = localStorage.getItem("user_id");
      const storedRole = localStorage.getItem("user_role");

      if (!storedUserId || storedRole !== "practitioner") {
        setNeedsLogin(true);
        setLoadingData(false);
        return;
      }

      setUserId(storedUserId);

      try {
        const response = await practitionerApi.getPractitionerInfo(
          storedUserId
        );
        if (response.ok) {
          const data: PractitionerInfoResponse = await response.json();
          // Set fields from API response
          setUsername(data.username);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          if (data.bio) setBio(data.bio);
          if (data.yearsOfExperience)
            setYearsOfExperience(data.yearsOfExperience.toString());
          if (data.qualifications) setQualifications(data.qualifications);
          if (data.availability) {
            if (data.availability.timeZone) {
              setTimeZone(data.availability.timeZone);
            }
            if (data.availability.weeklyAvailability) {
              setWeeklyAvailability(
                DAYS_OF_WEEK.map((day) => {
                  const existing = data.availability.weeklyAvailability.find(
                    (w: WeeklyAvailability) => w.dayOfWeek === day
                  );
                  return existing || { dayOfWeek: day, timeSlots: [] };
                })
              );
            }
          }
        } else {
          setError("Failed to load practitioner info.");
        }
      } catch (err) {
        console.error("Failed to load practitioner info:", err);
        setError("Failed to load practitioner info.");
      } finally {
        setLoadingData(false);
      }
    };

    loadPractitionerInfo();
  }, []);

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      {
        degree: "",
        institution: "",
        yearOfCompletion: new Date().getFullYear(),
      },
    ]);
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const updateQualification = (
    index: number,
    field: keyof PractitionerQualification,
    value: string | number
  ) => {
    const updated = [...qualifications];
    updated[index] = { ...updated[index], [field]: value };
    setQualifications(updated);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots.push({
      startTime: "09:00",
      endTime: "17:00",
      practice: "",
    });
    setWeeklyAvailability(updated);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots = updated[dayIndex].timeSlots.filter(
      (_, i) => i !== slotIndex
    );
    setWeeklyAvailability(updated);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updated = [...weeklyAvailability];
    updated[dayIndex].timeSlots[slotIndex] = {
      ...updated[dayIndex].timeSlots[slotIndex],
      [field]: value,
    };
    setWeeklyAvailability(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) {
      setError("User ID is required");
      return;
    }

    setLoading(true);

    try {
      const filteredAvailability = weeklyAvailability.filter(
        (day) => day.timeSlots.length > 0
      );

      const data: UpdatePractitionerInfoRequest = {
        id: userId,
        bio: bio || null,
        yearsOfExperience: yearsOfExperience
          ? parseInt(yearsOfExperience, 10)
          : null,
        qualifications: qualifications.length > 0 ? qualifications : null,
        availability:
          filteredAvailability.length > 0
            ? {
                timeZone,
                weeklyAvailability: filteredAvailability,
              }
            : null,
      };

      const response = await practitionerApi.updatePractitionerInfo(data);

      if (response.ok) {
        setSuccess("Profile updated successfully!");
      } else {
        const errorData = await response.text();
        setError(errorData || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Please log in as a practitioner to access your profile.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
          >
            Go to Login
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full mt-4 px-4 py-3 rounded-lg text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Practitioner Profile
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  htmlFor="yearsOfExperience"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 5"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Tell patients about yourself, your experience, and your approach to care..."
              />
            </div>
          </div>

          {/* Qualifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Qualifications
              </h2>
              <button
                type="button"
                onClick={addQualification}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
              >
                + Add Qualification
              </button>
            </div>

            {qualifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No qualifications added yet. Click &quot;Add Qualification&quot;
                to add your degrees and certifications.
              </p>
            ) : (
              <div className="space-y-4">
                {qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Qualification {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={qual.degree}
                          onChange={(e) =>
                            updateQualification(index, "degree", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="e.g., MD, PhD"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={qual.institution}
                          onChange={(e) =>
                            updateQualification(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="e.g., Harvard Medical School"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Year of Completion
                        </label>
                        <input
                          type="number"
                          value={qual.yearOfCompletion}
                          onChange={(e) =>
                            updateQualification(
                              index,
                              "yearOfCompletion",
                              parseInt(e.target.value, 10)
                            )
                          }
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Availability
            </h2>

            <div className="mb-6">
              <label
                htmlFor="timeZone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Time Zone
              </label>
              <select
                id="timeZone"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {weeklyAvailability.map((day, dayIndex) => (
                <div
                  key={day.dayOfWeek}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {day.dayOfWeek}
                    </h3>
                    <button
                      type="button"
                      onClick={() => addTimeSlot(dayIndex)}
                      className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      + Add Time Slot
                    </button>
                  </div>

                  {day.timeSlots.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Not available
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-3 flex-wrap"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  dayIndex,
                                  slotIndex,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  dayIndex,
                                  slotIndex,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            value={slot.practice}
                            onChange={(e) =>
                              updateTimeSlot(
                                dayIndex,
                                slotIndex,
                                "practice",
                                e.target.value
                              )
                            }
                            placeholder="Practice/Location"
                            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-lg text-lg font-medium bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
