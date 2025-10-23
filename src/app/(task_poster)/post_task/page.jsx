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

const TaskCreationApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Task created successfully!");
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-800">
                <Image className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload Images</p>
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
                <Form.Item
                  label="Preferred Date"
                  name="startDate"
                  rules={[{ required: true, message: "Select start date" }]}
                  // vertical layout ensures label is above input
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    placeholder="Select opening time"
                    size="large"
                    className="w-full rounded-lg"
                    format="YYYY-MM-DD"
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  label="Preferred Time"
                  name="preferredTime"
                  rules={[{ required: true, message: "Select preferred time" }]}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <TimePicker
                    placeholder="Select time"
                    size="large"
                    className="w-full rounded-lg"
                    suffixIcon={
                      <ClockCircleOutlined className="text-gray-400" />
                    }
                    format="HH:mm"
                    value={
                      formData.preferredTime
                        ? dayjs(formData.preferredTime, "HH:mm")
                        : null
                    }
                    onChange={(time, timeString) =>
                      handleInputChange("preferredTime", timeString)
                    }
                  />
                </Form.Item>
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
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: "#115e59" }}
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
