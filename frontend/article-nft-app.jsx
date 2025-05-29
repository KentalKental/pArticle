"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, FileText, Globe, Shield, Zap } from "lucide-react"
import MainApp from "./main-app"
import ArticleReader from "./article-reader"

const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === "development" ? "local" : "ic")
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app/"
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY || "rdmx6-jaaaa-aaaaa-aaadq-cai"}.localhost:4943`

export default function ArticleNFTApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [userPrincipal, setUserPrincipal] = useState("")
  const [balance, setBalance] = useState("0")
  const [currentView, setCurrentView] = useState("home")

  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
  setIsMounted(true);

  const savedView = localStorage.getItem("currentView");
  const isConnectedLocal = localStorage.getItem("isConnected") === "true";
  const principalLocal = localStorage.getItem("principal");

  if (isConnectedLocal && savedView) {
    setCurrentView(savedView);
    setIsConnected(true);
    if (principalLocal) setUserPrincipal(principalLocal);
    setBalance("15.7"); // or fetch actual balance
  }

  const initAuth = async () => {
    const { AuthClient } = await import("@dfinity/auth-client");
    const authClient = await AuthClient.create();

    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toString();

      const localPrincipal = localStorage.getItem("principal");
      const localIsConnected = localStorage.getItem("isConnected") === "true";

      if (localIsConnected && localPrincipal === principal) {
        setUserPrincipal(principal);
        setIsConnected(true);
        setBalance("15.7"); // Replace with actual balance fetch

        // If user was connected, show main app instead of home
        if (currentView === "home") {
          setCurrentView("main");
        }
      }
    }
  };

  initAuth();
  }, []);

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem("currentView", currentView)
    }
  }, [currentView, isConnected])

  const connectWallet = async () => {
    try {
      const { AuthClient } = await import("@dfinity/auth-client")
      const authClient = await AuthClient.create()

      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity()
        const principal = identity.getPrincipal().toString()

        localStorage.setItem("isConnected", "true")
        localStorage.setItem("principal", principal)
        localStorage.setItem("currentView", "main")

        setIsConnected(true)
        setUserPrincipal(principal)
        setBalance("15.7")
        setCurrentView("main")
        return
      }

      await authClient.login({
        identityProvider: identityProvider,
        onSuccess: () => {
          const identity = authClient.getIdentity()
          const principal = identity.getPrincipal().toString()

          localStorage.setItem("isConnected", "true")
          localStorage.setItem("principal", principal)
          localStorage.setItem("currentView", "main")

          setIsConnected(true)
          setUserPrincipal(principal)
          setBalance("15.7")
          setCurrentView("main")
        },
        onError: (error) => {
          console.error("Internet Identity login failed:", error)
        },
      })
    } catch (error) {
      console.error("Failed to connect with Internet Identity:", error)
    }
  }

  const disconnectWallet = async () => {
    try {
      const { AuthClient } = await import("@dfinity/auth-client")
      const authClient = await AuthClient.create()

      if (await authClient.isAuthenticated()) {
        await authClient.logout()
      }

      localStorage.removeItem("isConnected")
      localStorage.removeItem("principal")
      localStorage.removeItem("currentView")
      localStorage.removeItem("currentPage")

      setIsConnected(false)
      setUserPrincipal("")
      setBalance("0")
      setCurrentView("home")
      setSelectedArticle(null)
    } catch (error) {
      console.error("Failed to disconnect:", error)
      setIsConnected(false)
      setUserPrincipal("")
      setBalance("0")
      setCurrentView("home")
      setSelectedArticle(null)
    }
  }

  const openArticleReader = (article) => {
    setSelectedArticle(article)
    setCurrentView("reader")
  }

  const closeArticleReader = () => {
    setSelectedArticle(null)
    setCurrentView("main")
  }

  if (!isMounted) {
    return null
  }


  // Home Page (Before Connection)
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">pArticleNFT</span>
              <Badge variant="secondary" className="ml-2 flex items-center gap-1 px-2 py-0.5 text-sm">
                <Globe className="h-3 w-3" />
                Decentralized
              </Badge>
            </div>

            {/* Connect Button */}
            <Button onClick={connectWallet}>
              <Wallet className="w-4 h-4 mr-2" />
              Connect InternetIdentity
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Screen */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="max-w-2xl">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome to ArticleNFT</h1>
              <p className="text-xl text-muted-foreground mb-8">
                The decentralized platform for publishing, owning, and trading article NFTs on the Internet Computer
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Publish Articles</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and mint your articles as NFTs with full ownership rights
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Zap className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Trade & Collect</h3>
                    <p className="text-sm text-muted-foreground">
                      Buy, sell, and collect unique articles from talented writers
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Globe className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Decentralized</h3>
                    <p className="text-sm text-muted-foreground">
                      Built on Internet Computer for true decentralization and ownership
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Button size="lg" onClick={connectWallet}>
                <Wallet className="w-5 h-5 mr-2" />
                Connect InternetIdentity to Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Article Reader Page
  if (currentView === "reader" && selectedArticle) {
    return <ArticleReader article={selectedArticle} onClose={closeArticleReader} />
  }
  // Main App (After Connection)
  return (
    <MainApp
      isConnected={isConnected}
      userPrincipal={userPrincipal}
      balance={balance}
      setBalance={setBalance}
      onDisconnect={disconnectWallet}
      onOpenArticleReader={openArticleReader}
    />
  )
}
