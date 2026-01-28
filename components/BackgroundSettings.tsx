"use client";

import { useState } from "react";
import { useBackgroundSettings } from "@/hooks/useBackgroundSettings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BackgroundSettings({ open, onOpenChange }: BackgroundSettingsProps) {
  const { backgroundImage, blur, setBackgroundImage, setBlur, clearBackground } = useBackgroundSettings();
  const [imageUrl, setImageUrl] = useState(backgroundImage || "");

  const handleApply = () => {
    if (imageUrl.trim()) {
      setBackgroundImage(imageUrl);
    }
  };

  const handleClear = () => {
    clearBackground();
    setImageUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Background Settings</DialogTitle>
          <DialogDescription>
            Customize your app background with an image and blur effect.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="image-url" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="blur" className="text-sm font-medium">
              Blur Level: {blur}px
            </label>
            <input
              id="blur"
              type="range"
              min={0}
              max={20}
              step={1}
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              Apply
            </Button>
            <Button onClick={handleClear} variant="outline" className="flex-1">
              Clear Background
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
