import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AsyncThunk } from "@reduxjs/toolkit";
import { reSignIn } from "@/feature/authSlice";

interface ToastOptions<TResult> {
  loadingMessage?: string;
  getSuccessMessage?: (data: TResult) => string;
  getErrorMessage?: (error: any) => string;
  onSuccess?: (result: TResult) => void;
  onError?: (error: any) => void;
}

interface AsyncDispatchOptions<TResult> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: any) => void;
}

// Custom hook for handling async Redux actions with toast
export const useDispatchWithToast = <TData = void, TResult = void>(
  asyncThunkAction: AsyncThunk<TResult, TData, any>,
  options: ToastOptions<TResult> = {}
) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    loadingMessage = "Loading...",
    getSuccessMessage = (data: TResult) =>
      (data as any)?.message || "Operation successful",
    getErrorMessage = (error: any) => error?.message || "Operation failed",
    onSuccess,
    onError,
  } = options;

  return async (data: TData): Promise<TResult> => {
    const promise = dispatch(asyncThunkAction(data)).unwrap();

    toast.promise(promise, {
      loading: loadingMessage,
      success: (result: TResult) => {
        if (onSuccess) onSuccess(result);
        return getSuccessMessage(result);
      },
      error: (err: any) => {
        if (err === "Refresh token expired") {
          toast.error("Session expired. Please log in again.");
          dispatch(reSignIn());
          navigate("/session-expired");
        } else if (err === "Session expired") {
          toast.error("Session expired. Please log in again.");
          dispatch(reSignIn());
          navigate("/session-expired");
        } else if (err === "Invalid token: User not found") {
          toast.error("User not found or token invalid. Please log in again.");
          dispatch(reSignIn());
          navigate("/session-expired");
        }
        if (onError) onError(err);
        return getErrorMessage(err);
      },
    });

    return promise;
  };
};

// Custom hook for handling async Redux actions
export const useAsyncDispatch = <TData = void, TResult = void>(
  asyncThunkAction: AsyncThunk<TResult, TData, any>,
  options: AsyncDispatchOptions<TResult> = {}
) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { onSuccess, onError } = options;

  return async (data: TData): Promise<TResult> => {
    try {
      const result = await dispatch(asyncThunkAction(data)).unwrap();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (error === "Refresh token expired") {
        toast.error("Session expired. Please log in again.");
        dispatch(reSignIn());
        navigate("/session-expired");
      } else if (error === "Session expired") {
        toast.error("Session expired. Please log in again.");
        dispatch(reSignIn());
        navigate("/session-expired");
      } else if (error === "Invalid token: User not found") {
        toast.error("User not found or token invalid. Please log in again.");
        dispatch(reSignIn());
        navigate("/session-expired");
      }
      if (onError) onError(error);
      throw error;
    }
  };
};
