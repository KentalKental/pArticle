"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Eye,
  Heart,
  DollarSign,
  FileText,
  Globe,
  MessageCircle,
  ThumbsUp,
  Reply,
  Send,
  Star,
  Sparkles,
  Loader2,
  X,
  Copy,
  Check,
} from "lucide-react"
import { useState } from "react"

export default function ArticleReader({ article, onClose }) {
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alex Chen",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      content: "This is a fantastic article! Really opened my eyes to the potential of decentralized publishing.",
      timestamp: "2 hours ago",
      likes: 12,
      isLiked: false,
      rating: 5,
      replies: [
        {
          id: 2,
          author: "Sarah Kim",
          authorAvatar: "/placeholder.svg?height=32&width=32",
          content: "I completely agree! The future of content creation is definitely heading in this direction.",
          timestamp: "1 hour ago",
          likes: 5,
          isLiked: true,
        },
      ],
    },
    {
      id: 3,
      author: "Mike Johnson",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      content:
        "Great insights on blockchain technology. Would love to see more articles like this covering the technical aspects.",
      timestamp: "4 hours ago",
      likes: 8,
      isLiked: false,
      rating: 4,
      replies: [],
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  
  // Gemini API states
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summaryError, setSummaryError] = useState("")
  const [copied, setCopied] = useState(false)

  if (!article) return null

  // Gemini API Integration
  const generateSummary = async () => {
    setIsGeneratingSummary(true)
    setSummaryError("")
    
    try {
      // Replace 'YOUR_GEMINI_API_KEY' with your actual API key
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
      
      if (API_KEY === 'YOUR_GEMINI_API_KEY') {
        throw new Error('Please set your Gemini API key in environment variables')
      }

      const articleText = `
        Title: ${article.title}
        
        Content: ${article.content}
        
        Category: ${article.category}
      `

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please provide a comprehensive summary of the following article. Include:
                1. Main key points (3-5 bullet points)
                2. Core message or thesis
                3. Important insights or conclusions
                4. Target audience relevance
                
                Format the response in a clear, structured way with headings and bullet points.
                
                Article to summarize:
                ${articleText}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 1024,
            }
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to generate summary')
      }

      const data = await response.json()
      const generatedSummary = data.candidates[0]?.content?.parts[0]?.text || 'No summary generated'
      
      setSummary(generatedSummary)
      setShowSummary(true)
      
    } catch (error) {
      console.error('Error generating summary:', error)
      setSummaryError(error.message || 'Failed to generate summary. Please try again.')
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy summary:', error)
    }
  }

  const handleRating = (rating) => {
    setUserRating(rating)
    setHasRated(true)
  }

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Great",
      5: "Excellent",
    }
    return ratingTexts[rating] || ""
  }

  const getRatingColor = (rating) => {
    const colors = {
      1: "text-red-500",
      2: "text-orange-500",
      3: "text-yellow-500",
      4: "text-blue-500",
      5: "text-green-500",
    }
    return colors[rating] || "text-gray-400"
  }

  const addComment = () => {
    if (!newComment.trim() || !hasRated) return

    const comment = {
      id: Date.now(),
      author: "You",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      timestamp: "now",
      likes: 0,
      isLiked: false,
      rating: userRating,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const addReply = (commentId) => {
    if (!replyText.trim()) return

    const reply = {
      id: Date.now(),
      author: "You",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      content: replyText,
      timestamp: "now",
      likes: 0,
      isLiked: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setReplyText("")
    setReplyingTo(null)
  }

  const toggleLike = (commentId, isReply = false, parentId = null) => {
    setComments(
      comments.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                : reply,
            ),
          }
        } else if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        return comment
      }),
    )
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") return b.id - a.id
    if (sortBy === "oldest") return a.id - b.id
    if (sortBy === "most-liked") return b.likes - a.likes
    return 0
  })

  // Calculate average rating from main comments only (not replies)
  const calculateAverageRating = () => {
    if (comments.length === 0) return 0
    const sum = comments.reduce((total, comment) => total + comment.rating, 0)
    return (sum / comments.length).toFixed(1)
  }

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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateSummary}
              disabled={isGeneratingSummary}
              className="gap-2"
            >
              {isGeneratingSummary ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </header>

      {/* AI Summary Modal/Panel */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">AI Generated Summary</h2>
                <Badge variant="secondary" className="text-xs">
                  Powered by Gemini
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySummary}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSummary(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50 mb-4">
                  <p className="text-sm text-muted-foreground mb-0">
                    <strong>Article:</strong> {article.title}
                  </p>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast for Summary */}
      {summaryError && (
        <div className="fixed top-20 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm">{summaryError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSummaryError("")}
              className="h-auto p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={article.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{article.author?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">by {article.author}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.createdAt}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {article.category}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{article.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{article.likes} likes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-primary">{article.price} ICP</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Article Image */}
          {article.image && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=400&width=800"
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-6 text-lg leading-relaxed">
              {article.content?.split("\n").map((paragraph, index) => (
                <p key={index} className="text-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <Separator />

            <div className="space-y-6">
              {/* Comments Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <h3 className="text-xl font-semibold">Comments</h3>
                  <Badge variant="secondary">
                    {comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)}
                  </Badge>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-md bg-background"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="most-liked">Most liked</option>
                </select>
              </div>

              {/* Overall Rating Summary */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{calculateAverageRating()}</div>
                    <div className="flex items-center gap-1 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(calculateAverageRating())
                              ? "fill-current text-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">{comments.length} ratings</div>
                  </div>

                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = comments.filter((c) => c.rating === rating).length
                      const total = comments.length
                      const percentage = total > 0 ? (count / total) * 100 : 0

                      return (
                        <div key={rating} className="flex items-center gap-2 text-xs">
                          <span className="w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getRatingColor(rating).replace("text-", "bg-")}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-muted-foreground">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Add Comment with Rating */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                {!hasRated ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Rate this article first!
                      </h4>
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                      Share your experience by rating this article before leaving a comment
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="group relative transition-all duration-200 hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-all duration-200 ${
                              star <= (hoveredRating || userRating)
                                ? `fill-current ${getRatingColor(hoveredRating || userRating)} drop-shadow-lg`
                                : "text-gray-300 hover:text-gray-400"
                            }`}
                          />
                          {star <= (hoveredRating || userRating) && (
                            <div className="absolute inset-0 animate-pulse">
                              <Star className={`w-8 h-8 ${getRatingColor(hoveredRating || userRating)} opacity-30`} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {(hoveredRating || userRating) > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-semibold ${getRatingColor(hoveredRating || userRating)}`}>
                          {getRatingText(hoveredRating || userRating)}
                        </span>
                        <span className="text-sm text-muted-foreground">({hoveredRating || userRating}/5 stars)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium">Your rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= userRating ? `fill-current ${getRatingColor(userRating)}` : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className={`ml-2 text-sm font-semibold ${getRatingColor(userRating)}`}>
                            {getRatingText(userRating)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setHasRated(false)
                            setUserRating(0)
                          }}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          Change rating
                        </button>
                      </div>

                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this article..."
                        className="w-full p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button onClick={addComment} disabled={!newComment.trim()} size="sm" className="gap-2">
                          <Send className="w-4 h-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Main Comment */}
                    <div className="flex gap-3 p-4 bg-background border rounded-lg hover:shadow-sm transition-shadow">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= comment.rating
                                    ? `fill-current ${getRatingColor(comment.rating)}`
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className={`text-xs font-medium ${getRatingColor(comment.rating)}`}>
                              {getRatingText(comment.rating)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleLike(comment.id)}
                            className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${
                              comment.isLiked ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
                            {comment.likes}
                          </button>
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Reply className="w-3 h-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="ml-11 flex gap-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" />
                          <AvatarFallback className="text-xs">You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author}...`}
                            className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => addReply(comment.id)}
                              disabled={!replyText.trim()}
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                            >
                              Reply
                            </Button>
                            <Button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText("")
                              }}
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies - No star ratings for replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-11 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{reply.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">{reply.author}</span>
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                              <p className="text-xs leading-relaxed">{reply.content}</p>
                              <button
                                onClick={() => toggleLike(reply.id, true, comment.id)}
                                className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${
                                  reply.isLiked ? "text-primary" : "text-muted-foreground"
                                }`}
                              >
                                <ThumbsUp className={`w-3 h-3 ${reply.isLiked ? "fill-current" : ""}`} />
                                {reply.likes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Article Footer */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={article.authorAvatar || "/placeholder.svg"} />
                <AvatarFallback>{article.author?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author}</p>
                <p className="text-sm text-muted-foreground">Article Author</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
