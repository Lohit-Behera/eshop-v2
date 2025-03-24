import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  LogOut,
  MapPin,
  Plus,
  Settings,
  ShoppingBag,
  User2,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import {
  Address,
  fetchAllAddresses,
  fetchCreateAddress,
  fetchUpdateAddress,
} from "@/feature/addressSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GlowInput } from "@/components/ui/glow-input";
import { Checkbox } from "@/components/ui/checkbox";
import { TextMorph } from "@/components/ui/text-morph";
import { fetchProfileOrder } from "@/feature/orderSlice";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import Paginator from "@/components/paginator";
import { useSearchParams } from "react-router-dom";

const addressSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  type: z
    .string()
    .min(3, { message: "Type must be at least 3 characters" })
    .max(50, { message: "Type must be at most 50 characters" }),
  addressLine1: z
    .string()
    .min(3, { message: "Address line 1 must be at least 3 characters" })
    .max(50, { message: "Address line 1 must be at most 50 characters" }),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(3, { message: "City must be at least 3 characters" })
    .max(50, { message: "City must be at most 50 characters" }),
  state: z
    .string()
    .min(3, { message: "State must be at least 3 characters" })
    .max(50, { message: "State must be at most 50 characters" }),
  country: z
    .string()
    .min(3, { message: "Country must be at least 3 characters" })
    .max(50, { message: "Country must be at most 50 characters" }),
  pinCode: z
    .string()
    .min(3, { message: "Pin code must be at least 3 characters" })
    .max(50, { message: "Pin code must be at most 50 characters" }),
  phone: z
    .string()
    .min(3, { message: "Phone number must be at least 3 characters" })
    .max(50, { message: "Phone number must be at most 50 characters" }),
  isDefault: z.boolean(),
});

