import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TextMorph } from "@/components/ui/text-morph";
import { GlowEffect } from "@/components/ui/glow-effect";
import { useState } from "react";
import { motion } from "motion/react";
import Editor from "@/components/editor/rich-editor";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  originalPrice: z.number().min(1, { message: "Price must be at least 1" }),
  sellingPrice: z.number().min(1, { message: "Price must be at least 1" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  category: z.string(),
  subCategory: z.string(),
  brand: z.string().min(3, { message: "Brand must be at least 3 characters" }),
  productDetails: z
    .string()
    .min(3, { message: "Product details must be at least 3 characters" }),
  productDescription: z
    .string()
    .min(3, { message: "Product description must be at least 3 characters" }),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Avatar is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Avatar size must be less than 5MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
      {
        message: "Only .jpg, .png, and .gif formats are supported.",
      }
    ),
  images: z
    .array(
      z
        .custom()
        .refine((file) => file instanceof File, "Each file must be valid.")
        .refine(
          (file) => file.size <= 3 * 1024 * 1024,
          (file) => ({
            message: `File ${file?.name || "uploaded"} exceeds 3MB limit.`,
          })
        )
        .refine(
          (file) => ["image/jpeg", "image/png"].includes(file.type),
          (file) => ({
            message: `File ${
              file?.name || "uploaded"
            } must be a .jpg or .png file.`,
          })
        )
    )
    .min(1, { message: "At least one thumbnail is required." })
    .max(5, { message: "You can upload up to 5 thumbnails." }),
  isPublic: z.boolean(),
});

function AddProductPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      originalPrice: undefined,
      sellingPrice: undefined,
      quantity: undefined,
      category: "",
      subCategory: "",
      brand: "",
      productDetails: "",
      productDescription: "",
      thumbnail: undefined,
      images: [],
      isPublic: false,
    },
  });
  const handleLoad = () => {
    if (isVisible) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  };

  function onSubmit(data: z.infer<typeof createProductSchema>) {
    console.log(data);
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
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand of Product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Quantity of Product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Original price of Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selling price of Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount</Label>
                  <Input placeholder="Discount of Product" />
                </div>
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Public</FormLabel>
                      <div className="flex space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <p className="text-sm leading-none text-muted-foreground">
                          If checked, this product will be public
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Category of Product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sub Category of Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          placeholder="thumbnail"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                            form.trigger("images");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Details</FormLabel>
                    <FormControl>
                      <Editor
                        placeholder="Product details"
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Details</FormLabel>
                    <FormControl>
                      <Editor
                        placeholder="Product description"
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" onClick={handleLoad}>
                <TextMorph className="text-foreground">
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

export default AddProductPage;
