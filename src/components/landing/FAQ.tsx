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
      answer: "Most clients see their first automated review requests within 7 days. Expect 25+ reviews, 4.5+ star average, and 2x profile views within 90 days. Many tradespeople see dramatic improvements in 30 days - our system works fast because it targets the exact moments when customers are most likely to leave positive reviews."
    },
    {
      question: "Is this compliant with Google's guidelines?",
      answer: "Absolutely. Our system uses 100% compliant methods that follow Google's Terms of Service. We focus on encouraging genuine reviews from real customers through ethical automation and timing optimization."
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "Perfect - this is designed for busy tradespeople, not tech experts. We handle 100% of the setup. You just keep doing great work, and the system automatically asks your happy customers for reviews. Simple dashboard shows your progress. If you can use WhatsApp, you can use this."
    },
    {
      question: "How does the guarantee work?",
      answer: "Simple: If you don't hit 25+ reviews, 4.5+ stars, 2x profile views, and 100% profile completion within 90 days, we work for free until you do. If we still can't deliver, full refund. We're that confident because this system works for every type of local business."
    },
    {
      question: "Why offer lifetime access for £97?",
      answer: "We're building case studies across different UK trades to prove our system works universally. After July 31st, this goes to £247/month minimum. Your £97 rate is locked forever - even if we increase to £300-400+ later. This offer lets us quickly gather diverse success stories."
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
      answer: "Basic tools cost £70-130 and just send review requests. Enterprise solutions cost £400+ monthly. We bridge that gap - giving you enterprise-level AI automation, complete Google optimization, 50+ directory listings, reputation monitoring, and customer journey automation, specifically designed for UK tradespeople."
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