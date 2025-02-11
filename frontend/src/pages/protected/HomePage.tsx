// function HomePage() {
//   return (
//     <div>
//       <h1 className="text-center text-xl font-bold">Home page</h1>
//     </div>
//   );
// }

// export default HomePage;

import { useState, useEffect } from "react";

export default function HomePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingImage, setLoadingImage] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [upscaling, setUpscaling] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setProgress(0);

    try {
      const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "A scenic landscape with mountains during sunset",
          sampler_name: "Euler",
          steps: 50,
          cfg_scale: 7.5,
          width: 512,
          height: 512,
          seed: Math.floor(Math.random() * 1000000000),
        }),
      });

      const data = await response.json();

      if (data.images && data.images.length > 0) {
        setImageSrc(`data:image/png;base64,${data.images[0]}`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }

    setLoading(false);
    setProgress(100);
  };

  const checkProgress = async () => {
    while (loading) {
      try {
        const response = await fetch("http://127.0.0.1:7860/sdapi/v1/progress");
        const data = await response.json();
        setProgress(Math.round(data.progress * 100)); // Convert 0-1 range to 0-100%
        setLoadingImage(`data:image/png;base64,${data.current_image}`);

        if (data.progress === 0.99 || canceled) {
          break;
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before polling again
    }
  };

  const upscaleImage = async () => {
    if (!imageSrc) return;

    setUpscaling(true);

    try {
      const base64Image = imageSrc.split(",")[1]; // Remove "data:image/png;base64," prefix

      const response = await fetch(
        "http://127.0.0.1:7860/sdapi/v1/extra-single-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64Image, // Send only the Base64 data
            resize_mode: 0, // 0 = Scale by factor, 1 = Scale to exact size
            upscaling_resize: 2, // Scale by 2x
            upscaler_1: "ESRGAN_4x", // Choose an upscaler (check API for available options)
            upscaling_crop: false, // Avoid cropping
          }),
        }
      );

      const data = await response.json();
      if (data.image) {
        setUpscaledImage(`data:image/png;base64,${data.image}`); // Set new upscaled image
      }
    } catch (error) {
      console.error("Error upscaling image:", error);
    }

    setUpscaling(false);
  };

  useEffect(() => {
    if (loading) {
      checkProgress();
    }
  }, [loading]);

  return (
    <div className="w-full flex flex-col items-center space-y-4 p-4">
      <button
        onClick={generateImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {/* Progress Bar */}
      {loading && (
        <div className="w-full max-w-md bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {loading && loadingImage && (
        <img
          src={loadingImage}
          alt="Generating"
          className="rounded-lg shadow-lg max-w-full mt-4"
        />
      )}
      {/* Display Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Generated"
          className="rounded-lg shadow-lg max-w-full mt-4"
        />
      )}
      {imageSrc && (
        <button
          onClick={upscaleImage}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg mt-2"
          disabled={upscaling}
        >
          {upscaling ? "Upscaling..." : "Upscale Image"}
        </button>
      )}
      {upscaledImage && (
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = upscaledImage;
            link.download = "upscaledImage.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg mt-2"
        >
          Download Upscaled Image
        </button>
      )}

      {imageSrc && (
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = imageSrc;
            link.download = "generated_image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg mt-2"
        >
          Download Image
        </button>
      )}
      {loading && (
        <button
          onClick={async () => {
            await fetch("http://127.0.0.1:7860/sdapi/v1/interrupt", {
              method: "POST",
            });
            setLoading(false);
            setProgress(0);
            setCanceled(true);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg mt-2"
        >
          Cancel Generation
        </button>
      )}
    </div>
  );
}
