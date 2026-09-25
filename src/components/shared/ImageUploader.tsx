import React, { useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { validateImageFile } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function ImageUploader({ onUpload, isLoading = false, className }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | undefined) => {
    if (!file) return
    setError(null)

    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleUploadClick = async () => {
    if (!selectedFile) return
    try {
      await onUpload(selectedFile)
      clearSelection()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload image.')
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[160px]',
          dragActive
            ? 'border-amber-500 bg-amber-50/50'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50',
          !selectedFile && 'cursor-pointer'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />

        {previewUrl ? (
          <div className="relative group max-w-xs">
            <img
              src={previewUrl}
              alt="Upload preview"
              className="max-h-40 rounded-xl object-cover shadow-sm border border-slate-200"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearSelection()
              }}
              className="absolute -top-2 -right-2 p-1.5 bg-white text-slate-700 hover:text-rose-600 rounded-full shadow-md border border-slate-200 transition-colors"
              title="Remove selected image"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-500 mt-2 truncate max-w-[200px] text-center">
              {selectedFile?.name} ({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, or WebP up to 5 MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={clearSelection} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleUploadClick} isLoading={isLoading}>
            <ImageIcon className="w-4 h-4 mr-1.5" />
            Upload Image
          </Button>
        </div>
      )}
    </div>
  )
}
