import { fetchHomeProducts } from "@/feature/productSlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/components/product-card";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

function HomePage() {
  const products = useSelector(
    (state: RootState) => state.product.homeProducts.data
  );
  const banner = useSelector(
    (state: RootState) => state.banner.allBanners.data
  );
  const homeProducts = useAsyncDispatch(fetchHomeProducts);
  useEffect(() => {
    homeProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <section className="container py-12 md:py-16">
      <Carousel
        className="relative mb-8"
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {banner.map((banner) => (
            <CarouselItem key={banner._id}>
              <Link to={banner.link}>
                <img
                  src={banner.image}
                  alt="banner"
                  className="w-full h-[60vh] object-cover rounded-md"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Featured Products
        </h2>
        <p className="mt-2 text-muted-foreground">
          Check out our latest deals and top products
        </p>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default HomePage;
