import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, SquarePlus } from "lucide-react";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { TextMorph } from "@/components/ui/text-morph";
import { GlowEffect } from "@/components/ui/glow-effect";
import { motion } from "motion/react";
import { fetchCreateBanner } from "@/feature/bannerSlice";

const createBannerSchema = z.object({
  link: z.string().url({ message: "Please enter a valid URL." }),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Image size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function AddBannerPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<z.infer<typeof createBannerSchema>>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      link: "",
      image: undefined,
    },
  });

  const addBanner = useDispatchWithToast(fetchCreateBanner, {
    loadingMessage: "Adding banner...",
    getSuccessMessage(data) {
      setIsVisible(false);
      form.reset({
        link: "",
        image: undefined,
      });
      navigate("/admin/banners");
      return data.message || "Banner added successfully";
    },
    getErrorMessage(error) {
      setIsVisible(false);
      return (
        error.message || error || "Something went wrong while adding the banner"
      );
    },
  });

  function onSubmit(values: z.infer<typeof createBannerSchema>) {
    setIsVisible(true);
    const formData = new FormData();
    formData.append("link", values.link);
    formData.append("image", values.image);
    addBanner(formData);
  }
  return (
    <div className="relative w-full">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        <GlowEffect
          colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
          mode="colorShift"
          blur="medium"
          duration={4}
        />
      </motion.div>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Add Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                        placeholder="Image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isVisible}>
                {isVisible ? (
                  <Loader2
                    className="h-5 w-5 animate-spin text-white"
                    strokeWidth={4}
                  />
                ) : (
                  <SquarePlus className="h-5 w-5 text-white " />
                )}
                <TextMorph className="text-white">
                  {isVisible ? "Submitting..." : "Submit"}
                </TextMorph>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-end"></CardFooter>
      </Card>
    </div>
  );
}

export default AddBannerPage;
