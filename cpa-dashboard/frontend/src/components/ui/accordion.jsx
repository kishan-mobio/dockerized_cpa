"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/utils/methods/cn";

function Accordion({ ...props }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "bg-[#f7f8fa] rounded-2xl shadow-lg border border-gray-200 p-2 md:p-4 space-y-2",
        props.className
      )}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-xl overflow-hidden bg-white border border-gray-200 transition-shadow duration-200 hover:shadow-md focus-within:shadow-lg mb-2",
        className
      )}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-4 px-6 py-5 text-base font-semibold text-[#23235F] bg-white rounded-xl transition-all duration-200 outline-none border-none shadow-none hover:bg-[#eef2ff] focus:bg-[#e0e7ff] focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 cursor-pointer group [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-3 group-hover:text-primary-700 transition-colors duration-200">
          {children}
        </span>
        <ChevronDownIcon className="text-gray-400 pointer-events-none size-5 shrink-0 translate-y-0.5 transition-transform duration-200 group-hover:text-primary-500" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-base bg-[#f7f8fa] px-6 pb-6 pt-0 border-t border-gray-100"
      {...props}
    >
      <div className={cn("pt-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
