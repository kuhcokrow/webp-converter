"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { ConvertSettings, OutputFormat } from "@/lib/converter/types";

interface SettingsPanelProps {
  settings: ConvertSettings;
  onChange: (settings: ConvertSettings) => void;
  disabled?: boolean;
}

export function SettingsPanel({ settings, onChange, disabled }: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
        <div className="flex flex-col gap-2">
          <label htmlFor="format" className="text-sm font-medium">
            Output format
          </label>
          <Select
            value={settings.format}
            onValueChange={(value) => onChange({ ...settings, format: value as OutputFormat })}
            disabled={disabled}
          >
            <SelectTrigger id="format" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="quality" className="text-sm font-medium">
            Quality: {settings.quality}
          </label>
          <Slider
            id="quality"
            min={1}
            max={100}
            step={1}
            value={[settings.quality]}
            onValueChange={([quality]) => onChange({ ...settings, quality })}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="maxWidth" className="text-sm font-medium">
            Max width (px)
          </label>
          <Input
            id="maxWidth"
            type="number"
            min={1}
            placeholder="Original"
            className="w-32"
            value={settings.maxWidth ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...settings,
                maxWidth: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="maxHeight" className="text-sm font-medium">
            Max height (px)
          </label>
          <Input
            id="maxHeight"
            type="number"
            min={1}
            placeholder="Original"
            className="w-32"
            value={settings.maxHeight ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...settings,
                maxHeight: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <label htmlFor="stripMetadata" className="flex items-center gap-2 text-sm font-medium">
          <Checkbox
            id="stripMetadata"
            checked={settings.stripMetadata}
            disabled={disabled}
            onCheckedChange={(checked) =>
              onChange({ ...settings, stripMetadata: checked === true })
            }
          />
          Strip metadata (EXIF)
        </label>
      </div>
    </div>
  );
}
