"use server"

import { createClient } from "@supabase/supabase-js"

// Define the shape of the form data
// interface ServiceRequestData {
//   name: string
//   contact: string
//   serviceType: string
//   projectGoal: string
//   hasIdentity: string
//   budget: string
//   deadline: string
//   notes: string
// }

export async function submitServiceRequest(formData: FormData) {
  console.log("Server action 'submitServiceRequest' called.")

  // Ensure Supabase environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase URL or Service Role Key is not set in environment variables.")
    return { success: false, message: "خطأ في تهيئة الخادم: لم يتم العثور على بيانات Supabase." }
  }

  console.log("Received form data:", formData)

  // Create a Supabase client for server-side operations
  // Using the service_role key to bypass RLS for inserts if needed
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false, // No session persistence on server
    },
  })

  console.log("Supabase client created.")

  try {
    // Insert data into the service_requests table
    const { data, error } = await supabase.from("service_requests").insert([
      {
        name: formData.get("name") as string,
        contact: formData.get("contact") as string,
        service_type: formData.get("serviceType") as string,
        project_goal: formData.get("projectGoal") as string,
        has_identity: formData.get("hasIdentity") as string,
        budget: formData.get("budget") as string,
        deadline: (formData.get("deadline") as string) || null, // Use null for empty date strings
        notes: formData.get("notes") as string,
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
