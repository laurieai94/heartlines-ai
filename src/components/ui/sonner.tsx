import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      closeButton
      toastOptions={{
        style: {
          zIndex: 999999,
        },
        classNames: {
          toast:
            "group toast questionnaire-card border-white/10 backdrop-blur-md bg-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]",
          title: "group-[.toast]:text-white font-semibold text-lg group-[.toast.success]:text-xl group-[.toast.success]:font-bold",
          description: "group-[.toast]:text-white/90 text-sm",
          actionButton:
            "group-[.toast]:questionnaire-button-primary rounded-lg px-3 py-1.5 text-sm font-medium",
          cancelButton:
            "group-[.toast]:questionnaire-button-secondary rounded-lg px-3 py-1.5 text-sm font-medium",
          closeButton:
            "group-[.toast]:questionnaire-text-muted hover:questionnaire-text bg-white/10 hover:bg-white/20 border-white/20 rounded-full",
          success: "group-[.toast]:border-coral-300/40 group-[.toast]:bg-gradient-to-r group-[.toast]:from-coral-400/20 group-[.toast]:via-pink-400/15 group-[.toast]:to-peach-400/20 group-[.toast]:bg-[length:200%_100%] group-[.toast]:animate-gradient-x group-[.toast]:shadow-[0_0_30px_rgba(251,146,140,0.3),0_8px_30px_rgba(0,0,0,0.2)]",
          error: "group-[.toast]:border-red-400/50 group-[.toast]:bg-red-500/20 group-[.toast]:backdrop-brightness-110",
          warning: "group-[.toast]:border-orange-400/30 group-[.toast]:bg-orange-400/10",
          info: "group-[.toast]:border-blue-400/30 group-[.toast]:bg-blue-400/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
