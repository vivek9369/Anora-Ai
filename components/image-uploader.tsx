"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import {useDropzone} from 'react-dropzone'
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader, Trash } from 'lucide-react';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/config/firebase.config";
import { toast } from "sonner";
import { ProgressStatus } from "./progress-status";


interface ImageUploaderProps{
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string | null;
    location: string;
}


export const ImageUploader = ({
    disabled,
    onChange,
    onRemove,
    value,
    location,

} : ImageUploaderProps) => {    
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [onDeleteing, setOnDeleteing] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);



    useEffect(() =>{ 
    setIsMounted(true);
}, []);

const onDrop = (acceptedFiles : File[]) => {
    if(acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    onUpload(file);

};

 const {getRootProps, getInputProps, isDragActive, isDragReject} = 
 useDropzone({
    onDrop, 
    accept : {
    "image/*": [],
 },
 multiple: false,
});


const onUpload = (file : File) => {
   try {
    setIsLoading(true);
    const storageRef = ref(storage, `${location}/${Date.now()}-${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file, {contentType: file.type,      
    });
    uploadTask.on("state_changed", 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseFloat(progress.toFixed(2)));
        },
        (error) => {
           toast.error("Something went wrong", {description: (error as Error)?.message,
           });
           setIsLoading(false);
        },
      async () => {
        try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadUrl);
            toast.success("Success",{
                description: "Image uploaded Successfully",
            });
        } catch (error) {
             toast.error("Error on fetching Download URL", {description: (error as Error)?.message,
           });
        }finally{
            setIsLoading(false);
        }
      }
    );
   } catch (error) {
    
   }
    
};

const onDelete = async () => {
  setOnDeleteing(true)
  try {
    if(!value){
        toast.error("No Image to delete");
        return;
    }

    onRemove(value);

    const imageRef = ref(storage, value);
    await deleteObject(imageRef);
    toast.success("Image removed Sucessfully");
  } catch (error) {
    toast.error("Failed to delete image", {
        description: (error as Error).message,
    });
  }finally{
    setOnDeleteing(false);
  }
};

if(!isMounted) return null;


  return  ( 
  <div className="w-full">
    {value ? (
    <div className="w-full max-w-2xl flex-1/2 h-full aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-input bg-muted dark:bg-muted/50">
    <Image 
    fill
    className="w-full h-full object-cover"
    alt="Uploaded Image"
    src={value}
    priority
    />
    <div className="absolute z-10 top-2 right-2 cursor-pointer">
        <Button 
        size="icon" 
        variant={"destructive"} 
        className="cursor-pointer"
        onClick={onDelete}
        >
        {onDeleteing ? <Loader className="animate-spin"/> : <Trash />}
        </Button>
    </div>
    </div> 
    ) : (
     <div {...getRootProps({
        className : `w-full max-w-md aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed transition-colors ${
            isDragActive 
            ? "border-blue-500 bg-blue-100 dark:bg-blue-950" 
            : isDragReject 
            ? "border-red-500 bg-red-100 dark:bg-red-950"
            : "border-input bg-muted dark:bg-muted/50"
        }`,
     })}
     >
        <input {...getInputProps()} disabled={disabled} />
        {isLoading ? ( <div className="flex flex-col items-center text-center p-4">
            {/* progress */}
            <ProgressStatus progress={progress} />
        </div> 
         ): ( 
         <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-muted-foreground ">
            <ImagePlus className="w-10 h-10 " />
            <p className="text-sm text-muted-foreground">{isDragActive ? "Drop it here.." : "Drag & Drop an image, or click to select one"}</p>
         </div>
        )}
     </div>
   )}
  </div>
  );
};
