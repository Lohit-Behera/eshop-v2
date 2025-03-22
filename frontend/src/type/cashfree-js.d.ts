declare module "@cashfreepayments/cashfree-js" {
  /**
   * Configuration options for initializing the Cashfree SDK
   */
  export interface CashfreeLoadOptions {
    mode: "sandbox" | "production";
  }

  /**
   * The response from a successful payment
   */
  export interface CashfreePaymentResponse {
    orderId: string;
    orderAmount: number;
    referenceId: string;
    txStatus: string;
    paymentMode: string;
    signature: string;
    [key: string]: any; // For any additional fields returned by the API
  }

  /**
   * Options for the checkout method
   */
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    [key: string]: any; // For any additional options
  }

  /**
   * Possible events emitted by the Cashfree SDK
   */
  export type CashfreeEventName =
    | "payment.success"
    | "payment.failure"
    | "payment.error"
    | "payment.close";

  /**
   * The Cashfree instance returned by the load function
   */
  export interface CashfreeInstance {
    /**
     * Initiates the payment checkout flow
     * @param options Checkout configuration options
     * @returns Promise that resolves when checkout is initiated
     */
    checkout: (options: CashfreeCheckoutOptions) => Promise<any>;

    /**
     * Registers event listeners for payment events
     * @param event The event name to listen for
     * @param callback Function to call when the event occurs
     */
    on: <T = any>(
      event: CashfreeEventName,
      callback: (data: T) => void
    ) => void;
  }

  /**
   * Loads the Cashfree SDK
   * @param options Configuration options for the SDK
   * @returns Promise that resolves to a Cashfree instance
   */
  export function load(
    options?: CashfreeLoadOptions
  ): Promise<CashfreeInstance>;
}
