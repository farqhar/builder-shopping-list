// DELIBERATELY MISCONFIGURED EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-browser";
import { isAdmin } from "@/lib/isAdmin";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function deleteAllOrders() {
    await supabase.from("orders").delete().neq("id", 0);
  }

  return (
    <main>
      <h1>Admin</h1>
      {/* Only admins see this button. */}
      {isAdmin(user) && (
        <button onClick={deleteAllOrders}>Delete all orders</button>
      )}
    </main>
  );
}
