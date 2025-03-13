import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProductReview() {
  const cart = useSelector((state: RootState) => state.cart.getCart.data);
  return (
    <div className="space-y-6">
      {cart.products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.products.map((product) => (
              <motion.div
                key={product.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-wrap md:flex-nowrap items-center gap-4 border-b pb-4"
              >
                <div className="flex-shrink-0">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover w-20 h-20"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm md:text-base line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    ₹{product.sellingPrice.toLocaleString()}
                  </p>
                </div>

                <div className="text-right min-w-[80px] mt-2 md:mt-0">
                  ₹{product.totalPrice.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground mt-1">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
