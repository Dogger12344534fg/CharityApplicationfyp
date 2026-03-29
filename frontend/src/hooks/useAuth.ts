export const useAuth = () => {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("User") || "null")
      : null;
  return { user };
};
