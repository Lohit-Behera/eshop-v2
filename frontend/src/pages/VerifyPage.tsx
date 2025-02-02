import { fetchVerify } from "@/feature/authSlice";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const verify = useDispatchWithToast(fetchVerify, {
    loadingMessage: "Verifying...",
    getSuccessMessage: (data) =>
      data.message || "Account verified successfully",
    getErrorMessage: (error) =>
      error?.message || error || "Something went wrong while verifying account",
    onSuccess: () => {
      navigate("/login");
    },
  });
  useEffect(() => {
    if (token) verify(token);
  }, [token]);
  return <div>Verifying...</div>;
}

export default VerifyPage;
