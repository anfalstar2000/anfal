"use client"
import { Moon, X, Sun } from "lucide-react"
import type React from "react"

import { useState, useEffect } from "react"
import { submitServiceRequest } from "./app/actions/submit-service-request"

export default function Component() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    serviceType: "",
    projectGoal: "",
    hasIdentity: "",
    budget: "",
    deadline: "",
    notes: "",
  })
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [showExitMessage, setShowExitMessage] = useState(false)
  const [showWhatsappContactModal, setShowWhatsappContactModal] = useState(false)
  const fullText = "ايه نعم اكيد!"
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true)
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          setTimeout(() => {
            setShowButton(true)
          }, 500)
        }
      }, 100)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const validateField = (fieldName: keyof typeof formData, value: string): string => {
    let error = ""
    switch (fieldName) {
      case "name":
        if (!value.trim()) error = "الاسم مطلوب."
        break
      case "contact":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^(\+966|966|05|5)?[0-9]{8,9}$/
        if (!value.trim()) {
          error = "طريقة التواصل مطلوبة."
        } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          error = "يرجى إدخال بريد إلكتروني صحيح أو رقم جوال."
        }
        break
      case "serviceType":
        if (!value) error = "نوع الخدمة مطلوب."
        break
      case "projectGoal":
        if (!value.trim()) error = "هدف المشروع مطلوب."
        break
      case "hasIdentity":
        if (!value) error = "هذا الحقل مطلوب."
        break
      case "budget":
        if (!value) error = "الميزانية مطلوبة."
        break
      case "deadline":
        if (!value) error = "موعد التسليم مطلوب."
        break
      case "notes":
        if (!value.trim()) error = "الملاحظات مطلوبة."
        break
      default:
        break
    }
    return error
  }

  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {}
    let isValid = true

    if (currentStep === 1) {
      const nameError = validateField("name", formData.name)
      if (nameError) {
        errors.name = nameError
        isValid = false
      }
      const contactError = validateField("contact", formData.contact)
      if (contactError) {
        errors.contact = contactError
        isValid = false
      }
    } else if (currentStep === 2) {
      const serviceTypeError = validateField("serviceType", formData.serviceType)
      if (serviceTypeError) {
        errors.serviceType = serviceTypeError
        isValid = false
      }
      const projectGoalError = validateField("projectGoal", formData.projectGoal)
      if (projectGoalError) {
        errors.projectGoal = projectGoalError
        isValid = false
      }
      const hasIdentityError = validateField("hasIdentity", formData.hasIdentity)
      if (hasIdentityError) {
        errors.hasIdentity = hasIdentityError
        isValid = false
      }
    } else if (currentStep === 3) {
      const budgetError = validateField("budget", formData.budget)
      if (budgetError) {
        errors.budget = budgetError
        isValid = false
      }
      const deadlineError = validateField("deadline", formData.deadline)
      if (deadlineError) {
        errors.deadline = deadlineError
        isValid = false
      }
    } else if (currentStep === 4) {
      const notesError = validateField("notes", formData.notes)
      if (notesError) {
        errors.notes = notesError
        isValid = false
      }
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(Math.min(totalSteps, currentStep + 1))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      const data = new FormData()
      for (const key in formData) {
        data.append(key, formData[key as keyof typeof formData])
      }

      const result = await submitServiceRequest(data)

      if (result.success) {
        setSubmitMessage(result.message)
        setShowModal(false)
        setShowConfirmation(true)
      } else {
        setSubmitMessage(result.message)
        setShowConfirmation(true)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
      setShowConfirmation(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for the field as user types
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleExitConfirmation = () => {
    setShowExitConfirmation(false)
    setShowExitMessage(true)
  }

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showExitConfirmation) {
        setShowExitConfirmation(false)
      }
      if (event.key === "Escape" && showWhatsappContactModal) {
        setShowWhatsappContactModal(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [showExitConfirmation, showWhatsappContactModal])

  const handleModalClose = () => {
    setShowModal(false)
    setCurrentStep(1)
    setValidationErrors({}) // Clear errors on modal close
    setFormData({
      // Reset form data
      name: "",
      contact: "",
      serviceType: "",
      projectGoal: "",
      hasIdentity: "",
      budget: "",
      deadline: "",
      notes: "",
    })
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`} dir="rtl">
      {/* Top Browser Bar */}
      <div className="bg-gray-100 border-gray-300 px-4 py-3 flex items-center justify-between">
        {/* Left Side - Avatar and Controls */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/anfal-avatar.png" alt="Anfal" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-between">
            <span
              className="text-gray-800 font-medium flex-1 text-center"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif", fontWeight: 500 }}
            >
              أنفال نجم
            </span>
            <X
              className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => setShowExitConfirmation(true)}
            />
          </div>
        </div>

        {/* Right Side - Browser Controls */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: isDarkMode ? "#242424" : "#5551FF",
        }}
      >
        {/* Message Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto mt-[-80px]">
          {/* Sender Name */}
          <div className="flex mb-4 text-right justify-start items-center">
            <div className="w-8 h-8 rounded-full ml-3" style={{ backgroundColor: "#F1F1F1" }}></div>
            <span
              className="text-gray-800 font-medium text-lg text-right"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif", fontWeight: 500 }}
            >
              سارا
            </span>
          </div>

          {/* Message Bubble */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p
              className="text-gray-800 text-right leading-relaxed"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif", fontWeight: 300 }}
            >
              هلا والله عندكم UI and UX؟ 😁
            </p>
          </div>

          {/* Reply Input */}
          <div className="border-t border-gray-100 pt-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-right mb-3">
              {!showTyping ? (
                <span
                  className="text-gray-400"
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif", fontWeight: 300 }}
                >
                  اكتب رد
                </span>
              ) : (
                <span
                  className="text-gray-800"
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif", fontWeight: 300 }}
                >
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              )}
            </div>
            {showButton && (
              <button
                onClick={() => setShowModal(true)}
                className="text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: isDarkMode ? "#242424" : "#5551FF",
                  fontFamily: "'Expo Arabic', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                ابدأ
              </button>
            )}
          </div>
        </div>

        {/* Avatar in bottom left */}
        <div className="fixed bottom-6 left-6 cursor-pointer" onClick={() => setShowWhatsappContactModal(true)}>
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
            <img src="/anfal-avatar.png" alt="Anfal" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                >
                  طلب خدمة UI/UX
                </h2>
                <p
                  className="text-sm text-gray-500 mt-1"
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                >
                  الخطوة {currentStep} من {totalSteps}
                </p>
              </div>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                  >
                    المعلومات الأساسية
                  </h3>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      الاسم *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="اكتب اسمك"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right text-sm ${
                        validationErrors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    />
                    {validationErrors.name && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      طريقة التواصل *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      placeholder="example@email.com أو 0501234567"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right text-sm ${
                        validationErrors.contact
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    />
                    {validationErrors.contact && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.contact}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Service Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                  >
                    تفاصيل الخدمة
                  </h3>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      نوع الخدمة *
                    </label>
                    <select
                      required
                      value={formData.serviceType}
                      onChange={(e) => handleInputChange("serviceType", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right text-sm bg-white ${
                        validationErrors.serviceType
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      <option value="">اختر نوع الخدمة</option>
                      <option value="mobile-app">تصميم تطبيق جوال</option>
                      <option value="website">تصميم موقع إلكتروني</option>
                      <option value="ux-improvement">تحسين تجربة المستخدم</option>
                      <option value="single-page">تصميم صفحة واحدة</option>
                      <option value="consultation">استشارة تصميم</option>
                    </select>
                    {validationErrors.serviceType && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.serviceType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      هدف المشروع *
                    </label>
                    <textarea
                      required
                      value={formData.projectGoal}
                      onChange={(e) => handleInputChange("projectGoal", e.target.value)}
                      placeholder="وصف مختصر للمشروع"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right resize-none text-sm ${
                        validationErrors.projectGoal
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    />
                    {validationErrors.projectGoal && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.projectGoal}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-3 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      هل لديك هوية بصرية؟ *
                    </label>
                    <div className="flex gap-4">
                      {["نعم", "لا", "غير متأكد"].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="hasIdentity"
                            value={option}
                            checked={formData.hasIdentity === option}
                            onChange={(e) => handleInputChange("hasIdentity", e.target.value)}
                            className="ml-2"
                            required
                          />
                          <span className="text-sm" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                    {validationErrors.hasIdentity && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.hasIdentity}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                  >
                    الميزانية والجدول الزمني
                  </h3>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      الميزانية *
                    </label>
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right text-sm bg-white ${
                        validationErrors.budget
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      <option value="">اختر الميزانية</option>
                      <option value="3000">٣٠٠٠ ريال</option>
                      <option value="3000-5000">٣٠٠٠ - ٥٠٠٠ ريال</option>
                      <option value="5000-10000">٥٠٠٠ - ١٠٠٠٠ ريال</option>
                      <option value="over-10000">أكثر من ١٠٠٠٠ ريال</option>
                    </select>
                    {validationErrors.budget && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      موعد التسليم المطلوب *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right text-sm ${
                        validationErrors.deadline
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    />
                    {validationErrors.deadline && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.deadline}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Additional Notes */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                  >
                    ملاحظات إضافية
                  </h3>

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2 text-sm"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      ملاحظات أو متطلبات خاصة *
                    </label>
                    <textarea
                      required
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="أي ملاحظات إضافية أو متطلبات خاصة للمشروع"
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 text-right resize-none text-sm ${
                        validationErrors.notes
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    />
                    {validationErrors.notes && (
                      <p
                        className="text-red-500 text-xs mt-1 text-right"
                        style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                      >
                        {validationErrors.notes}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4
                      className="font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      ملخص الطلب:
                    </h4>
                    <div
                      className="text-sm text-gray-600 space-y-1"
                      style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                    >
                      <p>
                        <strong>الاسم:</strong> {formData.name}
                      </p>
                      <p>
                        <strong>التواصل:</strong> {formData.contact}
                      </p>
                      <p>
                        <strong>نوع الخدمة:</strong> {formData.serviceType}
                      </p>
                      <p>
                        <strong>هدف المشروع:</strong> {formData.projectGoal}
                      </p>
                      <p>
                        <strong>هوية بصرية:</strong> {formData.hasIdentity}
                      </p>
                      <p>
                        <strong>الميزانية:</strong> {formData.budget}
                      </p>
                      <p>
                        <strong>موعد التسليم:</strong> {formData.deadline}
                      </p>
                      <p>
                        <strong>ملاحظات:</strong> {formData.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors text-sm ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                >
                  السابق
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#242424" : "rgba(79,70,229,1)",
                      fontFamily: "'Expo Arabic', system-ui, sans-serif",
                    }}
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isDarkMode ? "#242424" : "rgba(79,70,229,1)",
                      fontFamily: "'Expo Arabic', system-ui, sans-serif",
                    }}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exit Confirmation Popup */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center animate-in slide-in-from-bottom-4 duration-300">
            <h3
              className="text-lg font-bold text-gray-800 mb-6"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              متأكد إنك ما تبي شيء؟
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowExitConfirmation(false)}
                className="px-6 py-3 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: isDarkMode ? "#242424" : "rgba(79,70,229,1)",
                  fontFamily: "'Expo Arabic', system-ui, sans-serif",
                }}
              >
                غيرت رأيي
              </button>
              <button
                onClick={handleExitConfirmation}
                className="px-6 py-3 border-2 text-gray-600 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50 border-slate-50"
                style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
              >
                إيه، قفل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Service Request Submission */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center animate-in zoom-in-90 duration-300">
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-6xl mb-6">🎉</div>
            <h3
              className="text-2xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              {submitMessage}
            </h3>
            <p className="text-gray-600 text-lg" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
              شكراً لاهتمامك!
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Contact Modal */}
      {showWhatsappContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center animate-in zoom-in-90 duration-300 relative">
            <button
              onClick={() => setShowWhatsappContactModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3
              className="text-lg font-bold text-gray-800 mb-6"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              {""}
            </h3>
            <a
              href="https://wa.me/966580079332"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 transform hover:scale-105 inline-flex items-center justify-center"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              كلمني واتس اب
            </a>
          </div>
        </div>
      )}

      {/* Exit Message */}
      {showExitMessage && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50">
          <div className="text-center animate-in fade-in duration-500">
            <div className="text-6xl mb-6">👋</div>
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              بالتوفيق، أشوفك على خير
            </h2>
            <p className="text-gray-600 text-lg mb-6" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
              شكراً مرة
            </p>

            {/* Social Media Section */}
            <div className="mt-8">
              <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
                بتلاقي أنفال هنا
              </p>
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://instagram.com/anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com/anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  href="https://tiktok.com/@anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
