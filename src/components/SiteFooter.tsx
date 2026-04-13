import { Link, useNavigate } from "react-router-dom";
import { User, MessageSquare, Settings, Shield, CreditCard, FileText, Mail, Target } from "lucide-react";
import { BRAND } from "@/branding";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";
import { useAuth } from "@/contexts/AuthContext";
const SiteFooter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin');
    } else {
      navigate('/account');
    }
  };

  const footerSections = [{
    title: "app",
    links: [{
      to: "/profile",
      label: "profile",
      icon: User
    }, {
      to: "/coach",
      label: "coach",
      icon: MessageSquare
    }, {
      to: "/account",
      label: "account",
      icon: Settings
    }, {
      to: "/plans",
      label: "plans",
      icon: CreditCard
    }]
  }, {
    title: "company",
    links: [{
      to: "/mission",
      label: "mission",
      icon: Target
    }, {
      to: "/privacy-and-security",
      label: "privacy",
      icon: Shield
    }, {
      to: "/terms",
      label: "terms",
      icon: FileText
    }, {
      to: "/contact",
      label: "contact",
      icon: Mail
    }]
  }];
  return <footer className="py-12 bg-black/50 backdrop-blur-sm border-t border-white/10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout: Brand on top, then 2 columns */}
        <div className="md:hidden mb-8">
          {/* Brand Section - Full Width */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-1 font-brand inline-flex items-center gap-2 justify-center"><FlipPhoneIcon size={28} />{BRAND.name}</h3>
            <p className="text-white/50 text-xs mb-3">powered by laurie ai</p>
            <p className="text-white/70 text-sm leading-relaxed font-semibold mb-1">
              stronger relationships start here
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              the ai relationship coach for messy, modern love.
            </p>
          </div>

          {/* App & Company - Two Columns */}
          <div className="grid grid-cols-2 gap-8">
            {footerSections.map(section => <div key={section.title} className="text-center">
                <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map(link => <li key={link.to}>
                      {link.to === '/account' ? (
                        <button
                          onClick={handleAccountClick}
                          className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 inline-flex items-center gap-2 group w-auto mx-auto"
                        >
                          <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                          {link.label}
                        </button>
                      ) : (
                        <Link to={link.to} className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 inline-flex items-center gap-2 group w-auto mx-auto">
                          <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                          {link.label}
                        </Link>
                      )}
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>

        {/* Desktop/Tablet Layout: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Brand Section */}
          <div className="text-left">
            <h3 className="text-xl font-semibold text-white mb-1 font-brand inline-flex items-center gap-2"><FlipPhoneIcon size={28} />{BRAND.name}</h3>
            <p className="text-white/50 text-xs mb-3">powered by laurie ai</p>
            <p className="text-white/70 text-sm leading-relaxed font-semibold">
              stronger relationships start here
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              the ai relationship coach for messy, modern love.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map(section => <div key={section.title} className="text-left">
              <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => <li key={link.to}>
                    {link.to === '/account' ? (
                      <button
                        onClick={handleAccountClick}
                        className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 inline-flex items-center gap-2 group w-auto"
                      >
                        <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                        {link.label}
                      </button>
                    ) : (
                      <Link to={link.to} className="text-white/70 hover:text-white/90 text-sm motion-safe:transition-colors motion-safe:duration-150 inline-flex items-center gap-2 group w-auto">
                        <link.icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    )}
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">built by humans figuring it out too</p>
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} {BRAND.name}. all rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default SiteFooter;