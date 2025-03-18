import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-motion";
import ProductCard from "@/components/product-card";

// Product type definition based on the provided data
interface Product {
  _id: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discount: number;
  stock: number;
  category: string;
  subCategory: string;
  brand: string;
  thumbnail: string;
  isPublic: boolean;
}

// Sample data from the provided JSON
const sampleProducts: Product[] = [
  {
    _id: "67d56912407cf1e22e6d2e36",
    name: "Lian Li Aluminium O11 Dynamic EVO RGB Mid-Tower Computer Case/Gaming Cabinet with Dual ARGB Strips - White | Support E-ATX, ATX, M-ATX, Mini-ITX - G99.O11DERGBW.in",
    originalPrice: 24999,
    sellingPrice: 19175,
    discount: 23,
    stock: 1,
    category: "Computers and Accessories",
    subCategory: "Case",
    brand: "Lian Li",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1742039311/eshop/product/q1izbehwiyvrhekobj4j.jpg",
    isPublic: true,
  },
  {
    _id: "67d56759407cf1e22e6d2dde",
    name: "ASUS Rog Strix Nvidia Geforce RTX 4070 Ti Gaming Graphics Card (Pcie 4.0, 12Gb Gddr6X, Hdmi 2.1A, Displayport 1.4A)",
    originalPrice: 146000,
    sellingPrice: 98799,
    discount: 32,
    stock: 8,
    category: "Computers and Accessories",
    subCategory: "Graphics Card",
    brand: "Asus",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1742038869/eshop/product/swygjjkvzoh2wxhmfnco.jpg",
    isPublic: true,
  },
  {
    _id: "67d565ef407cf1e22e6d2db9",
    name: "Corsair K70 RGB PRO Mechanical Wired Gaming Keyboard – Cherry MX Brown Tactile Switches – PBT Double-Shot Keycaps – iCUE Compatible – QWERTY",
    originalPrice: 22200,
    sellingPrice: 14488,
    discount: 35,
    stock: 7,
    category: "Computers and Accessories",
    subCategory: "Keyboards",
    brand: "Corsair",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1742038507/eshop/product/p21qm0zlmctqim4z09lw.jpg",
    isPublic: true,
  },
  {
    _id: "67d564f1407cf1e22e6d2da0",
    name: "Samsung Galaxy Buds 3 Pro (Silver) with Galaxy AI | Adaptive ANC | Real-time Interpreter | 24-bit Hi-Fi Audio | Up to 37H Battery | IP57",
    originalPrice: 24999,
    sellingPrice: 19464,
    discount: 22,
    stock: 6,
    category: "Mobile and Accessories",
    subCategory: "Earphone",
    brand: "Samsung",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1742038253/eshop/product/fuzcm7rh5ruzwvqcqktl.jpg",
    isPublic: true,
  },
  {
    _id: "67d56228407cf1e22e6d2d44",
    name: "Logitech G 733 Lightspeed Wireless Gaming Over-Ear Headphones with Suspension Over Ear Headband, LIGHTSYNC RGB",
    originalPrice: 19495,
    sellingPrice: 12995,
    discount: 33,
    stock: 4,
    category: "Computers and Accessories",
    subCategory: "Headphone",
    brand: "Logitech ",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1742037540/eshop/product/c0na052casm2wpvtcxwa.jpg",
    isPublic: true,
  },
  {
    _id: "67cebd982ea638a2aa39fbbf",
    name: 'ViewSonic Gaming (from USA) - VX2758A-2K-PRO-2 55.88 Cm 27" | 185 Hz| IPS QHD 2K Gaming Monitor',
    originalPrice: 40000,
    sellingPrice: 16499,
    discount: 59,
    category: "Computers and Accessories",
    subCategory: "Monitors",
    brand: "ViewSonic",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1741602203/eshop/product/nwwbt3ccuvyn5n57s1lf.jpg",
    stock: 14,
    isPublic: true,
  },
  {
    _id: "67adc56cf1f82760ff3c21bf",
    name: "Samsung Galaxy S23 Ultra 5G AI Smartphone (Green, 12GB, 256GB Storage)",
    originalPrice: 149999,
    sellingPrice: 69999,
    discount: 53,
    category: "Electronic",
    subCategory: "Mobile",
    brand: "Samsung",
    thumbnail:
      "https://res.cloudinary.com/dnj3a2lc3/image/upload/v1739441514/eshop/product/lskz9u486yx3pdlsb3yv.jpg",
    stock: 9,
    isPublic: true,
  },
];

