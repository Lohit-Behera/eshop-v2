import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reSignIn } from "@/feature/authSlice";
import { useEffect } from "react";

function SessionExpiredPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(reSignIn());
  }, []);
  return (
    <Card className="w-[98%] md:w-[350px] mx-auto h-full">
      <CardHeader>
        <CardTitle>Re Login</CardTitle>
        <CardDescription>Your Session Expired</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="sm"
          onClick={() => {
            navigate("/login");
          }}
        >
          Re-Login
        </Button>
      </CardContent>
    </Card>
  );
}

export default SessionExpiredPage;
