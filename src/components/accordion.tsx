import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function Faqs() {
    return (
      <section className="bg-[#F5F5F5] py-8 md:py-16 font-sans flex flex-col justify-center items-center">
        <h1 className="md:text-3xl text-2xl font-bold">Frequently asked questions</h1>
        <p className="text-[#4E4E4E] mt-3">All you need to know about Rentam360</p>
        <Accordion type="single" collapsible className="w-full p-8 md:w-1/2">
            <AccordionItem value="item-1" className="bg-white mb-2 px-6 rounded-[6px]">
            <AccordionTrigger className="no-underline text-sm md:text-[18px]">How do I rent equipment on Rentam360?</AccordionTrigger>
            <AccordionContent className="text-[#898A8D]">
                Booking is simple search for your desired item, select your duration and complete your booking with few taps
            </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-white mb-2 px-6 rounded-[6px]">
            <AccordionTrigger className="no-underline text-sm md:text-[18px]">Are the Equipment on Rentam360 verified?</AccordionTrigger>
            <AccordionContent className="text-[#898A8D]">
                Booking is simple search for your desired item, select your duration and complete your booking with few taps
            </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-white mb-2 px-6 rounded-[6px]">
            <AccordionTrigger className="no-underline text-sm md:text-[18px]">What payment method are accepted?</AccordionTrigger>
            <AccordionContent className="text-[#898A8D]">
                Booking is simple search for your desired item, select your duration and complete your booking with few taps
            </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-white px-6 rounded-[6px]">
            <AccordionTrigger className="no-underline text-sm md:text-[18px]">Can I cancel or modify my booking?</AccordionTrigger>
            <AccordionContent className="text-[#898A8D]">
                Booking is simple search for your desired item, select your duration and complete your booking with few taps
            </AccordionContent>
            </AccordionItem>
        </Accordion>
      </section>
    )
  }
  