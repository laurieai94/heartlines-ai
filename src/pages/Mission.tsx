import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND } from "@/branding";
import { Heart, Users, Shield, Target } from "lucide-react";

const Mission = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering healthier relationships through AI-powered coaching and personalized insights
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="pt-8">
            <div className="text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-lg text-foreground leading-relaxed">
                At {BRAND.name}, we believe that strong, healthy relationships are the foundation of human happiness. 
                Our mission is to make relationship coaching accessible to everyone through advanced AI technology 
                that provides personalized insights, practical guidance, and ongoing support for building deeper connections.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Connection</CardTitle>
              <CardDescription>Building deeper, more meaningful relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We help people understand themselves and their partners better, fostering genuine connection 
                through improved communication and emotional intelligence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Your personal journey stays personal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We maintain the highest standards of privacy and security, ensuring your personal information 
                and relationship insights remain confidential and protected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Relationship coaching for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We make professional-quality relationship guidance accessible and affordable, 
                breaking down barriers to better relationships for people from all walks of life.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vision Statement */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Vision</CardTitle>
            <CardDescription>A world where healthy relationships flourish</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-foreground leading-relaxed">
              We envision a future where every person has access to the tools and knowledge they need 
              to build and maintain healthy, fulfilling relationships. Through innovative AI technology 
              and compassionate guidance, we're working to reduce relationship conflicts, improve 
              communication skills, and help people create the loving connections they deserve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mission;