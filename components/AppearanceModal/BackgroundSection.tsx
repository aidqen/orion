'use client';

import { Switch } from './Switch';
import { BackgroundUploadPanel } from './BackgroundUploadPanel';
import { BackgroundControls } from './BackgroundControls';
import { BackgroundImageGrid } from './BackgroundImageGrid';
import { backgroundCategories } from './constants';
import { useBackgroundStore } from '@/store/useBackgroundStore';


export function BackgroundSection() {
  const {
    backgroundImage,
    blurEnabled,
    backgroundEnabled,
    setBackgroundImage,
    setBlurEnabled,
    setBackgroundEnabled
  } = useBackgroundStore();

  const handleUploadClick = () => {
    // TODO: Implement file upload
    console.log('Upload clicked');
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-medium text-[#111827] dark:text-[#E5E7EB]">
            Background
          </h3>
          <h3 className="text-[14px] text-[#6B7280] dark:text-[#9CA3AF]">
            Customize your background
          </h3>
        </div>
        <Switch checked={backgroundEnabled} onChange={setBackgroundEnabled} disabled={false} />
      </div>

      {backgroundEnabled && (
        <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BackgroundUploadPanel
              currentImage={backgroundImage}
              onUploadClick={handleUploadClick}
            />

            <BackgroundControls
              blurEnabled={blurEnabled}
              onBlurToggle={setBlurEnabled}
            />
          </div>

          <div className="space-y-6">
            {backgroundCategories.map((category) => (
              <BackgroundImageGrid
                key={category.id}
                category={category}
                onImageSelect={setBackgroundImage}
                selectedImageUrl={backgroundImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

