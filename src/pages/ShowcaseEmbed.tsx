import { useState } from "react";
import { Helmet } from "react-helmet";
import { Copy, Check } from "lucide-react";
import KaiScreenRecording from "@/components/showcase/KaiScreenRecording";

const EMBED_URL = "https://heartlines.ai/showcase/embed";

const iframeSnippet = `<iframe
  src="${EMBED_URL}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 24px; overflow: hidden;"
  title="heartlines showcase"
></iframe>`;

const scriptSnippet = `<div id="heartlines-showcase"></div>
<script>
  (function () {
    var container = document.getElementById('heartlines-showcase');
    var iframe = document.createElement('iframe');
    iframe.src = '${EMBED_URL}';
    iframe.width = '100%';
    iframe.height = '600';
    iframe.frameBorder = '0';
    iframe.style.borderRadius = '24px';
    iframe.style.overflow = 'hidden';
    iframe.title = 'heartlines showcase';
    container.appendChild(iframe);
  })();
</script>`;

const CodeBlock = ({ label, code }: { label: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={`Copy ${label} snippet`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-left text-xs leading-relaxed text-white/80 backdrop-blur-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ShowcaseEmbed = () => {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-12 text-white antialiased md:flex-row md:items-start md:justify-center md:py-20"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(350 90% 22%) 0%, hsl(345 100% 12%) 55%, hsl(345 100% 8%) 100%)",
      }}
    >
      <Helmet>
        <title>heartlines · showcase embed</title>
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

      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center">
        <KaiScreenRecording />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            embed the showcase
          </h1>
          <p className="mt-1 text-sm text-white/60">
            copy the iframe or script snippet below and paste it into your page.
          </p>
        </div>

        <CodeBlock label="iframe" code={iframeSnippet} />
        <CodeBlock label="script tag" code={scriptSnippet} />

        <p className="text-xs text-white/40">
          the embed is responsive and keeps its padding on every screen size.
        </p>
      </div>
    </div>
  );
};

export default ShowcaseEmbed;
