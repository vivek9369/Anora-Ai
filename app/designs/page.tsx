import { fetchGeneratedDesigns } from "@/actions/fetch-all-designs-by-userId-and-all";
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/container";
import { Designs } from "@/components/designs";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { FilterControls } from "./_components/filter-controls";

interface DesignsPageProps{
    searchParams?: Promise<{
        popularity?: "popular_asc" | "popular_desc";
        date?: "date_asc" | "date_desc"
    }>;
}

interface DesignsWrapperPrpos{
    popularity?: "popular_asc" | "popular_desc";
    date?: "date_asc" | "date_desc";
    userId: string | null;
}

const DesignsWrapper = async ({
    popularity,
    date,
    userId,
} : DesignsWrapperPrpos) => {
    const designs = await fetchGeneratedDesigns(null, popularity, date);
    return <Designs  designs={designs} isDesignPage userId={userId}/>
};

const DesignsSkeleton = () => {
    return (
    
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {Array.from({ length: 6 }).map((_, idx) => (
    <div key={idx} className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
))}
</div>
    )

}



const DesignsPage = async({ searchParams } : DesignsPageProps) => {

    const resolvedParams = await searchParams;

    const popularity = resolvedParams?.popularity;
    const date = resolvedParams?.date;

   const {userId} = await auth();
 
  return <section>
    <Container className="p-4 min-md:p-8 space-y-8">
        <FilterControls />

        <Suspense key={popularity} fallback={<DesignsSkeleton />}>
        <DesignsWrapper  popularity={popularity} date={date} userId={userId} />

        
        
        </Suspense>
    </Container>
  </section>
};

export default DesignsPage;