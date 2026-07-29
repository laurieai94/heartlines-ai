import { Helmet } from "react-helmet";
import KaiScreenRecording from "@/components/showcase/KaiScreenRecording";

const ShowcaseEmbed = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-white antialiased"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(350 90% 22%) 0%, hsl(345 100% 12%) 55%, hsl(345 100% 8%) 100%)",
      }}
    >
      <Helmet>
        <title>heartlines · showcase</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center px-6 py-8">
        <KaiScreenRecording />
      </div>
    </div>
  );
};

export default ShowcaseEmbed;
