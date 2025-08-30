"use client";

import { NavRoutes } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMenuProps{
    isMobile?: boolean;
}

 export const NavMenu = ({isMobile} : NavMenuProps) => {

   const  {isSignedIn} = useAuth();
   const pathname = usePathname();

   // only include public routes or protected ones if the user is signed in 

   const filterredRoutes = NavRoutes.filter(
    (route) => !route.protected || isSignedIn);

  return (
  <nav className={cn("flex gap-8", isMobile && "flex-col items-start gap-12")}>
    {filterredRoutes.map(route => {
        // fix use exact match for home routes prevent highlighting on all routes
        const isActive = route.link === "/" ? pathname === "/" : 
        pathname.startsWith(route.link);

        return (
            <Link key={route.link} href={route.link} className={cn("text-white/70 hover:text-white transition", isActive && "text-white font-semibold")}>
             {route.label}
            </Link>
        )
    })}
  </nav>
  );
  
};
