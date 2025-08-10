import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="h-full py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">About RealTalk</h1>
        <p className="text-muted-foreground">Learn more about our mission and team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Helping people build better relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              RealTalk is dedicated to providing AI-powered relationship coaching that helps 
              individuals and couples communicate more effectively, understand each other better, 
              and build stronger, healthier relationships.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
            <CardDescription>AI-powered relationship insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We use advanced AI technology to analyze communication patterns, provide 
              personalized insights, and offer actionable advice tailored to your unique 
              relationship dynamics and personal profile.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Your data is safe with us</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We prioritize your privacy and security. All personal information and 
              conversations are encrypted and stored securely. We never share your 
              data with third parties without your explicit consent.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Get in touch with our team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Have questions or feedback? We'd love to hear from you. Reach out to us 
              for support, suggestions, or partnership opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Company;