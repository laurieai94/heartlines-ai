import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/branding";
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema } from "@/utils/contactValidation";
import PremiumBackground from "@/components/PremiumBackground";
const Contact = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSignInClick = () => {
    navigate('/signin');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);

      // Call edge function
      const {
        data,
        error
      } = await supabase.functions.invoke('send-contact-email', {
        body: validatedData
      });
      if (error) throw error;
      toast.success("Message sent! We'll get back to you soon.", {
        icon: <Sparkles className="w-5 h-5 text-coral-400" />
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      if (error.errors) {
        // Zod validation errors
        error.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return <>
      <Helmet>
        <title>Contact Us - {BRAND.name}</title>
        <meta name="description" content="Get in touch with the heartlines team. We're here to help with questions about our AI-powered relationship coaching platform." />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-800 flex flex-col relative landing-page-scroll">
        <PremiumBackground />
        <SimpleHeader user={user} activeTab="home" onSignInClick={handleSignInClick} />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-brand text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent leading-none tracking-wider mb-4" style={{
            textShadow: '0 2px 10px rgba(236, 72, 153, 0.6), 0 4px 20px rgba(251, 146, 60, 0.5), 0 8px 30px rgba(236, 72, 153, 0.3)'
          }}>
              let's connect
            </h1>
            <p className="text-xl questionnaire-text-muted max-w-2xl mx-auto">
              got questions, feedback, or ideas?<br />
              drop us a note — we actually read these.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="glass-contact-card floating-card p-6 animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="playful-icon-container w-12 h-12 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    name
                  </label>
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="glass-input-enhanced placeholder:text-[#ff6b9d]/80 text-white" placeholder="what should we call you?" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    email
                  </label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="glass-input-enhanced placeholder:text-[#ff6b9d]/80 text-white" placeholder="your email" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    subject
                  </label>
                  <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required className="glass-input-enhanced placeholder:text-[#ff6b9d]/80 text-white" placeholder="what's up?" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    message
                  </label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="glass-input-enhanced min-h-[150px] placeholder:text-[#ff6b9d]/80 text-white" placeholder="spill the details..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="
                    playful-send-button
                    w-full
                    flex items-center justify-center gap-2
                    rounded-xl
                    py-3
                    text-white font-semibold text-sm md:text-base
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-offset-0
                    focus-visible:ring-[hsl(var(--coral-400))]
                    transition-all duration-300
                  ">
                  {isSubmitting ? "sending..." : <>
                      send
                      <Send className="w-4 h-4" />
                    </>}
                </button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="glass-contact-card floating-card p-6 animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
                <h3 className="text-xl font-semibold questionnaire-text mb-4">support</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  need help? reach out here and we'll get back within 1–2 days.
                </p>
              </Card>

              <Card className="glass-contact-card floating-card p-6 animate-fade-in" style={{
              animationDelay: '0.3s'
            }}>
                <h3 className="text-xl font-semibold questionnaire-text mb-4">feedback</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  we're always leveling up <span className="font-brand">heartlines</span>. share your thoughts and help us make it better for everyone.
                </p>
              </Card>

              <Card className="glass-contact-card floating-card p-6 animate-fade-in" style={{
              animationDelay: '0.4s'
            }}>
                <h3 className="text-xl font-semibold questionnaire-text mb-4">partnerships</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  want to collab? pop "partnership" in the subject line and let's chat.
                </p>
              </Card>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>;
};
export default Contact;