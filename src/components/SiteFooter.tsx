import { Link } from "react-router-dom";
import { User, MessageSquare, Settings, Shield, CreditCard, FileText, Mail, Target } from "lucide-react";
import { BRAND } from "@/branding";
import BrandLogo from "@/components/BrandLogo";
const SiteFooter = () => {
  const footerSections = [{
    title: "App",
    links: [{
      to: "/profile",
      label: "Profile",
      icon: User
    }, {
      to: "/coach",
      label: "Coach",
      icon: MessageSquare
    }, {
      to: "/account",
      label: "Account",
      icon: Settings
    }, {
      to: "/plans",
      label: "Plans",
      icon: CreditCard
    }]
  }, {
    title: "Company",
    links: [{
      to: "/mission",
      label: "Mission",
      icon: Target
    }, {
      to: "/privacy-and-security",
      label: "Privacy",
      icon: Shield
    }, {
      to: "/terms",
      label: "Terms",
      icon: FileText
    }, {
      to: "/contact",
      label: "Contact",
      icon: Mail
    }]
  }];
  return <footer className="py-12 bg-black/50 backdrop-blur-sm border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout: Brand on top, then 2 columns */}
        <div className="md:hidden mb-8">
          {/* Brand Section - Full Width */}
          <div className="text-center mb-8">
            <BrandLogo kind="wordmark" className="mx-auto" width={120} height={40} />
          </div>

          {/* App & Company - Two Columns */}
          <div className="grid grid-cols-2 gap-6">
            {footerSections.map(section => <div key={section.title} className="text-center">
                <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => <li key={link.to}>
                      <Link to={link.to} className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 flex items-center justify-center gap-2 group">
                        <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>

        {/* Desktop/Tablet Layout: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-left">
            <BrandLogo kind="wordmark" width={120} height={40} className="mb-3" />
            <p className="text-white/70 text-sm leading-relaxed">
              AI-powered relationship coaching for modern love.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map(section => <div key={section.title} className="text-left">
              <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map(link => <li key={link.to}>
                    <Link to={link.to} className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 flex items-center justify-start gap-2 group">
                      <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">Built by humans figuring it out too</p>
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default SiteFooter;