export default function ProfilePage() {
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    fullName: userDetails?.fullName || "",
    email: userDetails?.email || "",
    phone: userDetails?.phone || "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState({
    add: false,
    update: false,
  });
  const [addressToUpdate, setAddressToUpdate] = useState<Address>();
  const [loading, setLoading] = useState({
    addButton: false,
    updateButton: false,
  });

  const addresses = useSelector(
    (state: RootState) => state.address.allAddresses.data
  );
  const profileOrder = useSelector(
    (state: RootState) => state.order.profileOrder.data
  );
  const profileOrderStatus = useSelector(
    (state: RootState) => state.order.profileOrderStatus
  );
  const profileOrderError = useSelector(
    (state: RootState) => state.order.profileOrderError
  );

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      type: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phone: "",
      isDefault: false,
    },
  });

  const allAddress = useAsyncDispatch(fetchAllAddresses);
  const getProfileOrders = useAsyncDispatch(fetchProfileOrder);

  useEffect(() => {
    getProfileOrders(searchParams.toString());
    console.log(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    allAddress();
    getProfileOrders("");
  }, []);
  const createAddress = useDispatchWithToast(fetchCreateAddress, {
    loadingMessage: "Adding Address...",
    getSuccessMessage(data) {
      return data.message || "Address added successful";
    },
    getErrorMessage(error) {
      return error.message || error || "Failed to add address.";
    },
    onSuccess() {
      allAddress();
      setDialogOpen(false);
      setLoading((prev) => ({ ...prev, addButton: false }));
    },
    onError() {
      setLoading((prev) => ({ ...prev, addButton: false }));
    },
  });

  const updateAddress = useDispatchWithToast(fetchUpdateAddress, {
    loadingMessage: "Updating Address...",
    getSuccessMessage(data) {
      return data.message || "Address updated successful";
    },
    getErrorMessage(error) {
      return error.message || error || "Failed to update address.";
    },
    onSuccess() {
      allAddress();
      setDialogOpen(false);
      setLoading((prev) => ({ ...prev, updateButton: false }));
    },
    onError() {
      setLoading((prev) => ({ ...prev, updateButton: false }));
    },
  });

  const submitAddress = (data: z.infer<typeof addressSchema>) => {
    if (action.add) {
      setLoading((prev) => ({ ...prev, addButton: true }));
      createAddress(data);
    } else if (action.update) {
      setLoading((prev) => ({ ...prev, updateButton: true }));
      updateAddress({
        ...data,
        addressId: addressToUpdate?._id ? addressToUpdate._id : "",
      });
    }
  };

  const handelAddressToUpdate = (address: Address) => {
    setAction((prev) => ({ ...prev, update: true }));
    setAddressToUpdate(address);
    form.reset({
      name: address.name,
      type: address.type,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      pinCode: address.pinCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 min-h-[calc(100vh-64px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-[250px_1fr]"
      >
        {/* Sidebar */}
        <div className="hidden md:block">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userDetails?.avatar} alt="User" />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm line-clamp-1">
                    {userDetails?.fullName}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1">
                    {userDetails?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col space-y-1 px-2">
                <Button
                  variant={activeTab === "profile" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "orders" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === "payment" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
            <CardFooter className="pt-3">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive dark:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <Tabs defaultValue="profile" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="profile">
                <UserIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="orders">
                <ShoppingBag className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userDetails?.avatar} alt="User" />
                    <AvatarFallback>
                      <User2 className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                <Separator />
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={user.fullName}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      placeholder="Your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={user.phone}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card className="min-h-[75vh]">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6">
                  {profileOrderStatus === "loading" && (
                    <div className="absolute min-h-[1500px] h-full w-full rounded-md bg-background/50 filter backdrop-blur-sm animate-pulse">
                      <Loader2 className="absolute w-[50px] h-[50px] top-1/2 left-1/2 animate-spin" />
                    </div>
                  )}
                  {profileOrderStatus === "failed" ? (
                    <>
                      {profileOrderError === "No orders found" ? (
                        <p className="text-sm text-muted-foreground text-center">
                          No orders found.
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {profileOrder.docs.map((order, index) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                            <div>
                              <p className="font-medium">
                                Order #
                                {order._id.substring(order._id.length - 6)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant={
                                  order.status === "Delivered"
                                    ? "default"
                                    : order.status === "Shipped"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                              <Badge
                                variant={
                                  order.paymentStatus === "Paid"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>

                          {/* Products in this order */}
                          <div className="space-y-4">
                            {order.products.map((product) => (
                              <div
                                key={product.productId}
                                className="flex items-center gap-4"
                              >
                                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                  <img
                                    src={
                                      product.thumbnail || "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm md:text-base line-clamp-2">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {product.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    ₹{product.sellingPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order summary */}
                          <div className="mt-4 border-t pt-4">
                            <div className="space-y-1 text-xs sm:text-sm ">
                              <div className="flex justify-between ">
                                <span className="text-muted-foreground">
                                  Subtotal:
                                </span>
                                <span>
                                  ₹{order.totalPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Shipping:
                                </span>
                                <span>
                                  ₹{order.shippingPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Total:</span>
                                <span>
                                  ₹{order.grandTotal.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <span className=" text-xs sm:text-sm  text-muted-foreground">
                              Payment via {order.paymentMethod}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/order/${order._id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {profileOrderStatus === "succeeded" &&
                  profileOrder.totalPages > 1 && (
                    <Paginator
                      currentPage={profileOrder.page}
                      totalPages={profileOrder.totalPages}
                      showPreviousNext={true}
                    />
                  )}
              </CardFooter>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <p>No addresses found Create a new address</p>
                  ) : (
                    <>
                      {addresses.map((address, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{address.type}</h3>
                                {address.isDefault && (
                                  <Badge variant="outline">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {address.addressLine1}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handelAddressToUpdate(address)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => {
                    setDialogOpen(true);
                    setAction((prev) => ({ ...prev, add: true }));
                    form.reset({
                      name: "",
                      type: "",
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      country: "",
                      pinCode: "",
                      phone: "",
                      isDefault: false,
                    });
                  }}
                >
                  Add New Address
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Visa", last4: "4242", expiry: "04/25" },
                    { type: "Mastercard", last4: "5555", expiry: "08/24" },
                  ].map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                            <span className="font-medium">{card.type}</span>
                          </div>
                          <div>
                            <p className="font-medium">•••• {card.last4}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {card.expiry}
                            </p>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Add Payment Method</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personalization</h3>
                  <div className="flex items-center justify-between">
                    <Label>Dark mode</Label>
                    <ModeToggle />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifs">Email notifications</Label>
                      <Switch
                        id="email-notifs"
                        defaultChecked={
                          userDetails?.preferences.emailNotifications
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-updates">Order updates</Label>
                      <Switch
                        id="order-updates"
                        defaultChecked={userDetails?.preferences.orderUpdates}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing">Marketing emails</Label>
                      <Switch id="marketing" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="2fa">Two-factor authentication</Label>
                      <Switch id="2fa" />
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-sharing">Data sharing</Label>
                      <Switch id="data-sharing" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cookies">Cookie preferences</Label>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-destructive">
                  Delete Account
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </motion.div>
      <Dialog
        open={dialogOpen}
        onOpenChange={() => {
          setDialogOpen(false);
          setAction({ add: false, update: false });
        }}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="w-full md:min-w-[700px]"
        >
          <DialogHeader>
            <DialogTitle>
              {action.add ? "Add new address" : "Update address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAddress)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Address Line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Address Line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin Code</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Pin Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <GlowInput placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Default</FormLabel>
                      <div className="flex space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <p className="text-sm leading-none text-muted-foreground">
                          If checked, this address will be default address.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end w-full">
                <Button type="submit" size="sm">
                  {action.add ? (
                    <>
                      {loading.addButton ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <TextMorph>
                        {loading.addButton ? "Adding..." : "Add"}
                      </TextMorph>
                    </>
                  ) : (
                    <>
                      {loading.updateButton ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <TextMorph>
                        {loading.updateButton ? "Updating..." : "Update"}
                      </TextMorph>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
