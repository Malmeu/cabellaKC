import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({ value, onChange, onError }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      onError?.('Veuillez sélectionner une image')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('L\'image ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)

    try {
      // Générer un nom unique pour le fichier
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      onChange?.(publicUrl)

    } catch (error) {
      console.error('Erreur upload:', error)
      onError?.('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!preview) return

    try {
      // Extraire le chemin du fichier de l'URL
      const url = new URL(preview)
      const pathParts = url.pathname.split('/storage/v1/object/public/products/')
      if (pathParts.length > 1) {
        const filePath = pathParts[1]
        await supabase.storage.from('products').remove([filePath])
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
    }

    setPreview(null)
    onChange?.('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {preview ? (
        <div className="relative">
          <div className="w-full h-48 bg-cream rounded-xl overflow-hidden">
            <img
              src={preview}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all ${
            uploading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
              <span className="text-sm text-slate-500">Upload en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-slate-700">Cliquez pour ajouter une image</span>
              <span className="text-xs text-slate-500 mt-1">PNG, JPG jusqu'à 5MB</span>
            </div>
          )}
        </label>
      )}
    </div>
  )
}
