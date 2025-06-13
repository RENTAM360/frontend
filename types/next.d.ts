// This file overrides conflicting Next.js types
import "next"

declare module "next" {
  // Override the PageProps type if needed
  export interface PageProps {
    params: { [key: string]: string }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}
