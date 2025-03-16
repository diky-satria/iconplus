import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
};

export default function OnlyAdminRoute({ children }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.auth);

  return user.role === "superadmin" ? children : <Navigate to="/meeting" />;
}
