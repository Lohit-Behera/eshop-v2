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
  FormDescription,
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Square, SquarePlus } from "lucide-react";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { fetchCreateProduct } from "@/feature/productSlice";

const createProductSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  originalPrice: z.number().min(1, { message: "Price must be at least 1" }),
  sellingPrice: z.number().min(1, { message: "Price must be at least 1" }),
  stock: z.number().min(1, { message: "stock must be at least 1" }),
  category: z.string(),
  subCategory: z.string(),
  brand: z.string(),
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [discount, setDiscount] = useState<number | undefined>(undefined);

  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      originalPrice: undefined,
      sellingPrice: undefined,
      stock: undefined,
      category: "",
      subCategory: "",
      brand: "",
      productDetails: "",
      productDescription: "",
      thumbnail: undefined,
      images: [],
      isPublic: true,
    },
  });

  const createProduct = useDispatchWithToast(fetchCreateProduct, {
    loadingMessage: "Creating product...",
    getSuccessMessage(data) {
      return data.message || "Product created successfully";
    },
    getErrorMessage(error) {
      return (
        error.message ||
        error ||
        "Something went wrong while creating the product"
      );
    },
    onSuccess(data) {
      setIsVisible(false);
      navigate(`/product/${data.data}`);
    },
    onError() {
      setIsVisible(false);
    },
  });

  function onSubmit(data: z.infer<typeof createProductSchema>) {
    setIsVisible(true);
    const formData = new FormData();

    // Add all the text/number fields
    formData.append("name", data.name);
    formData.append("originalPrice", data.originalPrice.toString());
    formData.append("sellingPrice", data.sellingPrice.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("brand", data.brand);
    formData.append("isPublic", data.isPublic.toString());
    formData.append("productDetails", data.productDetails);
    formData.append("productDescription", data.productDescription);
    if (discount !== undefined) {
      formData.append("discount", discount.toString());
    }

    // Add the thumbnail
    formData.append("thumbnail", data.thumbnail);

    // Add the images
    data.images.forEach((image) => {
      formData.append("images", image);
    });

    setIsVisible(true);
    createProduct(formData);
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
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Stock of Product"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Original price of Product"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              ? Number(e.target.value)
                              : undefined;
                            field.onChange(value);
                            const sellingPrice = form.getValues("sellingPrice");
                            if (value && sellingPrice) {
                              const discount = Number(
                                Math.round(
                                  ((value - sellingPrice) / value) * 100
                                )
                              );
                              if (discount >= 0 && discount <= 100) {
                                setDiscount(discount);
                              } else {
                                setDiscount(undefined);
                              }
                            }
                          }}
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
                          type="number"
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Selling price of Product"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              ? Number(e.target.value)
                              : undefined;
                            field.onChange(value);
                            const originalPrice =
                              form.getValues("originalPrice");
                            if (value && originalPrice) {
                              const discount = Number(
                                Math.round(
                                  ((originalPrice - value) / originalPrice) *
                                    100
                                )
                              );
                              if (discount >= 0 && discount <= 100) {
                                setDiscount(discount);
                              } else {
                                setDiscount(undefined);
                              }
                            }
                          }}
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
                  <Input
                    placeholder="Discount of Product"
                    value={discount}
                    readOnly
                  />
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
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => {
                    const selectedCategoryObj = categories.find(
                      (category) => category.name === selectedCategory
                    );
                    const filteredSubCategories = selectedCategoryObj
                      ? selectedCategoryObj.subCategories
                      : [];

                    return (
                      <FormItem>
                        <FormLabel>Sub Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Sub Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredSubCategories.map((subCategory) => (
                              <SelectItem
                                key={subCategory._id}
                                value={subCategory.name}
                              >
                                {subCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormDescription>
                          First select a category, then select a sub category.
                        </FormDescription>
                      </FormItem>
                    );
                  }}
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
                        placeholder="Product description"
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
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Editor
                        placeholder="Product Description"
                        content={field.value}
                        onChange={field.onChange}
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

export default AddProductPage;
