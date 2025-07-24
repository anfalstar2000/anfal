"use client"
import { Moon, X, Sun, Instagram } from "lucide-react"
import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { useActionState } from "react"
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
  const totalSteps = 3
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [showServicesModal, setShowServicesModal] = useState(false)

  const [state, formAction, isPending] = useActionState(submitServiceRequest, {
    success: false,
    message: "",
  })
  const [isTransitionPending, startTransition] = useTransition()

  useEffect(() => {
    if (state.success) {
      setShowModal(false)
      setShowConfirmation(true)
      setFormData({
        name: "",
        contact: "",
        serviceType: "",
        projectGoal: "",
        hasIdentity: "",
        budget: "",
        deadline: "",
        notes: "",
      })
      setCurrentStep(1)
      setValidationErrors({})
    }
  }, [state])

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
        if (!value) error = "تحديد الهوية البصرية مطلوب."
        break
      case "budget":
        if (!value) error = "الميزانية مطلوبة."
        break
      case "deadline":
        if (!value) error = "تاريخ التسليم مطلوب."
        break
      case "notes":
        if (!value.trim()) error = "الملاحظات مطلوبة."
        break
      default:
        break
    }
    return error
  }

  const validateAllRequiredFields = (): boolean => {
    const errors: { [key: string]: string } = {}
    let isValid = true

    // Validate all fields
    for (const key in formData) {
      const fieldName = key as keyof typeof formData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        errors[fieldName] = error
        isValid = false
      }
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleNext = () => {
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
      const notesError = validateField("notes", formData.notes)
      if (notesError) {
        errors.notes = notesError
        isValid = false
      }
    }

    setValidationErrors(errors)

    if (isValid) {
      setCurrentStep(Math.min(totalSteps, currentStep + 1))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // منع الإرسال الافتراضي للنموذج دائمًا

    // تأكد أن الإرسال يتم فقط عند الضغط على زر الإرسال في الخطوة الأخيرة
    if (currentStep !== totalSteps) {
      console.log("Attempted submission from non-final step. Blocked.")
      return // لا تفعل شيئًا إذا لم نكن في الخطوة الأخيرة
    }

    console.log("Attempting final submission from step", currentStep)

    if (validateAllRequiredFields()) {
      const data = new FormData()
      for (const key in formData) {
        const value = formData[key as keyof typeof formData]
        data.append(key, value) // أضف جميع القيم، حتى لو كانت فارغة (سيتم التعامل معها بواسطة التحقق من الصحة)
      }
      startTransition(() => {
        formAction(data)
      })
    } else {
      // إذا فشل التحقق في الخطوة الأخيرة، أعد المستخدم إلى الخطوة التي تحتوي على أخطاء
      if (validationErrors.name || validationErrors.contact) {
        setCurrentStep(1)
      } else if (validationErrors.serviceType || validationErrors.projectGoal || validationErrors.hasIdentity) {
        setCurrentStep(2)
      } else if (validationErrors.budget || validationErrors.deadline || validationErrors.notes) {
        setCurrentStep(3)
      }
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      if (event.key === "Escape" && showServicesModal) {
        setShowServicesModal(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [showExitConfirmation, showWhatsappContactModal, showServicesModal])

  const handleModalClose = () => {
    setShowModal(false)
    setCurrentStep(1)
    setValidationErrors({})
    setFormData({
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
    <div
      className={`h-2 rounded-full transition-all duration-300 bg-[rgba(79,70,229,1)] ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      dir="rtl"
    >
      {/* Top Browser Bar */}
      <div className="bg-gray-100 border-gray-300 px-4 py-3 flex items-center justify-between">
        {/* Left Side - Avatar and Controls */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div
            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
            onClick={() => setShowServicesModal(true)}
          >
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
              كلاينت جديد
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
                  className="h-2 rounded-full transition-all duration-300 bg-slate-600"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Basic Info */}
              <div
                className="space-y-4 transition-all duration-300 ease-in-out"
                style={{
                  opacity: currentStep === 1 ? 1 : 0,
                  height: currentStep === 1 ? "auto" : 0,
                  overflow: currentStep === 1 ? "visible" : "hidden",
                  position: currentStep === 1 ? "relative" : "absolute", // للحفاظ على المساحة
                  width: "100%",
                }}
              >
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
                    وش اسمك ؟ *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="مثلاً: سارة أو محمد"
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
                    كيف أقدر أتواصل معك؟ *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="إيميلك أو رقم الواتساب"
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

              {/* Step 2: Service Details */}
              <div
                className="space-y-4 transition-all duration-300 ease-in-out"
                style={{
                  opacity: currentStep === 2 ? 1 : 0,
                  height: currentStep === 2 ? "auto" : 0,
                  overflow: currentStep === 2 ? "visible" : "hidden",
                  position: currentStep === 2 ? "relative" : "absolute",
                  width: "100%",
                }}
              >
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
                    وش نوع الخدمة اللي تحتاجها؟ *
                  </label>
                  <select
                    name="serviceType"
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
                    <option value="mobile-app-ui">تصميم واجهة تطبيق (موبايل)</option>
                    <option value="website-ui">تصميم واجهة موقع إلكتروني</option>
                    <option value="ux-improvement">تحسين تجربة مستخدم لمشروعك</option>
                    <option value="single-screen-design">تصميم شاشة وحدة (Landing page أو Dashboard)</option>
                    <option value="not-sure-talk-first">مو عارف بالضبط.. نحتاج نتكلم أول</option>
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
                    وش هدف المشروع؟ *
                  </label>
                  <textarea
                    name="projectGoal"
                    required
                    value={formData.projectGoal}
                    onChange={(e) => handleInputChange("projectGoal", e.target.value)}
                    placeholder="تكلم عن فكرتك بإيجاز"
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
                    عندك هوية بصرية جاهزة؟ *
                  </label>
                  <div className="flex gap-4">
                    {["نعم", "لا", "مو متأكد"].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hasIdentity"
                          value={option}
                          checked={formData.hasIdentity === option}
                          onChange={(e) => handleInputChange("hasIdentity", e.target.value)}
                          className="ml-2"
                          required // جعل حقل الراديو مطلوبًا
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

              {/* Step 3: Budget & Timeline */}
              <div
                className="space-y-4 transition-all duration-300 ease-in-out"
                style={{
                  opacity: currentStep === 3 ? 1 : 0,
                  height: currentStep === 3 ? "auto" : 0,
                  overflow: currentStep === 3 ? "visible" : "hidden",
                  position: currentStep === 3 ? "relative" : "absolute",
                  width: "100%",
                }}
              >
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
                    ميزانيتك التقريبية؟ *
                  </label>
                  <select
                    name="budget"
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
                    <option value="under-3000">أقل من ٣٠٠٠ ريال</option>
                    <option value="3000-6000">٣٠٠٠ - ٥٠٠٠ ريال</option>
                    <option value="6000-10000">٥٠٠٠ - ١٠٠٠٠ ريال</option>
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
                    عندك وقت تسليم محدد؟ *
                  </label>
                  <input
                    type="date"
                    name="deadline"
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

                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2 text-sm"
                    style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                  >
                    ملاحظات إضافية: *
                  </label>
                  <textarea
                    name="notes"
                    required
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="أي تفاصيل إضافية تود ذكرها"
                    rows={3}
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
              </div>

              {/* Display server-side error message if present and not successful */}
              {state.message && !state.success && (
                <p
                  className="text-red-500 text-sm mt-4 text-center"
                  style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
                >
                  {state.message}
                </p>
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
                    aria-disabled={isPending || isTransitionPending}
                    className="px-6 py-3 text-white rounded-lg font-bold text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#242424" : "rgba(79,70,229,1)",
                      fontFamily: "'Expo Arabic', system-ui, sans-serif",
                    }}
                  >
                    {isPending || isTransitionPending ? "جاري الإرسال..." : "أرسل الطلب ✨"}
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
              {state.message}
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
              className="hover:text-blue-800 transition-colors duration-200 transform hover:scale-105 inline-flex items-center justify-center text-[rgba(79,70,229,1)]"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              تواصل معي واتس اب   
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
                  <Instagram className="w-6 h-6" />
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
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1-.4-1.48V9.69h2.31c0-.26.05-.52.15-.76.23-.66.66-1.26 1.3-1.67.53-.34 1.15-.52 1.79-.52.17 0 .33.01.49.04V2h3.45v.44c0 1.56.81 3.04 2.11 3.81.65.39 1.36.59 2.08.59h.18v4.85z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Services Coming Soon Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center animate-in zoom-in-90 duration-300 relative">
            <button
              onClick={() => setShowServicesModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-4xl mb-4">👩🏻‍💻</div>
            <h3
              className="text-xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}
            >
              قريب بضيف خدمات متنوعة
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
              يعني ترقب✨ 
            </p>

            {/* Social Media Links */}
            <div className="border-t pt-4">
              <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Expo Arabic', system-ui, sans-serif" }}>
                بتلاقيني هنا 
              </p>
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://instagram.com/anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200 p-2 rounded-full hover:bg-gray-50"
                >
                  <Instagram className="w-6 h-6" />
                </a>

                <a
                  href="https://twitter.com/anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200 p-2 rounded-full hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  href="https://tiktok.com/@anfal_star1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200 p-2 rounded-full hover:bg-gray-50"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>

                <a
                  href="https://wa.me/966580079332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:scale-110 transition-transform duration-200 p-2 rounded-full hover:bg-gray-50"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
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
