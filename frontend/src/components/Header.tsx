import { Link, useNavigate, useLocation } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
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
  Settings2,
  ShoppingCart,
  User2,
  UserRoundCog,
} from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";

function Header() {
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const TABS = [
    {
      label: "Home",
      icon: (
        <span className="flex px-2 py-0 justify-center items-center gap-1 text-sm font-semibold">
          <Home className="h-5 w-5" /> Home
        </span>
      ),
      link: "/",
    },
    {
      label: "Products",
      icon: (
        <span className="flex px-3 py-1 justify-center items-center gap-2 text-sm font-semibold">
          <Package2 className="h-5 w-5" /> Products
        </span>
      ),
      link: "/products",
    },
    {
      label: "Category",
      icon: (
        <span className="flex px-3 py-1 justify-center items-center gap-2 text-sm font-semibold">
          <LayoutGrid className="h-5 w-5" /> Category
        </span>
      ),
      link: "/category",
    },
    {
      label: "Cart",
      icon: (
        <span className="flex px-3 py-1 justify-center items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="h-5 w-5" /> Cart
        </span>
      ),
      link: "/cart",
    },
  ];
  return (
    <>
      <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
        <nav className="flex justify-between space-x-1">
          <Link to={"/"}>
            <img src={Logo} alt="logo" className="w-10 h-10" />
          </Link>
          <div className="flex space-x-2">
            <AnimatedBackground
              defaultValue={
                TABS.find((tab) => tab.link === location.pathname)?.label
              }
              className="rounded-lg bg-muted flex"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.3,
              }}
            >
              {TABS.map((tab) => (
                <Link
                  key={tab.label}
                  to={tab.link}
                  data-id={tab.label}
                  type="button"
                  className="flex items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-foreground"
                  onClick={() => navigate(tab.link)}
                >
                  {tab.icon}
                </Link>
              ))}
            </AnimatedBackground>
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="outline-primary hover:outline outline-2 outline-offset-2">
                    <AvatarImage src={userDetails ? userDetails.avatar : ""} />
                    <AvatarFallback>
                      {userDetails?.fullName ? userDetails?.fullName[0] : "A"}
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
                  <DropdownMenuItem>
                    <LogIn className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
