"use client";

import { CustomSelect } from "@/components/custom-select";
import { ImageUploader } from "@/components/image-uploader";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

import { ProgressStatus } from "@/components/progress-status";
import { TooltipButton } from "@/components/tool-tip-butoon";
import { Textarea } from "@/components/ui/textarea";
import { aiStyles, roomStyles } from "@/lib/helper";
import { FilterX, Info, Loader, RefreshCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateFromHuggingFaceModel } from "@/actions/generate-from-hugging-face";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ClientProps{
    user: {
        id : string,
        fullName : string | null,
        imageUrl : string,
        email : string
    }
}

export const Client = ({ user } : ClientProps) => {

    const [room, setroom] = useState<string | null>(null);
    const [aiStyle, setAiStyle] = useState<string | null>(null);
    const [prompt, setprompt] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [outputImage, setOutputImage] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [progress, setProgress] = useState<number>(0);

  const router = useRouter();



    const handleRoomChange = (value : string) => {
        setroom(value);

    };

    const handleAiStyleChange = (value : string) => {
        setAiStyle(value);
    };

    const handlePromptChange = (e : React.ChangeEvent <HTMLTextAreaElement>) => {
        setprompt(e.target.value);
    };

    const handleRoomReset = () => {
      setroom(null);
    };

    const handleStyleReset = () => {
      setAiStyle(null);
    }

  const clearAllFilters = () => {
  if (uploadedImage && !isSaving) {
    toast.warning(
      "Please delete the uploaded image before clearing filters."
    );
    return;
  }

  handleRoomReset();
  handleStyleReset();
  setprompt("");
  setOutputImage(null);
  setUploadedImage(null);
  setProgress(0);
  setIsSaving(false); // Optional: reset saving state
};

const clearAfterSave = () => {
  setUploadedImage(null);
  setOutputImage(null);
  setprompt("");
  setroom(null);
  setAiStyle(null);
  setProgress(0);
  setIsSaving(false);
};

    const saveTheResult = async () => {
      if(!uploadedImage || !outputImage) {
        toast.error("Please generate an image before saving.");
        return;
      }

      try {
        setIsSaving(true);
        const response = await axios.post("/api/results", {
          uploadedImage,
            outputImage,
             prompt,
            roomStyle: room ?? "Default",
            aiStyle: aiStyle ?? "Default",
            userName: user.fullName ?? "Unknown User",
            userImage: user.imageUrl ?? "/assets/img/avatar.jpg",          
        })
        if (response.data?.success){
          toast.success("Result saved successfully!");
          router.refresh();
          clearAfterSave();
        }else{
          toast.error("Something went wrong. Could not save.");
        }
      } catch (error) {
        
      }finally{
        setIsSaving(false);
      }
    };
    const handleGenerate = async () => {
      if(!uploadedImage) return;
      try {
        setLoading(true);
      
        const result = await generateFromHuggingFaceModel({
          imageUrl : uploadedImage,
          prompt : `${prompt} ${room ? `Room Style : ${room}` : ""} ${
            aiStyle ? `Ai Style : ${aiStyle}` : ""
          }.  Make sure the image is high quality (1080p) and make sure the ratio is 16:9 and visually appealing. `,
        });
      
        setOutputImage(result);

      } catch (error) {
        toast.error("Failed to generate room design. Please try again.");
      }finally{
        setLoading(false);
      }
    };
    const handleImageChange = (url : string) => {
      setUploadedImage(url); 
    };
    const handleImageRemove = () => {
      setUploadedImage(null);
    };

  useEffect(() => {
  let interval: NodeJS.Timeout;

  if (loading) {
    setProgress(0);
    interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev));
    }, 300);
  } else if (!loading && progress !== 0) {
    setProgress(100);
    const timeout = setTimeout(() => setProgress(0), 1000);
    return () => clearTimeout(timeout);
  }

  return () => clearInterval(interval);
}, [loading]);


    

  return (
     <div className="my-12 w-full p-4 rounded-md border border-input space-y-4">
    
    <div className="w-full grid grid-cols-1 min-md:grid-cols-3 gap-4">
        <div className="w-full space-y-4 col-span-1 p-10 border border-input rounded-md">
            <CustomSelect
            placeholder="Select Room Style"
            options={roomStyles}
            onChange={handleRoomChange}
            value={room}
              />
            <CustomSelect
            placeholder="Select AI Style"
            options={aiStyles}
            onChange={handleAiStyleChange}
            value={aiStyle}
              />

        </div>
          <div className="w-full space-y-4 col-span-2 relative p-10 border border-input rounded-md">
            <Textarea  
              placeholder="Type your Prompt here..."
              value={prompt}
              onChange={handlePromptChange}
              className="min-h-[100px]"      
            />

            <div className="absolute top-0 right-0 ">
              <TooltipButton 
                 content="Clear all filters"
                 onClick={clearAllFilters}
                 icon={<FilterX className="min-w-4 min-h-4"/>}
              />

            <TooltipButton 
              content="Save the Result"
              onClick={saveTheResult}
              icon={<Save className="min-w-4 min-h-4"/>}
              disabled={!outputImage || isSaving}
              loading={isSaving}
            />
            </div>

            <TooltipButton
            content="Generate"
            icon={<RefreshCcw />}
            onClick={handleGenerate}
            label="Generate"
            buttonSize="default"
            buttonVariant={"default"}
            loading={loading}
            buttonClassName="w-full"
            disabled={!uploadedImage || loading}
            />
            
        </div>
    </div>

    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
    <ImageUploader 
    location="clients"
    onChange={handleImageChange}
    onRemove={handleImageRemove}
    value={uploadedImage}  
    />
    <div className="w-full min-h-[300px] aspect-square relative rounded-md border border-input bg-muted dark:bg-muted/50">
    {loading && !outputImage &&(
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg text-blue-500 animate-pulse">
            Generating...
            </span>
        </div>
      
      <div className="w-full mt-4 h-40 flex items-center justify-center">
        <ProgressStatus progress={progress} size="sm"/>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span>Keep waiting, this might take a while... Please dont &apos; close the tab        
        </span>
      </div>
      </div>
    )}

    {!loading && !outputImage && (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Info className="my-2 text-muted-foreground"/>
        <span className="text-lg text-muted-foreground">Start Analysing the image...</span>
      </div>
    )}

    {outputImage && (
    <ReactBeforeSliderComponent
    firstImage={{
      imageUrl : uploadedImage || "https://placehold.co/600x400",
    }}
    secondImage={{
      imageUrl : outputImage || "https://placehold.co/600x400",
    }}
/>
    )}
     </div>
    </div>
  </div>
  );
};

