import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import FadeInWhenVisible from "./ui/FadeInWhenVisible"
  
  export function Faqs() {
    return (
      <section className="bg-[#F5F5F5] py-8 md:py-16 font-sans flex flex-col justify-center items-center">
        <FadeInWhenVisible>
          <h1 className="md:text-3xl text-2xl font-bold">Frequently asked questions</h1>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <p className="text-[#4E4E4E] mt-3">All you need to know about Rentam360</p>
        </FadeInWhenVisible>
        <Accordion type="single" collapsible className="w-full p-8 md:w-1/2">
          {[
            "How do I rent equipment on Rentam360?",
            "Are the Equipment on Rentam360 verified?",
            "What payment method are accepted?",
            "Can I cancel or modify my booking?",
          ].map((question, index) => (
            <FadeInWhenVisible key={index}>
                <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="bg-white mb-2 px-6 rounded-[6px]"
              >
                <AccordionTrigger className="no-underline text-sm md:text-[18px]">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-[#898A8D]">
                  Booking is simple — search for your desired item, select your duration, and complete your booking in a few taps.
                </AccordionContent>
              </AccordionItem>
            </FadeInWhenVisible>
          ))}
        </Accordion>
      </section>
    )
  }
  