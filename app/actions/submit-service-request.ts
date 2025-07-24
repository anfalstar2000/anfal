"use server"

import { createClient } from "@supabase/supabase-js"

// Define the shape of the form data with optional fields as string | null
interface ServiceRequestData {
  name: string
  contact: string
  serviceType: string
  projectGoal: string | null // أصبح اختياريًا
  hasIdentity: string | null // أصبح اختياريًا
  budget: string | null // أصبح اختياريًا
  deadline: string | null // أصبح اختياريًا
  notes: string | null // أصبح اختياريًا
}

// قم بتغيير توقيع الدالة لاستقبال الحالة السابقة وكائن FormData
export async function submitServiceRequest(previousState: any, formData: FormData) {
  console.log("Server action 'submitServiceRequest' called.")
  console.log("Previous state (from useActionState):", previousState)

  // استخراج البيانات من كائن FormData
  const name = formData.get("name") as string
  const contact = formData.get("contact") as string
  const serviceType = formData.get("serviceType") as string
  const projectGoal = (formData.get("projectGoal") as string) || null // أصبح اختياريًا
  const hasIdentity = (formData.get("hasIdentity") as string) || null // أصبح اختياريًا
  const budget = (formData.get("budget") as string) || null // أصبح اختياريًا
  const deadline = (formData.get("deadline") as string) || null // أصبح اختياريًا
  const notes = (formData.get("notes") as string) || null // أصبح اختياريًا

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

  // Create a Supabase client for server-side operations
  // Using the service_role key to bypass RLS for inserts if needed
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false, // No session persistence on server
    },
  })

  try {
    // Insert data into the service_requests table
    const { data, error } = await supabase.from("service_requests").insert([
      {
        name: requestData.name,
        contact: requestData.contact,
        service_type: requestData.serviceType,
        project_goal: requestData.projectGoal, // سيتم إرسال null إذا كان فارغًا
        has_identity: requestData.hasIdentity, // سيتم إرسال null إذا كان فارغًا
        budget: requestData.budget, // سيتم إرسال null إذا كان فارغًا
        deadline: requestData.deadline, // سيتم إرسال null إذا كان فارغًا
        notes: requestData.notes, // سيتم إرسال null إذا كان فارغًا
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      // Use error.code for specific error identification [^1]
      return { success: false, message: `حدث خطأ أثناء إرسال طلبك: ${error.message}` }
    }

    console.log("Service request submitted successfully to Supabase. Response data:", data)
    return { success: true, message: "تم وصلنا طلبك وبتواصل معك قريب" }
  } catch (error) {
    console.error("Unexpected error in submitServiceRequest:", error)
    return { success: false, message: "حدث خطأ غير متوقع أثناء إرسال طلبك. يرجى المحاولة مرة أخرى." }
  }
}
