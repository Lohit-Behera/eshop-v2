import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  LogOut,
  MapPin,
  Package,
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

export default function ProfilePage() {
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    fullName: userDetails?.fullName || "",
    email: userDetails?.email || "",
    phone: userDetails?.phone || "",
  });

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
                className="w-full justify-start text-destructive"
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
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((order) => (
                    <motion.div
                      key={order}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: order * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div>
                          <p className="font-medium">Order #{1000 + order}</p>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order === 1
                              ? "default"
                              : order === 2
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {order === 1
                            ? "Delivered"
                            : order === 2
                            ? "Shipped"
                            : "Processing"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {order === 1
                              ? "Wireless Headphones"
                              : order === 2
                              ? "Smart Watch"
                              : "Laptop Sleeve"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order === 1
                              ? "Black"
                              : order === 2
                              ? "Silver"
                              : "Navy Blue"}{" "}
                            • Qty: 1
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            $
                            {order === 1
                              ? "129.99"
                              : order === 2
                              ? "249.99"
                              : "39.99"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">View All Orders</Button>
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
                  {[
                    {
                      type: "Home",
                      address: "123 Main St, Apt 4B, New York, NY 10001",
                    },
                    {
                      type: "Work",
                      address:
                        "456 Business Ave, Suite 200, New York, NY 10002",
                    },
                  ].map((address, index) => (
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
                            {index === 0 && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address.address}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Add New Address</Button>
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
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifs">Email notifications</Label>
                      <Switch id="email-notifs" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-updates">Order updates</Label>
                      <Switch id="order-updates" defaultChecked />
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
    </div>
  );
}
