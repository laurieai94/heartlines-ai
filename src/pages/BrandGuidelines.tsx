import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/branding";
import BrandSection from "@/components/brand/BrandSection";
import BrandColorSwatch from "@/components/brand/BrandColorSwatch";

const BrandGuidelines: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    window.print();
  };

  const primaryColors = [
    { name: "Primary Burgundy", hex: "#6B2D3D", hsl: "hsl(345, 41%, 30%)", cssVar: "--primary" },
    { name: "Primary Light", hex: "#8B3D4D", hsl: "hsl(345, 41%, 40%)", cssVar: "--primary-light" },
    { name: "Primary Dark", hex: "#4B1D2D", hsl: "hsl(345, 41%, 20%)", cssVar: "--primary-dark" },
  ];

  const accentColors = [
    { name: "Accent Warm", hex: "#D4A574", hsl: "hsl(30, 50%, 65%)", cssVar: "--accent" },
    { name: "Accent Foreground", hex: "#1A0A0A", hsl: "hsl(0, 33%, 7%)", cssVar: "--accent-foreground" },
  ];

  const uiColors = [
    { name: "Background", hex: "#0F0A0A", hsl: "hsl(0, 20%, 5%)", cssVar: "--background" },
    { name: "Foreground", hex: "#FAF5F5", hsl: "hsl(0, 33%, 97%)", cssVar: "--foreground" },
    { name: "Muted", hex: "#2A1A1A", hsl: "hsl(0, 25%, 13%)", cssVar: "--muted" },
    { name: "Card", hex: "#1A0F0F", hsl: "hsl(0, 27%, 8%)", cssVar: "--card" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Hidden in Print */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0 print:max-w-none">
        
        {/* Cover Page */}
        <div className="text-center mb-16 print:mb-12 print:py-16 print:page-break-after">
          <img 
            src={BRAND.wordmarkSrc} 
            alt={BRAND.alt}
            className="h-16 mx-auto mb-6 print:h-12"
          />
          <h1 className="text-4xl font-brand text-rose-300 mb-4 print:text-3xl print:text-gray-900">
            Brand Guidelines
          </h1>
          <p className="text-lg text-white/70 font-glacial print:text-gray-600">
            {BRAND.tagline}
          </p>
          <p className="text-sm text-white/60 mt-8 print:text-gray-500">
            Version 1.0 • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Logo Usage */}
        <BrandSection title="Logo Assets">
          <div className="grid grid-cols-2 gap-6 print:gap-4">
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <img 
                src={BRAND.wordmarkSrc} 
                alt="Primary Wordmark"
                className="h-12 mb-4"
              />
              <p className="text-sm font-semibold text-white print:text-gray-900">Primary Wordmark</p>
              <p className="text-xs text-white/70 print:text-gray-600">heartlines-logo.png</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">Use on dark backgrounds</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <img 
                src={BRAND.iconSrc} 
                alt="App Icon"
                className="h-12 mb-4"
              />
              <p className="text-sm font-semibold text-white print:text-gray-900">App Icon</p>
              <p className="text-xs text-white/70 print:text-gray-600">heartlines-icon.png</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">Favicon, PWA, social</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <img 
                src={BRAND.phoneLockupSrc} 
                alt="Phone Lockup"
                className="h-24 mb-4"
              />
              <p className="text-sm font-semibold text-white print:text-gray-900">Phone Lockup</p>
              <p className="text-xs text-white/70 print:text-gray-600">heartlines-phone-lockup.png</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">Marketing, hero sections</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <img 
                src={BRAND.coach.avatarSrc} 
                alt="Kai Avatar"
                className="h-16 mb-4 rounded-full"
              />
              <p className="text-sm font-semibold text-white print:text-gray-900">Kai Avatar</p>
              <p className="text-xs text-white/70 print:text-gray-600">kai-avatar.png</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">AI coach representation</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg print:bg-white print:border print:border-gray-200">
            <p className="text-sm font-semibold mb-2 text-white print:text-gray-900">Logo Usage Rules</p>
            <ul className="text-sm text-white/70 space-y-1 print:text-gray-600">
              <li>• Maintain minimum clear space equal to the height of the "h" in heartlines</li>
              <li>• Never stretch, rotate, or apply effects to the logo</li>
              <li>• Use on dark/burgundy backgrounds only (light version not provided)</li>
              <li>• Minimum size: 100px width for digital, 1" for print</li>
            </ul>
          </div>
        </BrandSection>

        {/* Color Palette */}
        <BrandSection title="Color Palette" className="print:break-before-page">
          <h3 className="text-lg font-semibold mb-4 text-white print:text-gray-900">Primary Colors</h3>
          <div className="grid grid-cols-3 gap-4 mb-8 print:grid-cols-3">
            {primaryColors.map((color) => (
              <BrandColorSwatch key={color.name} {...color} />
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4 text-white print:text-gray-900">Accent Colors</h3>
          <div className="grid grid-cols-2 gap-4 mb-8 print:grid-cols-2">
            {accentColors.map((color) => (
              <BrandColorSwatch key={color.name} {...color} />
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4 text-white print:text-gray-900">UI Colors</h3>
          <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
            {uiColors.map((color) => (
              <BrandColorSwatch key={color.name} {...color} />
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg print:bg-white print:border print:border-gray-200">
            <p className="text-sm font-semibold mb-2 text-white print:text-gray-900">Color Usage Notes</p>
            <ul className="text-sm text-white/70 space-y-1 print:text-gray-600">
              <li>• Primary burgundy is the signature brand color - use for key CTAs and brand moments</li>
              <li>• Accent warm (gold) pairs with burgundy for premium feel</li>
              <li>• Maintain dark theme aesthetic in all applications</li>
            </ul>
          </div>
        </BrandSection>

        {/* Typography */}
        <BrandSection title="Typography" className="print:break-before-page">
          <div className="grid grid-cols-2 gap-6 print:gap-4">
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <p className="text-4xl font-brand text-rose-300 mb-4 print:text-rose-700">heartlines</p>
              <p className="text-sm font-semibold text-white print:text-gray-900">Shrikhand</p>
              <p className="text-xs text-white/70 print:text-gray-600">Brand Font • Display</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">
                Used for: Logo, headlines, brand moments
              </p>
              <p className="text-xs text-white/60 print:text-gray-500">
                CSS: font-family: 'Shrikhand', cursive
              </p>
              <p className="text-xs text-white/60 print:text-gray-500">
                Tailwind: font-brand
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <p className="text-2xl mb-4 text-white print:text-gray-900">The quick brown fox</p>
              <p className="text-sm font-semibold text-white print:text-gray-900">Inter</p>
              <p className="text-xs text-white/70 print:text-gray-600">UI Font • System</p>
              <p className="text-xs text-white/60 mt-2 print:text-gray-500">
                Used for: Body text, UI elements, labels
              </p>
              <p className="text-xs text-white/60 print:text-gray-500">
                CSS: font-family: 'Inter', sans-serif
              </p>
              <p className="text-xs text-white/60 print:text-gray-500">
                Tailwind: font-sans (default)
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
            <p className="text-sm font-semibold mb-4 text-white print:text-gray-900">Type Scale</p>
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-brand text-rose-300 print:text-rose-700">Display</span>
                <span className="text-xs text-white/60 print:text-gray-500">4xl / 36px</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-brand text-rose-300 print:text-rose-700">Heading 1</span>
                <span className="text-xs text-white/60 print:text-gray-500">2xl / 24px</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xl font-semibold text-white print:text-gray-900">Heading 2</span>
                <span className="text-xs text-white/60 print:text-gray-500">xl / 20px</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-base text-white print:text-gray-900">Body</span>
                <span className="text-xs text-white/60 print:text-gray-500">base / 16px</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-sm text-white/70 print:text-gray-600">Caption</span>
                <span className="text-xs text-white/60 print:text-gray-500">sm / 14px</span>
              </div>
            </div>
          </div>
        </BrandSection>

        {/* Visual Elements */}
        <BrandSection title="Visual Elements" className="print:break-before-page">
          <div className="grid grid-cols-2 gap-6 print:gap-4">
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <div className="w-16 h-16 rounded-2xl mb-4" style={{
                background: 'radial-gradient(ellipse at 30% 20%, #8B3D4D 0%, #6B2D3D 40%, #4B1D2D 100%)'
              }} />
              <p className="text-sm font-semibold text-white print:text-gray-900">Molten Gradient</p>
              <p className="text-xs text-white/70 mt-1 print:text-gray-600">
                Radial gradient from primary-light → primary → primary-dark
              </p>
              <p className="text-xs text-white/60 mt-1 print:text-gray-500">
                Used for: Icon backgrounds, hero elements
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <div className="w-16 h-16 rounded-2xl mb-4 backdrop-blur-md" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }} />
              <p className="text-sm font-semibold text-white print:text-gray-900">Frosted Glass</p>
              <p className="text-xs text-white/70 mt-1 print:text-gray-600">
                backdrop-blur-md + white/10 background
              </p>
              <p className="text-xs text-white/60 mt-1 print:text-gray-500">
                Used for: Cards, overlays, navigation
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <div className="w-16 h-16 rounded-2xl mb-4" style={{
                background: '#6B2D3D',
                boxShadow: '0 0 40px rgba(139, 61, 77, 0.4)'
              }} />
              <p className="text-sm font-semibold text-white print:text-gray-900">Glow Effect</p>
              <p className="text-xs text-white/70 mt-1 print:text-gray-600">
                box-shadow with primary color at 40% opacity
              </p>
              <p className="text-xs text-white/60 mt-1 print:text-gray-500">
                Used for: CTAs, hover states, focus
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl text-white" style={{
                background: 'radial-gradient(ellipse at 30% 20%, #8B3D4D 0%, #6B2D3D 40%, #4B1D2D 100%)'
              }}>
                ♡
              </div>
              <p className="text-sm font-semibold text-white print:text-gray-900">Heart Motif</p>
              <p className="text-xs text-white/70 mt-1 print:text-gray-600">
                Outlined heart, not filled
              </p>
              <p className="text-xs text-white/60 mt-1 print:text-gray-500">
                Used for: Icons, decorative elements
              </p>
            </div>
          </div>
        </BrandSection>

        {/* Voice & Tone */}
        <BrandSection title="Voice & Tone" className="print:break-before-page">
          <div className="grid grid-cols-2 gap-6 print:gap-4">
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <p className="text-lg font-semibold mb-3 text-white print:text-gray-900">Brand Personality</p>
              <ul className="text-sm space-y-2 text-white/80 print:text-gray-700">
                <li><span className="font-semibold text-white print:text-gray-900">Warm & Intimate</span> - Like a trusted friend</li>
                <li><span className="font-semibold text-white print:text-gray-900">Modern Nostalgia</span> - Retro charm, smart tech</li>
                <li><span className="font-semibold text-white print:text-gray-900">Emotionally Intelligent</span> - Understanding, not judging</li>
                <li><span className="font-semibold text-white print:text-gray-900">Premium but Approachable</span> - Quality without pretense</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
              <p className="text-lg font-semibold mb-3 text-white print:text-gray-900">Writing Style</p>
              <ul className="text-sm space-y-2 text-white/80 print:text-gray-700">
                <li>• Use lowercase "heartlines" (never capitalize)</li>
                <li>• Keep copy warm and conversational</li>
                <li>• Avoid clinical or robotic language</li>
                <li>• Embrace gentle humor when appropriate</li>
                <li>• Coach name is "kai" (lowercase)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 print:gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 print:border-green-500">
              <p className="text-lg font-semibold mb-3 text-green-400 print:text-green-700">✓ Do</p>
              <ul className="text-sm space-y-2 text-white/70 print:text-gray-600">
                <li>• "let's talk about what's on your mind"</li>
                <li>• "kai is here to help"</li>
                <li>• "your relationship journey"</li>
                <li>• Use the heart motif thoughtfully</li>
                <li>• Maintain dark, warm aesthetic</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 print:border-red-500">
              <p className="text-lg font-semibold mb-3 text-red-400 print:text-red-700">✗ Don't</p>
              <ul className="text-sm space-y-2 text-white/70 print:text-gray-600">
                <li>• "HeartLines" or "HEARTLINES"</li>
                <li>• Clinical therapy language</li>
                <li>• Overly casual or unprofessional tone</li>
                <li>• Use the logo on light backgrounds</li>
                <li>• Overuse heart emoji (♥️)</li>
              </ul>
            </div>
          </div>
        </BrandSection>

        {/* Social Media Quick Reference */}
        <BrandSection title="Social Media Quick Reference">
          <div className="bg-white/10 rounded-xl p-6 print:bg-white print:border print:border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2 text-white print:text-gray-900">Instagram</p>
                <ul className="text-white/70 space-y-1 text-xs print:text-gray-600">
                  <li>Profile: 110×110px</li>
                  <li>Post: 1080×1080px</li>
                  <li>Story: 1080×1920px</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2 text-white print:text-gray-900">Twitter/X</p>
                <ul className="text-white/70 space-y-1 text-xs print:text-gray-600">
                  <li>Profile: 400×400px</li>
                  <li>Header: 1500×500px</li>
                  <li>Post: 1200×675px</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2 text-white print:text-gray-900">LinkedIn</p>
                <ul className="text-white/70 space-y-1 text-xs print:text-gray-600">
                  <li>Profile: 400×400px</li>
                  <li>Banner: 1128×191px</li>
                  <li>Post: 1200×627px</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg print:bg-white print:border print:border-gray-200">
            <p className="text-sm font-semibold mb-2 text-white print:text-gray-900">Hashtags</p>
            <p className="text-sm text-white/70 print:text-gray-600">
              #heartlines #relationshipcoach #laurieai #kai #emotionalintelligence #modernlove
            </p>
          </div>
        </BrandSection>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/20 print:border-gray-300 print:mt-8">
          <img 
            src={BRAND.wordmarkSrc} 
            alt={BRAND.alt}
            className="h-8 mx-auto mb-2 opacity-50"
          />
          <p className="text-xs text-white/60 print:text-gray-500">
            © {new Date().getFullYear()} heartlines. All rights reserved.
          </p>
          <p className="text-xs text-white/60 mt-1 print:text-gray-500">
            For questions, contact the brand team.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BrandGuidelines;
