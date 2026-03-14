import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function App() {
  const queryClient = new QueryClient();
  <Toaster />

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  )
}