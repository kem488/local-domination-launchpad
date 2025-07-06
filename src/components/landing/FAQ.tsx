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
      question: "What exactly will I discover about my Google Business Profile?",
      answer: "You'll see your profile completeness score, missing information, photo quality assessment, review generation opportunities, and specific steps to improve your local search visibility and customer conversion rate."
    },
    {
      question: "How is this different from other analysis tools?",
      answer: "We use live Google data and focus specifically on profile optimization factors that directly impact your ranking and customer calls. Our AI provides specific, actionable recommendations rather than generic advice."
    },
    {
      question: "What if my profile is already complete?",
      answer: "Even complete profiles often miss optimization opportunities. Our AI identifies advanced factors like photo optimization, review response strategies, and conversion improvements that most businesses overlook."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most clients see first automated review requests within 7 days. Expect 25+ reviews, 4.5+ star average, and 2x profile views within 90 days. Our system works fast by targeting exact moments when customers are most likely to leave positive reviews."
    },
    {
      question: "Is this compliant with Google's guidelines?",
      answer: "Absolutely. Our system uses 100% compliant methods that follow Google's Terms of Service. We focus on encouraging genuine reviews from real customers through ethical automation and timing optimization."
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "Perfect - designed for busy tradespeople, not tech experts. We handle 100% of setup. You keep doing great work, the system automatically asks happy customers for reviews. Simple dashboard shows progress."
    },
    {
      question: "How does the guarantee work?",
      answer: "Simple: If you don't hit 25+ reviews, 4.5+ stars, 2x profile views, and 100% profile completion within 90 days, we work for free until you do. If we still can't deliver, full refund."
    },
    {
      question: "Why offer lifetime access for £97?",
      answer: "We're building case studies across UK trades to prove our system works universally. After July 31st, this goes to £247/month minimum. Your £97 rate is locked forever - even if we increase to £300-400+ later."
    },
    {
      question: "Will this work for my specific trade?",
      answer: "Yes! Our system has been tested and proven effective across all local service industries including plumbing, electrical, roofing, cleaning, landscaping, HVAC, pest control, and more."
    },
    {
      question: "What if I already have some reviews?",
      answer: "Perfect! Our system works whether you have 0 reviews or 100. We'll analyze your current situation and optimize from there. Many clients with existing reviews see even faster results because we can identify exactly what's working and amplify it."
    }
  ];

  return (
    <section id="faq" className="mobile-padding bg-gradient-to-br from-muted/20 via-section-muted to-muted/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            Everything you need to know about the Local Market Domination System
          </p>
        </div>

        <Card className="card-modern shadow-strong">
          <CardHeader className="pb-6">
            <CardTitle className="text-center text-xl sm:text-2xl lg:text-3xl">Common Questions & Concerns</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-4 hover:border-primary/30 transition-colors duration-300">
                  <AccordionTrigger className="text-left hover:text-primary py-4 text-sm sm:text-base lg:text-lg font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-12 lg:mt-16">
          <Card className="inline-block p-6 lg:p-8 bg-gradient-to-r from-primary/10 via-brand-blue-light to-primary/10 border-primary/20 shadow-medium hover:shadow-strong transition-all duration-300 max-w-2xl">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3">
              Still have questions?
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
              Get in touch with our team for personalized answers.
            </p>
            <a 
              href="mailto:admin@gudmedia.co.uk" 
              className="text-primary hover:text-primary/80 font-semibold text-lg underline underline-offset-4 hover:underline-offset-8 transition-all duration-300"
            >
              admin@gudmedia.co.uk
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};