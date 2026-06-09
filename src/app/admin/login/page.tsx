"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const verifyAdmin = useVerifyAdmin();

  // Check if already authenticated
  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    setError("");

    verifyAdmin.mutate({ data: { password } }, {
      onSuccess: (data) => {
        setIsLoading(false);
        if (data.success) {
          sessionStorage.setItem("adminAuth", "true");
          router.push("/admin");
        } else {
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Senha incorreta. Tente novamente.",
          });
        }
      },
      onError: (err) => {
        setIsLoading(false);
        console.error("Login error:", err);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao verificar a senha.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 border border-primary flex items-center justify-center rounded-full bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-serif text-3xl font-normal text-foreground">
              Acesso Cerimonial
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Área reservada para administração da lista de presentes.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border text-center h-12 text-lg focus-visible:ring-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-serif tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={verifyAdmin.isPending}
            >
              {verifyAdmin.isPending ? "Verificando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
