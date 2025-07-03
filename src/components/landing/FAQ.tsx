import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FAQ = () => {
  const faqs = [
    {
      question: "How quickly will I see results?",
      answer: "Most clients see their first new reviews within 7-14 days of implementation. Our system is designed to generate 25+ reviews and double your profile views within 90 days, with many clients achieving these results much faster."
    },
    {
      question: "Is this compliant with Google's guidelines?",
      answer: "Absolutely. Our system uses 100% compliant methods that follow Google's Terms of Service. We focus on encouraging genuine reviews from real customers through ethical automation and timing optimization."
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "No technical knowledge required! Our team handles the complete setup and implementation for you. You'll get a simple dashboard to monitor your progress, and we provide full training and support."
    },
    {
      question: "How does the 90-day guarantee work?",
      answer: "If you don't achieve at least 25 new reviews and a 4.5+ star average within 90 days of implementation, we'll refund your investment in full. No questions asked."
    },
    {
      question: "Why offer lifetime access for £97?",
      answer: "We're building our case study database and want to prove our system works with a wide variety of UK businesses. After July 31st, this will only be available as a £297/month subscription."
    },
    {
      question: "Will this work for my specific trade?",
      answer: "Yes! Our system has been tested and proven effective across all local service industries including plumbing, electrical, roofing, cleaning, landscaping, HVAC, pest control, and more."
    },
    {
      question: "What ongoing support do I get?",
      answer: "You'll get priority email support, access to our knowledge base, monthly group strategy calls for the first 6 months, and lifetime access to all system updates and improvements."
    },
    {
      question: "Can I cancel anytime?",
      answer: "There's nothing to cancel! This is a one-time payment for lifetime access. No recurring fees, no hidden costs, no contracts."
    },
    {
      question: "How is this different from other review tools?",
      answer: "Most tools just send review requests. Our system includes complete Google Business Profile optimization, local SEO, automated follow-up sequences, reputation monitoring, and ongoing strategic support."
    },
    {
      question: "What if I already have some reviews?",
      answer: "Perfect! Our system works whether you have 0 reviews or 100. We'll analyze your current situation and optimize from there. Many clients with existing reviews see even faster results."
    }
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about the Local Market Domination System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Common Questions & Concerns</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-brand-blue-light border-primary/20">
            <p className="text-lg font-semibold text-foreground mb-2">
              Still have questions?
            </p>
            <p className="text-muted-foreground mb-4">
              Get in touch with our team for personalized answers.
            </p>
            <a 
              href="mailto:support@syngularitylabs.com" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              support@syngularitylabs.com
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};