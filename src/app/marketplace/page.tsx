"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Marketplace de Services</h1>
          <Button asChild>
            <Link href="/marketplace/nouveau">Publier un service</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {service.price ? `${service.price} €` : "Prix sur demande"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.location}
                  </span>
                </div>
                <div className="mt-4">
                  <Button className="w-full">Contacter</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
