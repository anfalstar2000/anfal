import type { Metadata } from "next"
import Component from "../landing-page"

export const metadata: Metadata = {
  title: "Anfal Star",
  description: "موقع أنفال نجم للتصميم والتطوير",
}

export default function Page() {
  return <Component />
}
