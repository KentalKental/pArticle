"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  FileText,
  Plus,
  Eye,
  Heart,
  DollarSign,
  User,
  Search,
  Filter,
  Globe,
  Shield,
  Zap,
  Trash2,
  Edit,
  CreditCard,
  CheckCircle,
  Briefcase,
} from "lucide-react"
import { AuthClient } from "@dfinity/auth-client";



const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === "development" ? "local" : "ic");
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app/'
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}.localhost:4943`;
const mockArticles = [
  {
    id: 1,
    title: "The Future of Decentralized Publishing",
    author: "Alice Johnson",
    authorPrincipal: "alice-principal-123",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    excerpt: "Exploring how blockchain technology is revolutionizing content creation and ownership...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 2.5,
    category: "Technology",
    readTime: "5 min read",
    likes: 42,
    views: 1250,
    createdAt: "2024-01-15",
    image: "/placeholder.svg?height=200&width=400",
    isOwned: false,
    isCreatedByUser: false,
  },
  {
    id: 2,
    title: "NFT Art: Beyond Digital Collectibles",
    author: "You",
    authorPrincipal: "rdmx6-jaaaa-aaaah-qcaiq-cai",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    excerpt: "Understanding the artistic value and cultural impact of NFT art in the modern world...",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 1.8,
    category: "Art",
    readTime: "7 min read",
    likes: 38,
    views: 890,
    createdAt: "2024-01-12",
    image: "/placeholder.svg?height=200&width=400",
    isOwned: true,
    isCreatedByUser: true,
  },
  {
    id: 3,
    title: "Cryptocurrency Market Analysis 2024",
    author: "Carol Davis",
    authorPrincipal: "carol-principal-456",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    excerpt: "A comprehensive analysis of cryptocurrency trends and market predictions for 2024...",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 3.2,
    category: "Finance",
    readTime: "10 min read",
    likes: 67,
    views: 2100,
    createdAt: "2024-01-10",
    image: "/placeholder.svg?height=200&width=400",
    isOwned: false,
    isCreatedByUser: false,
  },
]

export default function ArticleNFTApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [userPrincipal, setUserPrincipal] = useState("")
  const [balance, setBalance] = useState("0")
  const [articles, setArticles] = useState(mockArticles)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState("search")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedArticleForPayment, setSelectedArticleForPayment] = useState(null)
  const [paymentStep, setPaymentStep] = useState("confirm") // confirm, processing, success
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    price: "",
    category: "Technology",
  })

  useEffect(() => {
  const initAuth = async () => {
    const { AuthClient } = await import('@dfinity/auth-client');
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
      }
    }
  };

  initAuth();
  }, []);


    // Mock PlugWallet connection
  const connectWallet = async () => {
    try {
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();

        localStorage.setItem("isConnected", "true");
        localStorage.setItem("principal", principal);

        setIsConnected(true);
        setUserPrincipal(principal);
        setBalance("15.7"); // Replace with actual balance later
        return;
      }

      await authClient.login({
        identityProvider: identityProvider,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();

          localStorage.setItem("isConnected", "true");
          localStorage.setItem("principal", principal);

          setIsConnected(true);
          setUserPrincipal(principal);
          setBalance("15.7");
        },
        onError: (error) => {
          console.error("Internet Identity login failed:", error);
        }
      });
    } catch (error) {
      console.error("Failed to connect with Internet Identity:", error);
    }
  };


    const disconnectWallet = async () => {
    try {
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        await authClient.logout();
      }

      localStorage.removeItem("isConnected");
      localStorage.removeItem("principal");

      setIsConnected(false);
      setUserPrincipal("");
      setBalance("0");
      setCurrentPage("search");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      setIsConnected(false);
      setUserPrincipal("");
      setBalance("0");
      setCurrentPage("search");
    }
  };


  const createArticleNFT = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.price) return

    const article = {
      id: articles.length + 1,
      title: newArticle.title,
      author: "You",
      authorPrincipal: userPrincipal,
      authorAvatar: "/placeholder.svg?height=40&width=40",
      excerpt: newArticle.excerpt,
      content: newArticle.content,
      price: Number.parseFloat(newArticle.price),
      category: newArticle.category,
      readTime: "5 min read",
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      image: "/placeholder.svg?height=200&width=400",
      isOwned: true,
      isCreatedByUser: true,
    }

    setArticles([article, ...articles])
    setNewArticle({ title: "", content: "", excerpt: "", price: "", category: "Technology" })
    setIsCreateDialogOpen(false)
  }

  const deleteArticle = async (articleId) => {
    setArticles(articles.filter((article) => article.id !== articleId))
  }

  const openPaymentDialog = (article) => {
    setSelectedArticleForPayment(article)
    setPaymentStep("confirm")
    setIsPaymentDialogOpen(true)
  }

  const processPayment = async () => {
    setPaymentStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      // Update article ownership
      setArticles(
        articles.map((article) =>
          article.id === selectedArticleForPayment.id ? { ...article, isOwned: true } : article,
        ),
      )

      // Update balance
      const newBalance = Number.parseFloat(balance) - selectedArticleForPayment.price
      setBalance(newBalance.toFixed(1))

      setPaymentStep("success")
    }, 2000)
  }

  const closePaymentDialog = () => {
    setIsPaymentDialogOpen(false)
    setSelectedArticleForPayment(null)
    setPaymentStep("confirm")
  }

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const userCreatedArticles = articles.filter((article) => article.isCreatedByUser)
  const userOwnedArticles = articles.filter((article) => article.isOwned)

  const categories = ["All", "Technology", "Art", "Finance", "Science", "Politics"]

  const renderPaymentDialog = () => (
    <Dialog open={isPaymentDialogOpen} onOpenChange={closePaymentDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {paymentStep === "confirm" && "Confirm Purchase"}
            {paymentStep === "processing" && "Processing Payment"}
            {paymentStep === "success" && "Purchase Successful"}
          </DialogTitle>
        </DialogHeader>

        {paymentStep === "confirm" && selectedArticleForPayment && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">{selectedArticleForPayment.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">by {selectedArticleForPayment.author}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{selectedArticleForPayment.price} ICP</span>
                <Badge>{selectedArticleForPayment.category}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Article Price:</span>
                <span>{selectedArticleForPayment.price} ICP</span>
              </div>
              <div className="flex justify-between">
                <span>Network Fee:</span>
                <span>0.001 ICP</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{(selectedArticleForPayment.price + 0.001).toFixed(3)} ICP</span>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Current Balance:</span>
                <span>{balance} ICP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>After Purchase:</span>
                <span>{(Number.parseFloat(balance) - selectedArticleForPayment.price - 0.001).toFixed(3)} ICP</span>
              </div>
            </div>
          </div>
        )}

        {paymentStep === "processing" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">Please wait while we confirm your transaction</p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">You now own this article NFT</p>
          </div>
        )}

        <DialogFooter>
          {paymentStep === "confirm" && (
            <>
              <Button variant="outline" onClick={closePaymentDialog}>
                Cancel
              </Button>
              <Button onClick={processPayment}>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay {selectedArticleForPayment?.price} ICP
              </Button>
            </>
          )}
          {paymentStep === "success" && (
            <Button onClick={closePaymentDialog} className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Read Article
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderArticleCard = (article, showDeleteButton = false) => (
    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted">
        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{article.category}</Badge>
          <div className="flex gap-2">
            {article.isOwned && (
              <Badge variant="default">
                <User className="w-3 h-3 mr-1" />
                Owned
              </Badge>
            )}
            {article.isCreatedByUser && (
              <Badge variant="outline">
                <Edit className="w-3 h-3 mr-1" />
                Created
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={article.authorAvatar || "/placeholder.svg"} />
            <AvatarFallback>{article.author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{article.author}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{article.readTime}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {article.likes}
            </div>
          </div>
        </div>
        <Separator className="mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">{article.price} ICP</span>
          </div>
          <div className="flex gap-2">
            {showDeleteButton && article.isCreatedByUser && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Article</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{article.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteArticle(article.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {article.isOwned ? (
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Read
              </Button>
            ) : (
              <Button size="sm" onClick={() => openPaymentDialog(article)}>
                <DollarSign className="w-4 h-4 mr-2" />
                Buy
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

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

              {/* Badge */}
              <Badge variant="secondary" className="ml-2 flex items-center gap-1 px-2 py-0.5 text-sm">
                <Globe className="h-3 w-3" />
                Decentralized
              </Badge>
            </div>

            {/* Optional: Add right-side nav or buttons here */}
            {/* <div> ... </div> */}
          </div>  
        </header>

          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currentPage === "search" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage("search")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant={currentPage === "workspace" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage("workspace")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Workspace
                </Button>
              </div>
            )}
            {isConnected ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div className="font-medium">{balance} ICP</div>
                  <div className="text-muted-foreground text-xs">{userPrincipal.slice(0, 8)}...</div>
                </div>
                <Button variant="outline" onClick={disconnectWallet}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect InternetIdentity
              </Button>
            )}
          </div>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          // Welcome Screen
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
        ) : (
          // Main App with Pages
          <div className="space-y-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                      <p className="text-2xl font-bold">{articles.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
                      <p className="text-2xl font-bold">{balance} ICP</p>
                    </div>
                    <Wallet className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created Articles</p>
                      <p className="text-2xl font-bold">{userCreatedArticles.length}</p>
                    </div>
                    <Edit className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Owned Articles</p>
                      <p className="text-2xl font-bold">{userOwnedArticles.length}</p>
                    </div>
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Page */}
            {currentPage === "search" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search articles or authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => renderArticleCard(article))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            )}

            {/* Workspace Page */}
            {currentPage === "workspace" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Workspace</h2>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Article NFT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Article NFT</DialogTitle>
                        <DialogDescription>
                          Mint your article as an NFT on the Internet Computer blockchain
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newArticle.title}
                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                            placeholder="Enter article title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            value={newArticle.excerpt}
                            onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                            placeholder="Brief description of your article"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            value={newArticle.content}
                            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                            placeholder="Write your article content here..."
                            rows={6}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                              id="category"
                              value={newArticle.category}
                              onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                              {categories.slice(1).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="price">Price (ICP)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.1"
                              value={newArticle.price}
                              onChange={(e) => setNewArticle({ ...newArticle, price: e.target.value })}
                              placeholder="0.0"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createArticleNFT}>
                          <Plus className="w-4 h-4 mr-2" />
                          Mint Article NFT
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Tabs defaultValue="created" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="created">Created Articles ({userCreatedArticles.length})</TabsTrigger>
                    <TabsTrigger value="owned">Owned Articles ({userOwnedArticles.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="created" className="space-y-6">
                    {userCreatedArticles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userCreatedArticles.map((article) => renderArticleCard(article, true))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No articles created yet</h3>
                        <p className="text-muted-foreground mb-4">Start creating your first article NFT</p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Article NFT
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="owned" className="space-y-6">
                    {userOwnedArticles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userOwnedArticles.map((article) => renderArticleCard(article))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No articles owned yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Browse and purchase articles to build your collection
                        </p>
                        <Button onClick={() => setCurrentPage("search")}>
                          <Search className="w-4 h-4 mr-2" />
                          Browse Articles
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      {renderPaymentDialog()}
    </div>

  )
}
