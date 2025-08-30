"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

interface  CustomBreadCrumpProps{
    breadCrumpItems?: {link : string; label: string}[];
    breadCrumpPages : string
}

export const CustomBreadCrump = ({
    breadCrumpPages,
     breadCrumpItems
    } : CustomBreadCrumpProps) => {
  return <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink
       href="/" 
       className="flex items-center justify-center hover:text-pink-500">
        <Home className="w-4 h-4 mr-2 " /> 
      Home</BreadcrumbLink>
    </BreadcrumbItem>

{
    breadCrumpItems && (
        <React.Fragment>
            {
                breadCrumpItems.map((item ,idx) => (
                <React.Fragment key={idx + item.link}>
                <BreadcrumbSeparator /> 
                <BreadcrumbItem>
                <BreadcrumbLink href={item.link} className="hover:text-yellow-500">
                {item.label}
                </BreadcrumbLink>
                </BreadcrumbItem>   
                </React.Fragment>

                )
            )}
        </React.Fragment>
    )
}  
 
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>{breadCrumpPages}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
  
};

