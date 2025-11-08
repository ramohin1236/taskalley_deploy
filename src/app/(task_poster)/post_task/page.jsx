"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Calendar,
  DollarSign,
  Image,
} from "lucide-react";
import MultiStepForm from "@/components/task_post/MultiStepForm";
import FormNavigation from "@/components/task_post/FormNavigation";
import StepHeader from "@/components/task_post/StepHeader";
import FormSelect from "@/components/task_post/FormSelect";
import FormInput from "@/components/task_post/FormInput";
import RadioGroup from "@/components/task_post/RadioGroup";
import { DatePicker, Form, TimePicker } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import { useCreateTaskMutation } from "@/lib/features/task/taskApi";
import { toast } from "sonner";

const TaskCreationApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const { data, isLoading, error } = useGetAllCategoriesQuery();
  
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  
  const categories = data?.data?.result?.map(category => ({
    value: category?._id || category?.id, 
    label: category?.name 
  })) || [];

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

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0:
        if (!formData.taskTitle.trim()) {
          errors.taskTitle = "Task title is required";
        }
        if (!formData.taskCategory) {
          errors.taskCategory = "Please select a category";
        }
        break;

      case 1:
        if (!formData.taskDescription.trim()) {
          errors.taskDescription = "Task description is required";
        }
        break;

      case 2:
        if (formData.taskType === "in-person" && !formData.location.trim()) {
          errors.location = "Location is required for in-person tasks";
        }
        if (formData.taskTiming === "fixed-date") {
          if (!formData.preferredDate) {
            errors.preferredDate = "Preferred date is required";
          }
          if (!formData.preferredTime) {
            errors.preferredTime = "Preferred time is required";
          }
        }
        break;

      case 3:
        if (!formData.budget || parseInt(formData.budget) <= 0) {
          errors.budget = "Please enter a valid budget";
        }
        if (!formData.agreedToTerms) {
          errors.agreedToTerms = "You must agree to the terms";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error 
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error("Please fill all required fields", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        }
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Please fill all required fields", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        }
      });
      return;
    }

    try {
      console.log("Form data to submit:", formData);

      const taskPayload = {
        title: formData.taskTitle,
        category: formData.taskCategory,
        description: formData.taskDescription,
        budget: parseInt(formData.budget),
        address: formData.location || "",
        scheduleType: formData.taskTiming === "fixed-date" ? "FIXED_DATE_AND_TIME" : "FLEXIBLE",
        ...(formData.taskTiming === "fixed-date" && {
          preferredDate: formData.preferredDate ? dayjs(formData.preferredDate).format("YYYY-MM-DD") : null,
          preferredTime: formData.preferredTime || "00:00" 
        }),
        payOn: "completion",
        taskType: formData.taskType
      };

      if (taskPayload.preferredTime && taskPayload.preferredTime.length === 4) {
        taskPayload.preferredTime = `0${taskPayload.preferredTime}`;
      }

      console.log("Sending to API:", taskPayload);

      const result = await createTask(taskPayload).unwrap();
      
      console.log("Task created successfully:", result);
      
      toast.success("Task created successfully!", {
        style: {
          backgroundColor: "#d1fae5",
          color: "#065f46",
          borderLeft: "6px solid #10b981",
        }
      });

      //  form reseeet
      setFormData({
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
      
      localStorage.removeItem("formData");
      localStorage.removeItem("currentStep");
      setCurrentStep(0);

    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error(error?.data?.message || "Failed to create task. Please try again.", {
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          borderLeft: "6px solid #dc2626",
        }
      });
    }
  };

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    const savedForm = localStorage.getItem("formData");

    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <StepHeader icon={FileText} title="Task Overview" />
            <div>
              <FormInput
                label="Task Title"
                placeholder='e.g. "Fix leaking kitchen tap"'
                value={formData.taskTitle}
                onChange={(e) => handleInputChange("taskTitle", e.target.value)}
                required
              />
              {formErrors.taskTitle && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskTitle}</p>
              )}
            </div>
            <div>
              <FormSelect
                label="Task Category"
                options={categories}
                value={formData.taskCategory}
                onChange={(e) => handleInputChange("taskCategory", e.target.value)}
                placeholder={isLoading ? "Loading categories..." : "Select Category"}
                required
                disabled={isLoading}
              />
              {formErrors.taskCategory && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskCategory}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">Failed to load categories</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <StepHeader icon={CheckCircle} title="Task Details" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description *
              </label>
              <textarea
                rows={4}
                value={formData.taskDescription}
                onChange={(e) => handleInputChange("taskDescription", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800 resize-none"
                placeholder="Describe your task in detail..."
              />
              {formErrors.taskDescription && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskDescription}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-800">
                <Image className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload Images (Coming Soon)</p>
              </div>
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
            />
            {formData.taskType === "in-person" && (
              <div>
                <FormInput
                  label="Where to Go *"
                  placeholder="e.g. 123 Main Avenue"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <DatePicker
                    placeholder="Select date"
                    size="large"
                    className="w-full rounded-lg"
                    format="YYYY-MM-DD"
                    value={formData.preferredDate ? dayjs(formData.preferredDate) : null}
                    onChange={(date, dateString) => 
                      handleInputChange("preferredDate", dateString)
                    }
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  />
                  {formErrors.preferredDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <TimePicker
                    placeholder="Select time"
                    size="large"
                    className="w-full rounded-lg"
                    suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
                    format="HH:mm"
                    value={formData.preferredTime ? dayjs(formData.preferredTime, "HH:mm") : null}
                    onChange={(time, timeString) => {
                      console.log("Time selected:", timeString); 
                      handleInputChange("preferredTime", timeString);
                    }}
                  />
                  {formErrors.preferredTime && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.preferredTime}</p>
                  )}
                </div>
              </div>
            )}
            {formData.taskTiming === "flexible" && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Great! Workers will contact you to schedule a convenient time.
                </p>
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
                How much are you offering? *
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
                  min="1"
                />
              </div>
              {formErrors.budget && (
                <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
              )}
            </div>
            <div className={`flex items-center gap-2 p-4 rounded-lg ${formErrors.agreedToTerms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => handleInputChange("agreedToTerms", e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: "#115e59" }}
              />
              <p className="text-sm text-gray-600">
                I confirm this task complies with all rules. *
              </p>
              {formErrors.agreedToTerms && (
                <p className="text-red-500 text-sm mt-1">{formErrors.agreedToTerms}</p>
              )}
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
        finalLabel={isCreating ? "Creating..." : "Post Task"}
        handleSubmit={handleSubmit}
        disabled={isCreating}
      />
    </MultiStepForm>
  );
};

export default TaskCreationApp;