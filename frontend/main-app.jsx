"use client"

import { useState, useEffect } from "react"
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
  Trash2,
  Edit,
  CreditCard,
  CheckCircle,
  Briefcase,
  ImageIcon,
  X,
} from "lucide-react"

const mockArticles = [
  {
    id: 1,
    title: "The Future of Decentralized Publishing",
    author: "Alice Johnson",
    authorPrincipal: "alice-principal-123",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    excerpt: "Exploring how blockchain technology is revolutionizing content creation and ownership...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
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
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
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
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nEt harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
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

export default function MainApp({
  isConnected,
  userPrincipal,
  balance,
  setBalance,
  onDisconnect,
  onOpenArticleReader,
}) {
  const [articles, setArticles] = useState(mockArticles)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("currentPage")
      if (savedPage && (savedPage === "search" || savedPage === "workspace")) {
        return savedPage
      }
    }
    return "search"
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedArticleForPayment, setSelectedArticleForPayment] = useState(null)
  const [paymentStep, setPaymentStep] = useState("confirm")
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    price: "",
    category: "Technology",
    image: null,
  })

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage)
  }, [currentPage])

  const createArticleNFT = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.price) return

    const article = {
      id: Date.now(), // Use timestamp for unique ID
      title: newArticle.title,
      author: "You",
      authorPrincipal: userPrincipal,
      authorAvatar: "/placeholder.svg?height=40&width=40",
      excerpt: newArticle.excerpt || newArticle.content.substring(0, 150) + "...",
      content: newArticle.content,
      price: Number.parseFloat(newArticle.price),
      category: newArticle.category,
      readTime: `${Math.ceil(newArticle.content.split(" ").length / 200)} min read`,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      image: newArticle.image, // Use the actual uploaded image
      isOwned: true,
      isCreatedByUser: true,
    }

    setArticles([article, ...articles])
    setNewArticle({ title: "", content: "", excerpt: "", price: "", category: "Technology", image: null })
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

    setTimeout(() => {
      // Update article ownership
      const updatedArticles = articles.map((article) =>
        article.id === selectedArticleForPayment.id ? { ...article, isOwned: true } : article,
      )
      setArticles(updatedArticles)

      // Update balance
      const newBalance = Number.parseFloat(balance) - selectedArticleForPayment.price
      setBalance(newBalance.toFixed(1))

      setPaymentStep("success")
    }, 2000)
  }

  const closePaymentDialog = () => {
    if (paymentStep === "success" && selectedArticleForPayment) {
      // Find the article that was just purchased
      const purchasedArticle = articles.find((article) => article.id === selectedArticleForPayment.id)
      if (purchasedArticle) {
        // Open the article reader with the purchased article
        onOpenArticleReader(purchasedArticle)
      }
    }

    setIsPaymentDialogOpen(false)
    setSelectedArticleForPayment(null)
    setPaymentStep("confirm")
  }

  const handleImageUpload = (e) => {
    console.log("File input triggered", e.target.files)
    const file = e.target.files[0]
    if (file) {
      console.log("File selected:", file.name, file.size, file.type)

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("File loaded successfully")
        setNewArticle((prev) => ({
          ...prev,
          image: e.target.result,
        }))
      }
      reader.onerror = () => {
        console.error("Error reading file")
        alert("Error reading file")
      }
      reader.readAsDataURL(file)
    } else {
      console.log("No file selected")
    }
  }

  const removeImage = () => {
    setNewArticle((prev) => ({
      ...prev,
      image: null,
    }))
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
        <img
          src={article.image || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=400"
          }}
        />
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
              <Button variant="outline" size="sm" onClick={() => onOpenArticleReader(article)}>
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
            <Badge variant="secondary" className="ml-2 flex items-center gap-1 px-2 py-0.5 text-sm">
              <Globe className="h-3 w-3" />
              Decentralized
            </Badge>
          </div>

          {/* Navigation and User Controls */}
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-medium">{balance} ICP</div>
                <div className="text-muted-foreground text-xs">{userPrincipal.slice(0, 8)}...</div>
              </div>
              <Button variant="outline" onClick={onDisconnect}>
                <Wallet className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Article NFT</DialogTitle>
                      <DialogDescription>
                        Mint your article as an NFT on the Internet Computer blockchain
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={newArticle.title}
                          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                          placeholder="Enter article title"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={newArticle.excerpt}
                          onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                          placeholder="Brief description of your article (optional - will auto-generate from content if empty)"
                          rows={3}
                          className="w-full resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={newArticle.content}
                          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                          placeholder="Write your article content here..."
                          rows={8}
                          className="w-full resize-none"
                        />
                      </div>

                      {/* Image Upload Section */}
                      <div className="space-y-2">
                        <Label>Article Image</Label>
                        {!newArticle.image ? (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Upload an image for your article</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload">
                                <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                                  <span>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Choose Image
                                  </span>
                                </Button>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="relative border rounded-lg overflow-hidden">
                            <img
                              src={newArticle.image || "/placeholder.svg"}
                              alt="Article preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                className="gap-2"
                              >
                                <X className="w-4 h-4" />
                                Remove Image
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            value={newArticle.category}
                            onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            {categories.slice(1).map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (ICP) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.1"
                            min="0"
                            value={newArticle.price}
                            onChange={(e) => setNewArticle({ ...newArticle, price: e.target.value })}
                            placeholder="0.0"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false)
                          setNewArticle({
                            title: "",
                            content: "",
                            excerpt: "",
                            price: "",
                            category: "Technology",
                            image: null,
                          })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={createArticleNFT}
                        disabled={!newArticle.title.trim() || !newArticle.content.trim() || !newArticle.price}
                      >
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
      </div>

      {/* Payment Dialog */}
      {renderPaymentDialog()}
    </div>
  )
}
