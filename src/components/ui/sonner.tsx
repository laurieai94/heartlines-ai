import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      toastOptions={{
        style: {
          zIndex: 999999,
        },
        classNames: {
          toast:
            "group toast questionnaire-card border-questionnaire-border shadow-3xl backdrop-blur-md bg-white/15",
          title: "group-[.toast]:text-white font-semibold text-lg",
          description: "group-[.toast]:text-white/90 text-sm",
          actionButton:
            "group-[.toast]:questionnaire-button-primary rounded-lg px-3 py-1.5 text-sm font-medium",
          cancelButton:
            "group-[.toast]:questionnaire-button-secondary rounded-lg px-3 py-1.5 text-sm font-medium",
          closeButton:
            "group-[.toast]:questionnaire-text-muted hover:questionnaire-text bg-white/10 hover:bg-white/20 border-white/20 rounded-full",
          success: "group-[.toast]:border-green-400/30 group-[.toast]:bg-green-400/10",
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
