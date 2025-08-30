import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest,
    {params} : {params : Promise<{id: string}>}
) => {
    try {
       const { id } = await params;
       const { userId } = await auth();
       
       if (!userId){
         return NextResponse.json({error: "Unauthorized"}, {status: 401});
       }

       if (!id) {
        return NextResponse.json({error: "Design Not Found"}, {status: 404});
       }

       const existingDesign = await db.generateRoom.findUnique({
        where: {id},
       });

       if (!existingDesign) {
        return NextResponse.json({ error: "Design not Found"}, {status: 404});
       }

     const isAlreadyFavorite = existingDesign.favourites.includes(userId);

    const updateFavorites = isAlreadyFavorite ?existingDesign.favourites.filter((id) => id !== userId)
    : [...existingDesign.favourites, userId];

    const updateRoom = await db.generateRoom.update({
        where: { id },
        data: {favourites: updateFavorites},
    });

    return NextResponse.json({
        success: true,
        isFavorite: !isAlreadyFavorite,
        favourites: updateRoom.favourites,
    });


    } catch (error) {
        console.error("update API error:", error);
        return NextResponse.json(
            {error: "Failed to update result"},
            {status: 500}
        );
    }
};