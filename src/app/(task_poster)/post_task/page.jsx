"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Calendar,
  DollarSign,
  Image,
  X,
  Upload,
} from "lucide-react";
import MultiStepForm from "@/components/task_post/MultiStepForm";
import FormNavigation from "@/components/task_post/FormNavigation";
import StepHeader from "@/components/task_post/StepHeader";
import FormSelect from "@/components/task_post/FormSelect";
import FormInput from "@/components/task_post/FormInput";
import RadioGroup from "@/components/task_post/RadioGroup";

const TaskCreationApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskCategory: "",
    taskDescription: "",
    taskType: "in-person",
    location: "",
    taskTiming: "fixed-date",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    agreedToTerms: false,
  });

  const steps = [
    { id: 0, title: "Task Overview" },
    { id: 1, title: "Task Details" },
    { id: 2, title: "Date & Time" },
    { id: 3, title: "Budget" },
  ];

  const categories = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Appliance Repair",
    "Furniture Assembly",
    "Painting",
    "Moving Help",
    "AC Installation",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select valid image files only");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  // Remove image
  const handleRemoveImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    console.log("Uploaded images:", uploadedImages);
    alert("Task created successfully!");
  };

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    const savedForm = localStorage.getItem("formData");
    const savedImages = localStorage.getItem("uploadedImages");

    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
    if (savedImages) {
      setUploadedImages(JSON.parse(savedImages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <StepHeader icon={FileText} title="Task Overview" />
            <FormInput
              label="Task Title"
              placeholder='e.g. "Fix leaking kitchen tap"'
              value={formData.taskTitle}
              onChange={(e) => handleInputChange("taskTitle", e.target.value)}
              required
            />
            <FormSelect
              label="Task Category"
              options={categories}
              value={formData.taskCategory}
              onChange={(e) =>
                handleInputChange("taskCategory", e.target.value)
              }
              placeholder="Select Category"
              required
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <StepHeader icon={CheckCircle} title="Task Details" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <textarea
                rows={4}
                value={formData.taskDescription}
                onChange={(e) =>
                  handleInputChange("taskDescription", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attachments (optional)
              </label>

              {/* Upload Area */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-800 hover:bg-gray-50 transition-all block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB (Max 10 images)
                </p>
              </label>

              {/* Image Preview Grid */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({uploadedImages.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-teal-800 transition-colors">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <StepHeader icon={Calendar} title="Date & Time" />
            <RadioGroup
              label="How should the task be done?"
              name="taskType"
              options={[
                { label: "In-Person", value: "in-person" },
                { label: "Online", value: "online" },
              ]}
              value={formData.taskType}
              onChange={(value) => handleInputChange("taskType", value)}
              className="text-gray-700 [&_input[type='radio']]:border-green-500
               [&_input[type='radio']]:bg-white"
            />
            {formData.taskType === "in-person" && (
              <FormInput
                label="Where to Go"
                placeholder="e.g. 123 Main Avenue"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            )}
            <RadioGroup
              label="When do you want this task done?"
              name="taskTiming"
              options={[
                { label: "Fixed Date & Time", value: "fixed-date" },
                { label: "Flexible", value: "flexible" },
              ]}
              value={formData.taskTiming}
              onChange={(value) => handleInputChange("taskTiming", value)}
            />
            {formData.taskTiming === "fixed-date" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  type="date"
                  label="Preferred Date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    handleInputChange("preferredDate", e.target.value)
                  }
                />
                <FormSelect
                  label="Preferred Time"
                  options={[
                    "Morning (8AM - 12PM)",
                    "Afternoon (12PM - 6PM)",
                    "Evening (6PM - 10PM)",
                  ]}
                  value={formData.preferredTime}
                  onChange={(e) =>
                    handleInputChange("preferredTime", e.target.value)
                  }
                  placeholder="Select time"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <StepHeader icon={DollarSign} title="Budget" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How much are you offering?
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="1,500"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) =>
                  handleInputChange("agreedToTerms", e.target.checked)
                }
              />
              <p className="text-sm text-gray-600">
                I confirm this task complies with all rules.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MultiStepForm steps={steps} currentStep={currentStep} showTimelineBorder>
      {renderStepContent()}
      <FormNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentStep={currentStep}
        totalSteps={steps.length}
        finalLabel="Post Task"
        handleSubmit={handleSubmit}
      />
    </MultiStepForm>
  );
};

export default TaskCreationApp;
