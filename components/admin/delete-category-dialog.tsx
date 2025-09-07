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

interface DeleteCategoryDialogProps {
  categoryId: string
  categoryName: string
  onDeleted?: () => void
}

export default function DeleteCategoryDialog({ 
  categoryId, 
  categoryName, 
  onDeleted 
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`${config.api.baseUrl}/api/categories/${categoryId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete category")
      }

      toast({
        title: "Success!",
        description: `Category "${categoryName}" has been deleted successfully.`,
      })

      // Call the callback if provided
      if (onDeleted) {
        onDeleted()
      } else {
        // Default behavior: redirect to categories page
        router.push("/admin/categories")
      }
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
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
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{categoryName}"? 
            This action cannot be undone and will remove all products in this category.
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
              "Delete Category"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
