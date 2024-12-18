// Simplified toast hook
import { useToast as useToastOriginal } from "@/components/ui/toast"

export function useToast() {
  return {
    toast: (props: { title?: string; description?: string }) => {
      console.log(props.title, props.description)
    }
  }
}
