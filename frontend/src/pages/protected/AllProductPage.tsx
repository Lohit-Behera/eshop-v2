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
import { useSearchParams } from "react-router-dom";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Category } from "@/feature/categorySlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { fetchFilteredProducts } from "@/feature/productSlice";
// TODO paginate this page
// Product type definition
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

// Interface for filter query
interface FilterQuery {
  search?: string;
  categories?: string[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  stock?: string;
  discount?: number;
  sort?: string;
}

export default function AllProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );
  const brands = useSelector(
    (state: RootState) => state.product.uniqueBrands.data
  );

  const productsData = useSelector(
    (state: RootState) => state.product.filteredProducts.data
  );
  const products = productsData.docs || [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("priceMin") || "0"),
    parseInt(searchParams.get("priceMax") || "150000"),
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category") || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand") || []
  );
  const [stockFilter, setStockFilter] = useState<string>(
    searchParams.get("stock") || "all"
  );
  const [discountFilter, setDiscountFilter] = useState<number | null>(
    searchParams.get("discount")
      ? parseInt(searchParams.get("discount") || "0")
      : null
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams.get("sort") || "featured"
  );

  // UI state
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate min and max prices
  const minPrice =
    products.length > 0
      ? Math.min(...products.map((product) => product.sellingPrice))
      : 0;
  const maxPrice =
    products.length > 0
      ? Math.max(...products.map((product) => product.sellingPrice))
      : 150000;

  const fetchProducts = useAsyncDispatch(fetchFilteredProducts, {
    onSuccess: () => {
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
  // Fetch products based on search params
  useEffect(() => {
    const queryString = searchParams.toString();
    fetchProducts(queryString || "");
  }, [searchParams]);

  // Apply filters - updates URL search params
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();

    if (searchQuery) {
      newSearchParams.set("search", searchQuery);
    }

    selectedCategories.forEach((category) => {
      newSearchParams.append("category", category);
    });

    selectedBrands.forEach((brand) => {
      newSearchParams.append("brand", brand);
    });

    if (priceRange[0] > minPrice) {
      newSearchParams.set("priceMin", priceRange[0].toString());
    }

    if (priceRange[1] < maxPrice) {
      newSearchParams.set("priceMax", priceRange[1].toString());
    }

    if (stockFilter !== "all") {
      newSearchParams.set("stock", stockFilter);
    }

    if (discountFilter !== null) {
      newSearchParams.set("discount", discountFilter.toString());
    }

    if (sortOption !== "featured") {
      newSearchParams.set("sort", sortOption);
    }

    // Set the search params which will trigger a re-render and the useEffect
    setSearchParams(newSearchParams);
    setIsFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setStockFilter("all");
    setDiscountFilter(null);
    setSortOption("featured");
    setIsFilterOpen(false);

    // Clear all search params and navigate to the base URL
    setSearchParams(new URLSearchParams());
  };

  // Update active filters count
  useEffect(() => {
    let filterCount = 0;
    if (searchQuery) filterCount++;
    if (selectedCategories.length > 0) filterCount++;
    if (selectedBrands.length > 0) filterCount++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) filterCount++;
    if (stockFilter !== "all") filterCount++;
    if (discountFilter !== null) filterCount++;
    if (sortOption !== "featured") filterCount++;

    setActiveFilters(filterCount);
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    stockFilter,
    discountFilter,
    sortOption,
    minPrice,
    maxPrice,
  ]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
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

      <ActiveFilters
        className="block md:hidden my-2 mx-auto w-[95%]"
        activeFilters={activeFilters}
        searchQuery={searchQuery}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        priceRange={priceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        stockFilter={stockFilter}
        discountFilter={discountFilter}
        sortOption={sortOption}
        setSearchQuery={setSearchQuery}
        toggleCategory={toggleCategory}
        toggleBrand={toggleBrand}
        setPriceRange={setPriceRange}
        setStockFilter={setStockFilter}
        setDiscountFilter={setDiscountFilter}
        setSortOption={setSortOption}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
      />

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
            <AccordionTrigger className="w-full text-left">
              <div className="flex items-center justify-between">
                <div>Category</div>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => toggleCategory(category.name)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
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

      <div className="border-t p-4">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <p className="text-center">Loading</p>
      ) : (
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
          <ActiveFilters
            className="hidden md:block"
            activeFilters={activeFilters}
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            stockFilter={stockFilter}
            discountFilter={discountFilter}
            sortOption={sortOption}
            setSearchQuery={setSearchQuery}
            toggleCategory={toggleCategory}
            toggleBrand={toggleBrand}
            setPriceRange={setPriceRange}
            setStockFilter={setStockFilter}
            setDiscountFilter={setDiscountFilter}
            setSortOption={setSortOption}
            resetFilters={resetFilters}
            applyFilters={applyFilters}
          />

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
                        <SelectItem value="discount">
                          Highest Discount
                        </SelectItem>
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
                {products.length === 0 ? (
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
                    {products.map((product) => (
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
      )}
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
  items: string[] | Category[];
  selectedItems: string[];
  toggleItem: (item: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayItems = showAll ? items : items.slice(0, 5);

  return (
    <div className="space-y-2">
      {/* Toggle Section */}
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
          {displayItems.map((item) => {
            // Check if item is a Category
            if (typeof item === "object" && "_id" in item) {
              return (
                <div key={item._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`desktop-${title}-${item.name}`}
                    checked={selectedItems.includes(item.name)}
                    onCheckedChange={() => toggleItem(item.name)}
                  />
                  <label
                    htmlFor={`desktop-${title}-${item.name}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.name}
                  </label>
                </div>
              );
            }
            // Handle string items
            if (typeof item === "string") {
              return (
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
              );
            }
            return null;
          })}

          {/* Show All / Show Less Button */}
          {items.length > 5 && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All (${items.length - 5})`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface ActiveFiltersProps {
  className?: string;
  activeFilters: number;
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: number[];
  minPrice: number;
  maxPrice: number;
  stockFilter: string;
  discountFilter: number | null;
  sortOption: string;
  setSearchQuery: (value: string) => void;
  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (range: number[]) => void;
  setStockFilter: (filter: string) => void;
  setDiscountFilter: (discount: number | null) => void;
  setSortOption: (option: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  className = "",
  activeFilters,
  searchQuery,
  selectedCategories,
  selectedBrands,
  priceRange,
  minPrice,
  maxPrice,
  stockFilter,
  discountFilter,
  sortOption,
  setSearchQuery,
  toggleCategory,
  toggleBrand,
  setPriceRange,
  setStockFilter,
  setDiscountFilter,
  setSortOption,
  resetFilters,
  applyFilters,
}) => {
  return (
    <AnimatePresence>
      {activeFilters > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, transition: "easeInOut" }}
          className={`${className}`}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {searchQuery && (
              <FilterBadge
                label={`Search: ${searchQuery}`}
                onRemove={() => setSearchQuery("")}
              />
            )}

            {selectedCategories.map((category) => (
              <FilterBadge
                key={category}
                label={category}
                onRemove={() => toggleCategory(category)}
              />
            ))}

            {selectedBrands.map((brand) => (
              <FilterBadge
                key={brand}
                label={brand}
                onRemove={() => toggleBrand(brand)}
              />
            ))}

            {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
              <FilterBadge
                label={`₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`}
                onRemove={() => setPriceRange([minPrice, maxPrice])}
              />
            )}

            {stockFilter !== "all" && (
              <FilterBadge
                label={stockFilter === "in-stock" ? "In Stock" : "Out of Stock"}
                onRemove={() => setStockFilter("all")}
              />
            )}

            {discountFilter !== null && (
              <FilterBadge
                label={`${discountFilter}% or more off`}
                onRemove={() => setDiscountFilter(null)}
              />
            )}

            {sortOption !== "featured" && (
              <FilterBadge
                label={`Sort: ${sortOption}`}
                onRemove={() => setSortOption("featured")}
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={resetFilters}
            >
              Clear All
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 items-center"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reusable filter badge component
const FilterBadge: React.FC<{ label: string; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.2 }}
  >
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <X className="h-3 w-3 cursor-pointer" onClick={onRemove} />
    </Badge>
  </motion.div>
);
