import { Link } from "react-router-dom";
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

function Header() {
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
      <nav className="flex justify-between space-x-2">
        <Link to={"/"}>
          <img src={Logo} alt="logo" className="w-10 h-10" />
        </Link>
        <div className="flex space-x-2">
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Setting</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