export default function AllProductPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(sampleProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [discountFilter, setDiscountFilter] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique values for filter options
  const categories = [...new Set(products.map((product) => product.category))];
  const subCategories = [
    ...new Set(products.map((product) => product.subCategory)),
  ];
  const brands = [...new Set(products.map((product) => product.brand))];

  // Calculate min and max prices
  const minPrice = Math.min(...products.map((product) => product.sellingPrice));
  const maxPrice = Math.max(...products.map((product) => product.sellingPrice));

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // SubCategory filter
    if (selectedSubCategories.length > 0) {
      result = result.filter((product) =>
        selectedSubCategories.includes(product.subCategory)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.sellingPrice >= priceRange[0] &&
        product.sellingPrice <= priceRange[1]
    );

    // Stock filter
    if (stockFilter === "in-stock") {
      result = result.filter((product) => product.stock > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter((product) => product.stock === 0);
    }

    // Discount filter
    if (discountFilter !== null) {
      result = result.filter((product) => product.discount >= discountFilter);
    }

    // Sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case "price-high-low":
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "newest":
        // In a real app, you'd sort by date
        // Here we're just using the array order as a proxy for "newest"
        break;
      default:
        // Default "featured" sorting - no change
        break;
    }

    setFilteredProducts(result);

    // Count active filters
    let filterCount = 0;
    if (searchQuery) filterCount++;
    if (selectedCategories.length > 0) filterCount++;
    if (selectedSubCategories.length > 0) filterCount++;
    if (selectedBrands.length > 0) filterCount++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) filterCount++;
    if (stockFilter !== "all") filterCount++;
    if (discountFilter !== null) filterCount++;

    setActiveFilters(filterCount);
  }, [
    products,
    searchQuery,
    selectedCategories,
    selectedSubCategories,
    selectedBrands,
    priceRange,
    stockFilter,
    discountFilter,
    sortOption,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setStockFilter("all");
    setDiscountFilter(null);
    setSortOption("featured");
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle subcategory selection
  const toggleSubCategory = (subCategory: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((sc) => sc !== subCategory)
        : [...prev, subCategory]
    );
  };

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter sidebar for mobile
  const FilterSidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset All
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-[95%] mx-auto mt-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low-high">Price: Low to High</SelectItem>
          <SelectItem value="price-high-low">Price: High to Low</SelectItem>
          <SelectItem value="discount">Highest Discount</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1 overflow-auto p-4">
        <Accordion className="flex w-full flex-col space-y-2 divide-y divide-zinc-200 dark:divide-zinc-700">
          <AccordionItem value="category">
            <AccordionTrigger className="w-full text-left ">
              <div className="flex items-center justify-between">
                <div>Category</div>
                <ChevronDown className="h-4 w-4  transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180 " />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brand">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  min={minPrice}
                  max={maxPrice}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <div className="border rounded-md px-2 py-1 w-24">
                    ₹{priceRange[0].toLocaleString()}
                  </div>
                  <div className="border rounded-md px-2 py-1 w-24 text-right">
                    ₹{priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="stock">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stock-all"
                    checked={stockFilter === "all"}
                    onCheckedChange={() => setStockFilter("all")}
                  />
                  <label
                    htmlFor="stock-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stock-in"
                    checked={stockFilter === "in-stock"}
                    onCheckedChange={() => setStockFilter("in-stock")}
                  />
                  <label
                    htmlFor="stock-in"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stock-out"
                    checked={stockFilter === "out-of-stock"}
                    onCheckedChange={() => setStockFilter("out-of-stock")}
                  />
                  <label
                    htmlFor="stock-out"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Out of Stock
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="discount">
            <AccordionTrigger>Discount</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-all"
                    checked={discountFilter === null}
                    onCheckedChange={() => setDiscountFilter(null)}
                  />
                  <label
                    htmlFor="discount-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-10"
                    checked={discountFilter === 10}
                    onCheckedChange={() => setDiscountFilter(10)}
                  />
                  <label
                    htmlFor="discount-10"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    10% or more
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-20"
                    checked={discountFilter === 20}
                    onCheckedChange={() => setDiscountFilter(20)}
                  />
                  <label
                    htmlFor="discount-20"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    20% or more
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-30"
                    checked={discountFilter === 30}
                    onCheckedChange={() => setDiscountFilter(30)}
                  />
                  <label
                    htmlFor="discount-30"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    30% or more
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-50"
                    checked={discountFilter === 50}
                    onCheckedChange={() => setDiscountFilter(50)}
                  />
                  <label
                    htmlFor="discount-50"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    50% or more
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Mobile filter button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 md:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>

            {/* Sort dropdown */}

            {/* Search input - visible only on mobile */}
            <div className="relative md:hidden">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}

            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleCategory(category)}
                />
              </Badge>
            ))}

            {selectedSubCategories.map((subCategory) => (
              <Badge
                key={subCategory}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {subCategory}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleSubCategory(subCategory)}
                />
              </Badge>
            ))}

            {selectedBrands.map((brand) => (
              <Badge
                key={brand}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {brand}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleBrand(brand)}
                />
              </Badge>
            ))}

            {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ₹{priceRange[0].toLocaleString()} - ₹
                {priceRange[1].toLocaleString()}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriceRange([minPrice, maxPrice])}
                />
              </Badge>
            )}

            {stockFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {stockFilter === "in-stock" ? "In Stock" : "Out of Stock"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setStockFilter("all")}
                />
              </Badge>
            )}

            {discountFilter !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {discountFilter}% or more off
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setDiscountFilter(null)}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-4 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>
                  <Separator />
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low-high">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high-low">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="discount">Highest Discount</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>

                  <Separator />

                  <div className="space-y-4">
                    <FilterSection
                      title="Categories"
                      items={categories}
                      selectedItems={selectedCategories}
                      toggleItem={toggleCategory}
                    />
                    <Separator />

                    <FilterSection
                      title="Brands"
                      items={brands}
                      selectedItems={selectedBrands}
                      toggleItem={toggleBrand}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Price Range</h4>
                        <div className="text-xs text-muted-foreground">
                          ₹{priceRange[0].toLocaleString()} - ₹
                          {priceRange[1].toLocaleString()}
                        </div>
                      </div>
                      <Slider
                        defaultValue={[minPrice, maxPrice]}
                        min={minPrice}
                        max={maxPrice}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="my-6"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Availability</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-stock-all"
                            checked={stockFilter === "all"}
                            onCheckedChange={() => setStockFilter("all")}
                          />
                          <label
                            htmlFor="desktop-stock-all"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            All
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-stock-in"
                            checked={stockFilter === "in-stock"}
                            onCheckedChange={() => setStockFilter("in-stock")}
                          />
                          <label
                            htmlFor="desktop-stock-in"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            In Stock
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-stock-out"
                            checked={stockFilter === "out-of-stock"}
                            onCheckedChange={() =>
                              setStockFilter("out-of-stock")
                            }
                          />
                          <label
                            htmlFor="desktop-stock-out"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Out of Stock
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Discount</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-discount-all"
                            checked={discountFilter === null}
                            onCheckedChange={() => setDiscountFilter(null)}
                          />
                          <label
                            htmlFor="desktop-discount-all"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            All
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-discount-10"
                            checked={discountFilter === 10}
                            onCheckedChange={() => setDiscountFilter(10)}
                          />
                          <label
                            htmlFor="desktop-discount-10"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            10% or more
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-discount-20"
                            checked={discountFilter === 20}
                            onCheckedChange={() => setDiscountFilter(20)}
                          />
                          <label
                            htmlFor="desktop-discount-20"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            20% or more
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-discount-30"
                            checked={discountFilter === 30}
                            onCheckedChange={() => setDiscountFilter(30)}
                          />
                          <label
                            htmlFor="desktop-discount-30"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            30% or more
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="desktop-discount-50"
                            checked={discountFilter === 50}
                            onCheckedChange={() => setDiscountFilter(50)}
                          />
                          <label
                            htmlFor="desktop-discount-50"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            50% or more
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for filter sections
function FilterSection({
  title,
  items,
  selectedItems,
  toggleItem,
}: {
  title: string;
  items: string[];
  selectedItems: string[];
  toggleItem: (item: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayItems = showAll ? items : items.slice(0, 5);

  return (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-sm font-medium">{title}</h4>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {displayItems.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`desktop-${title}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={() => toggleItem(item)}
              />
              <label
                htmlFor={`desktop-${title}-${item}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item}
              </label>
            </div>
          ))}

          {items.length > 5 && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All (${items.length})`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
