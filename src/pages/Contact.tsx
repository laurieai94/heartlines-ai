import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/branding";
import { Mail, MessageSquare, Send } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignInClick = () => {
    // Handle sign in
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - {BRAND.name}</title>
        <meta name="description" content="Get in touch with the heartlines team. We're here to help with questions about our AI-powered relationship coaching platform." />
      </Helmet>
      
      <div className="min-h-screen bg-burgundy-900 flex flex-col">
        <SimpleHeader 
          user={user}
          activeTab="contact"
          onSignInClick={handleSignInClick}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold questionnaire-text mb-4 font-brand">Let's Connect</h1>
            <p className="text-xl questionnaire-text-muted max-w-2xl mx-auto">
              Got questions, feedback, or ideas?<br />
              Drop us a note — we actually read these.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="questionnaire-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-filter backdrop-blur-sm">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold questionnaire-text">Send us a message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="questionnaire-input placeholder:text-[#ff6b9d]/80"
                    placeholder="What should we call you?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="questionnaire-input placeholder:text-[#ff6b9d]/80"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="questionnaire-input placeholder:text-[#ff6b9d]/80"
                    placeholder="What's up?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium questionnaire-text-muted mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="questionnaire-input min-h-[150px] placeholder:text-[#ff6b9d]/80"
                    placeholder="Spill the details..."
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white"
                >
                  {isSubmitting ? "Sending..." : "Send ✈️"}
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="questionnaire-card p-6">
                <h3 className="text-xl font-semibold questionnaire-text mb-4">Support</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  Need help? Reach out here and we'll get back within 1–2 days.
                </p>
              </Card>

              <Card className="questionnaire-card p-6">
                <h3 className="text-xl font-semibold questionnaire-text mb-4">Feedback</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  We're always leveling up heartlines. Share your thoughts and help us make it better for everyone.
                </p>
              </Card>

              <Card className="questionnaire-card p-6">
                <h3 className="text-xl font-semibold questionnaire-text mb-4">Partnerships</h3>
                <p className="questionnaire-text-muted leading-relaxed mb-4">
                  Want to collab? Pop "Partnership" in the subject line and let's chat.
                </p>
              </Card>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
};

export default Contact;
