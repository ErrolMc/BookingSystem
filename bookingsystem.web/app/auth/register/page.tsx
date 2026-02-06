"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@/src/types/auth";
import {
  AdminRegisterForm,
  PatientRegisterForm,
  PractitionerRegisterForm,
} from "@/src/components/auth";

const roleLabels: Record<UserRole, string> = {
  patient: "Patient",
  practitioner: "Practitioner",
  admin: "Administrator",
};

const roleColors: Record<UserRole, string> = {
  patient: "bg-blue-600 hover:bg-blue-700",
  practitioner: "bg-green-600 hover:bg-green-700",
  admin: "bg-purple-600 hover:bg-purple-700",
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as UserRole;
  const initialRole = (
    ["patient", "practitioner", "admin"].includes(roleParam)
      ? roleParam
      : "patient"
  ) as UserRole;

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  const renderForm = () => {
    switch (selectedRole) {
      case "admin":
        return <AdminRegisterForm />;
      case "practitioner":
        return <PractitionerRegisterForm />;
      case "patient":
      default:
        return <PatientRegisterForm />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Join us today</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Register as...
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRole === role
                      ? `${roleColors[role]} text-white shadow-lg scale-105`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          </div>

          {renderForm()}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
