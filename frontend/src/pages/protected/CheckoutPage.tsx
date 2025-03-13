import CheckoutFlow from "./checkout/checkout-flow";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-center pt-8">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
