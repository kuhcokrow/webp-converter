import { Converter } from "@/components/converter/converter";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Image Converter</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Convert JPG, PNG, GIF, BMP and TIFF images to modern WebP or AVIF format.
        </p>
      </div>
      <Converter />
    </main>
  );
}
