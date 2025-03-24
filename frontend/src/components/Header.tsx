import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import Logo from "@/assets/Logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  LayoutGrid,
  LogIn,
  Package2,
  PanelLeft,
  Settings2,
  ShoppingCart,
  User2,
  UserRoundCog,
} from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

import { useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import useClickOutside from "@/hooks/useClickOutside";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { fetchLogOut } from "@/feature/authSlice";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useDispatchWithToast(fetchLogOut, {
    loadingMessage: "Logging out...",
    getSuccessMessage() {
      return "Logged out successfully";
    },
    getErrorMessage(error) {
      return error.message || error || "Something went wrong while logging out";
    },
  });

  const TABS = [
    {
      label: "Home",
      icon: (
        <span className="flex px-0 md:px-3 py-0 md:py-1 justify-center items-center gap-2 text-sm font-semibold">
          <Home className="h-5 w-5" /> Home
        </span>
      ),
      link: "/",
    },
    {
      label: "Products",
      icon: (
        <span className="flex px-0 md:px-3 py-0 md:py-1 justify-center items-center gap-2 text-sm font-semibold">
          <Package2 className="h-5 w-5" /> Products
        </span>
      ),
      link: "/products",
    },
    {
      label: "Category",
      icon: (
        <span className="flex px-0 md:px-3 py-0 md:py-1 justify-center items-center gap-2 text-sm font-semibold">
          <LayoutGrid className="h-5 w-5" /> Category
        </span>
      ),
      link: "/category",
    },
    {
      label: "Cart",
      icon: (
        <span className="flex px-0 md:px-3 py-0 md:py-1 justify-center items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="h-5 w-5" /> Cart
        </span>
      ),
      link: "/cart",
    },
  ];
  return (
    <>
      <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/80 ">
        <nav className="flex justify-between space-x-1">
          <Link to={"/"} className="hidden md:block">
            <img src={Logo} alt="logo" className="w-10 h-10" />
          </Link>
          <Sheet>
            <SheetTrigger className="flex md:hidden" asChild>
              <Button variant="outline" size="icon">
                <PanelLeft />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[180px]">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to={"/"}
                    className="flex gap-2 justify-start items-center"
                  >
                    <img src={Logo} alt="logo" className="w-10 h-10" /> EShop
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-8">
                {TABS.map((tab) => (
                  <SheetClose key={tab.label} asChild>
                    <NavLink to={tab.link}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          size={"sm"}
                          className="w-full justify-start"
                        >
                          {tab.icon}
                        </Button>
                      )}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex space-x-2">
            <div className="hidden md:flex space-x-2 justify-end">
              <MotionConfig transition={transition}>
                <div className="" ref={containerRef}>
                  <motion.div
                    animate={{
                      // @todo: here I want to remove the width
                      width: isOpen ? "600px" : "500px",
                    }}
                    initial={false}
                  >
                    <div className="overflow-hidden p-2">
                      {!isOpen ? (
                        <div className="flex space-x-2">
                          <AnimatedBackground
                            defaultValue={
                              TABS.find((tab) => tab.link === location.pathname)
                                ?.label
                            }
                            className="rounded-lg bg-muted "
                            transition={{
                              type: "spring",
                              bounce: 0.3,
                              duration: 0.6,
                            }}
                          >
                            {TABS.map((tab) => (
                              <Link
                                key={tab.label}
                                to={tab.link}
                                data-id={tab.label}
                                type="button"
                                className="flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-foreground"
                                onClick={() => navigate(tab.link)}
                              >
                                {tab.icon}
                              </Link>
                            ))}
                          </AnimatedBackground>
                          <Button
                            onClick={() => setIsOpen(true)}
                            size={"icon"}
                            variant={"outline"}
                          >
                            <Search className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setIsOpen(false)}
                            size="icon"
                            variant={"ghost"}
                            className="my-auto"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <div className="relative w-full flex space-x-2">
                            <Input
                              className="h-9 w-full"
                              placeholder="Search"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                  if (search) {
                                    navigate(`/products/?search=${search}`);
                                  }
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              onClick={() => {
                                if (search) {
                                  navigate(`/products/?search=${search}`);
                                }
                              }}
                            >
                              <Search className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </MotionConfig>
            </div>
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="outline-primary hover:outline outline-2 outline-offset-2 transition-all duration-200">
                    <AvatarImage src={userDetails ? userDetails.avatar : ""} />
                    <AvatarFallback>
                      <User2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userDetails?.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      <UserRoundCog className="mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User2 className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings2 className="mr-2" />
                    Setting
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogIn className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
