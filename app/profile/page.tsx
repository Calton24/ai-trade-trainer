import type { Metadata } from "next"

import { ProfileContent } from "@/components/profile/profile-content"

export const metadata: Metadata = {
  title: "Profile",
  description: "Your learning profile, statistics, and course enrollments.",
}

export default function ProfilePage() {
  return <ProfileContent />
}
