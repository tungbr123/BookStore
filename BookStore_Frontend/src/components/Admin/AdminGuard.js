import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
   const loggedUser = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loggedUser.token || loggedUser.role !== 'admin') {
      router.push('/signin');
    }
  }, [loggedUser.token, loggedUser.role, router]);

  return loggedUser.role == 1  ? <>{children}</> : null;
}
