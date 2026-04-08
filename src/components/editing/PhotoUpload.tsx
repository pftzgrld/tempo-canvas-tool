import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PhotoUploadProps {
  currentUrl: string | null | undefined;
  name: string;
  onUpload: (url: string) => Promise<void>;
  isEditable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PhotoUpload({
  currentUrl,
  name,
  onUpload,
  isEditable = false,
  size = "md",
  className,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleClick = () => {
    if (isEditable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, WebP, or GIF image");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `members/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("team-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("team-photos")
        .getPublicUrl(filePath);

      // Update the team member with new photo URL
      await onUpload(urlData.publicUrl);
      toast.success("Photo updated");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <Avatar
        className={cn(
          sizeClasses[size],
          "ring-2 ring-background shadow shrink-0",
          isEditable && "cursor-pointer"
        )}
        onClick={handleClick}
      >
        <AvatarImage src={currentUrl || undefined} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground font-serif-display font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      {isEditable && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity cursor-pointer",
            isUploading ? "opacity-100" : "group-hover:opacity-100"
          )}
          onClick={handleClick}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <Camera className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
