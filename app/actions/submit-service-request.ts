"use server"

import { createClient } from "@supabase/supabase-js"

// Define the shape of the form data with all fields now required
interface ServiceRequestData {
  name: string
  contact: string
  serviceType: string
  projectGoal: string
  hasIdentity: string
  budget: string
  deadline: string
  notes: string
}

export async function submitServiceRequest(previousState: any, formData: FormData) {
  console.log("Server action 'submitServiceRequest' called.")
  console.log("Previous state (from useActionState):", previousState)

  // استخراج البيانات من كائن FormData
  const name = formData.get("name") as string
  const contact = formData.get("contact") as string
  const serviceType = formData.get("serviceType") as string
  const projectGoal = formData.get("projectGoal") as string
  const hasIdentity = formData.get("hasIdentity") as string
  const budget = formData.get("budget") as string
  const deadline = formData.get("deadline") as string
  const notes = formData.get("notes") as string

  const requestData: ServiceRequestData = {
    name,
    contact,
    serviceType,
    projectGoal,
    hasIdentity,
    budget,
    deadline,
    notes,
  }

  console.log("Extracted form data:", requestData)

  // Ensure Supabase environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase URL or Service Role Key is not set in environment variables.")
    return { success: false, message: "خطأ في تهيئة الخادم: لم يتم العثور على بيانات Supabase." }
  }

  console.log("Supabase client created.")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  })

  try {
    const { data, error } = await supabase.from("service_requests").insert([
      {
        name: requestData.name,
        contact: requestData.contact,
        service_type: requestData.serviceType,
        project_goal: requestData.projectGoal,
        has_identity: requestData.hasIdentity,
        budget: requestData.budget,
        deadline: requestData.deadline,
        notes: requestData.notes,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, message: `حدث خطأ أثناء إرسال طلبك: ${error.message}` }
    }

    console.log("Service request submitted successfully to Supabase. Response data:", data)
    return { success: true, message: "تم وصلنا طلبك وبتواصل معك قريب" }
  } catch (error) {
    console.error("Unexpected error in submitServiceRequest:", error)
    return { success: false, message: "حدث خطأ غير متوقع أثناء إرسال طلبك. يرجى المحاولة مرة أخرى." }
  }
}
