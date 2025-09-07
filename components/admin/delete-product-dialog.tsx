"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { toast } from "@/components/ui/use-toast"
import { Trash2, Loader2 } from "lucide-react"
import { config } from "@/lib/config"

interface DeleteProductDialogProps {
  productId: string
  productName: string
  onDeleted?: () => void
}

export default function DeleteProductDialog({ 
  productId, 
  productName, 
  onDeleted 
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`${config.api.baseUrl}/api/products/${productId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete product")
      }

      toast({
        title: "Success!",
        description: `Product "${productName}" has been deleted successfully.`,
      })

      // Call the callback if provided
      if (onDeleted) {
        onDeleted()
      } else {
        // Default behavior: redirect to products page
        router.push("/admin/products")
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the product "{productName}"? 
            This action cannot be undone and will remove all associated data including images, colors, sizes, and features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Product"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
