'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  gender: 'HOMME' | 'FEMME' | 'ENFANT';
  category: {
    id: string;
    name: string;
  };
  images: Array<{ id: string; url: string }>;
  sizes: Array<{ id: string; size: string }>;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  isEditing: boolean;
  onSaved: () => void;
}

export function ProductDialog({ open, onOpenChange, product, isEditing, onSaved }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    gender: 'HOMME' as 'HOMME' | 'FEMME' | 'ENFANT',
    categoryId: '',
    images: [] as string[],
    sizes: [] as string[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (product && isEditing) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          gender: product.gender,
          categoryId: product.category.id,
          images: product.images.map(img => img.url),
          sizes: product.sizes.map(size => size.size),
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          gender: 'HOMME',
          categoryId: '',
          images: [],
          sizes: [],
        });
      }
    }
  }, [open, product, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `/api/products/${product?.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          gender: formData.gender,
          categoryId: formData.categoryId,
          images: formData.images,
          sizes: formData.sizes,
        }),
      });

      if (response.ok) {
        onSaved();
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'HOMME' | 'FEMME' | 'ENFANT') => 
                  setFormData(prev => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOMME">Homme</SelectItem>
                  <SelectItem value="FEMME">Femme</SelectItem>
                  <SelectItem value="ENFANT">Enfant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button type="button" onClick={addImage} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((url, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <span className="truncate max-w-32">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sizes</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Size (e.g., S, M, L, XL)"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
              />
              <Button type="button" onClick={addSize} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.sizes.map((size, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {size}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSize(index)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}










