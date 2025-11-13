// src/app/dashboard/vendedor/nuevo/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed Link import as we use router.back()
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const categories = [
  "Camisas",
  "Pantalones",
  "Vestidos",
  "Accesorios",
  "Chaquetas",
  "Faldas",
  "Zapatos",
  "Ropa de Bebé",
  "Sudaderas",
  "Ropa Infantil",
]; // Added more categories
const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Talla Única",
  "0-3m",
  "3-6m",
  "6-9m",
  "9-12m",
  "12-18m",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "30W/32L",
  "32W/30L",
  "32W/32L",
  "34W/32L",
  "34W/34L",
]; // Added more sizes

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [stock, setStock] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!description.trim())
      newErrors.description = "La descripción es obligatoria.";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0)
      newErrors.price = "Ingresa un precio válido.";
    if (!category) newErrors.category = "Selecciona una categoría.";
    if (availableSizes.length === 0)
      newErrors.sizes = "Selecciona al menos una talla.";
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0)
      newErrors.stock = "Ingresa un stock válido (0 o más).";
    if (!imageFile) newErrors.image = "Es necesario cargar una imagen.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de Validación",
        description: "Por favor, corrige los errores en el formulario.",
      });
      return;
    }

    setLoading(true);

    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user?.email) {
        toast({ variant: "destructive", title: "Sesión requerida", description: "Inicia sesión para publicar productos." });
        router.push("/(auth)/login");
        return;
      }

      const payload = {
        userEmail: String(user.email),
        name,
        description,
        price: parseFloat(price),
        imageUrl: imagePreview || undefined,
        stock: parseInt(stock, 10),
        status: "Activo" as const,
        category,
        sizes: availableSizes,
        hint: `${category.toLowerCase()} ${name.split(" ")[0].toLowerCase()}`.substring(0, 20),
        hasDelivery: true,
        rating: 4.5,
      };

      const resp = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.status === 201) {
        toast({ title: "Producto Añadido", description: `"${name}" ha sido añadido a tus publicaciones.` });
        router.push("/dashboard/vendedor");
      } else {
        const data = await resp.json().catch(() => null);
        toast({ variant: "destructive", title: "Error al crear", description: data?.message || resp.statusText });
      }
    } catch (error) {
      console.error("POST /api/products error", error);
      toast({ variant: "destructive", title: "Error de red", description: "No se pudo crear el producto." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Por favor, selecciona un archivo de imagen.",
        }));
        setImagePreview(null);
        setImageFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          image: "La imagen es demasiado grande (máx 5MB).",
        }));
        setImagePreview(null);
        setImageFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));
      toast({
        title: "Imagen Previsualizada",
        description: "La imagen está lista para ser subida.",
      });
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setAvailableSizes((prev) => {
      const newSizes = checked
        ? [...prev, size]
        : prev.filter((s) => s !== size);
      if (newSizes.length > 0) {
        setErrors((prev) => ({ ...prev, sizes: "" }));
      }
      return newSizes;
    });
  };

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Volver a Mis Publicaciones
      </Button>

      <Card className="w-full max-w-3xl mx-auto border shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Añadir Nuevo Producto
          </CardTitle>
          <CardDescription>
            Completa los detalles de tu producto para publicarlo en TextiSur.
            Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ej: Camisa de Lino Blanca"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                disabled={loading}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-xs text-destructive flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe tu producto: materiales, corte, detalles especiales, origen..."
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                disabled={loading}
                rows={4}
                aria-invalid={!!errors.description}
                aria-describedby="description-error"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="text-xs text-destructive flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Ej: 25.00"
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  disabled={loading}
                  min="0.01"
                  step="0.01"
                  aria-invalid={!!errors.price}
                  aria-describedby="price-error"
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p
                    id="price-error"
                    className="text-xs text-destructive flex items-center"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock (Cantidad) *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Ej: 10"
                  required
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    setErrors((prev) => ({ ...prev, stock: "" }));
                  }}
                  disabled={loading}
                  min="0"
                  step="1"
                  aria-invalid={!!errors.stock}
                  aria-describedby="stock-error"
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && (
                  <p
                    id="stock-error"
                    className="text-xs text-destructive flex items-center"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  disabled={loading}
                  required
                  name="category"
                >
                  <SelectTrigger
                    id="category"
                    className={errors.category ? "border-destructive" : ""}
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                  >
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p
                    id="category-error"
                    className="text-xs text-destructive flex items-center"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tallas Disponibles *</Label>
                <div
                  className={`grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 border p-3 rounded-md min-h-[40px] ${errors.sizes ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.sizes}
                  aria-describedby="sizes-error"
                >
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={availableSizes.includes(size)}
                        onCheckedChange={(checked) =>
                          handleSizeChange(size, !!checked)
                        }
                        disabled={loading}
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.sizes && (
                  <p
                    id="sizes-error"
                    className="text-xs text-destructive flex items-center"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.sizes}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-upload">Imagen del Producto *</Label>
              <div
                className={`flex flex-col sm:flex-row items-center gap-4 border rounded-md p-4 ${errors.image ? "border-destructive" : ""}`}
                aria-invalid={!!errors.image}
                aria-describedby="image-error"
              >
                <div className="flex-shrink-0 w-24 h-32 bg-secondary rounded-md flex items-center justify-center overflow-hidden border">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Vista previa"
                      width={96}
                      height={128}
                      className="object-cover w-full h-full"
                      data-ai-hint="product preview" // Added data-ai-hint
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-grow text-center sm:text-left space-y-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    disabled={loading}
                    required
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    disabled={loading}
                  >
                    <Upload className="mr-2 h-4 w-4" />{" "}
                    {imagePreview ? "Cambiar Imagen" : "Cargar Imagen"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP. Máx 5MB.
                  </p>
                  {errors.image && (
                    <p
                      id="image-error"
                      className="text-xs text-destructive flex items-center justify-center sm:justify-start"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {/* Changed Link to Button with onClick */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-accent"
                disabled={
                  loading || Object.keys(errors).some((key) => !!errors[key])
                }
              >
                {loading ? "Publicando..." : "Publicar Producto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
