import { Link } from "react-router-dom";
import { User, MessageSquare, Settings, Shield, CreditCard, FileText, Mail, Target } from "lucide-react";
import { BRAND } from "@/branding";

const SiteFooter = () => {
  const footerSections = [
    {
      title: "App",
      links: [
        { to: "/profile", label: "Profile", icon: User },
        { to: "/coach", label: "Coach", icon: MessageSquare },
        { to: "/account", label: "Account", icon: Settings },
        { to: "/plans", label: "Plans", icon: CreditCard },
      ]
    },
    {
      title: "Company",
      links: [
        { to: "/mission", label: "Mission", icon: Target },
        { to: "/privacy-and-security", label: "Privacy", icon: Shield },
        { to: "/terms", label: "Terms", icon: FileText },
        { to: "/contact", label: "Contact", icon: Mail },
      ]
    }
  ];

  return (
    <footer className="py-12 bg-burgundy-900/95 backdrop-blur-sm border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-3 font-brand">{BRAND.name}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              AI-powered relationship coaching for modern love.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="text-center md:text-left">
              <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to}
                      className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 flex items-center justify-center md:justify-start gap-2 group"
                    >
                      <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">
              Free to start • Premium when you're ready • Built by humans figuring it out too
            </p>
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
