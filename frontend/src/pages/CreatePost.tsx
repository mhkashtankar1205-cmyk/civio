import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePosts } from '../hooks/usePosts';
import { uploadService } from '../services/uploadService';
import { BottomNavbar } from '../components/BottomNavbar';
import { t } from '../services/i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Zod Validation Schema
const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.enum(['Pothole', 'Garbage', 'Water', 'Lighting']),
  area: z.string().min(3, 'Area / Location must be at least 3 characters'),
  latitude: z.number(),
  longitude: z.number()
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { useCreatePostMutation } = usePosts();
  const createPostMutation = useCreatePostMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const autocompleteTimeoutRef = useRef<any>(null);

  const handleSearchAutocomplete = (query: string) => {
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
    }

    if (!query || query.trim().length < 3) {
      setSearchSuggestions([]);
      return;
    }

    autocompleteTimeoutRef.current = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSearchSuggestions(data);
          }
        })
        .catch(() => {
          setSearchSuggestions([]);
        });
    }, 400);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    
    setValue('area', suggestion.display_name, { shouldValidate: true });
    setValue('latitude', lat);
    setValue('longitude', lon);
    setSearchSuggestions([]);
  };

  const categories = ['Pothole', 'Garbage', 'Water', 'Lighting'];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Pothole',
      area: '',
      latitude: 37.7749,
      longitude: -122.4194
    }
  });

  const watchLat = watch('latitude');
  const watchLon = watch('longitude');

  const previewMapRef = useRef<HTMLDivElement>(null);
  const previewMapInstance = useRef<L.Map | null>(null);
  const previewMarkerRef = useRef<L.Marker | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('File size exceeds the 5MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLocate = () => {
    setIsLocating(true);
    setSubmitError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          setValue('latitude', lat);
          setValue('longitude', lon);

          // Reverse geocoding via OpenStreetMap Nominatim API
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              const addr = data.address || {};
              const areaParts = [
                addr.road || addr.suburb || addr.neighbourhood || addr.city_district || addr.village,
                addr.city || addr.town || addr.municipality || addr.county,
                addr.state
              ].filter(Boolean);
              
              const resolvedArea = areaParts.length > 0 ? areaParts.join(', ') : data.display_name;
              setValue('area', resolvedArea, { shouldValidate: true });
              setIsLocating(false);
            })
            .catch(() => {
              // Fallback to coordinates
              setValue('area', `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`, { shouldValidate: true });
              setIsLocating(false);
            });
        },
        () => {
          setSubmitError('Failed to fetch GPS coordinates. Using defaults.');
          setIsLocating(false);
        }
      );
    } else {
      setSubmitError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };

  // Location preview map effect
  useEffect(() => {
    if (!previewMapRef.current) {
      if (previewMapInstance.current) {
        previewMapInstance.current.remove();
        previewMapInstance.current = null;
        previewMarkerRef.current = null;
      }
      return;
    }

    if (!previewMapInstance.current) {
      const map = L.map(previewMapRef.current, {
        center: [watchLat, watchLon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);

      const marker = L.marker([watchLat, watchLon]).addTo(map);

      previewMapInstance.current = map;
      previewMarkerRef.current = marker;
    } else {
      previewMapInstance.current.setView([watchLat, watchLon], 14);
      if (previewMarkerRef.current) {
        previewMarkerRef.current.setLatLng([watchLat, watchLon]);
      }
    }
  }, [watchLat, watchLon]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (previewMapInstance.current) {
        previewMapInstance.current.remove();
        previewMapInstance.current = null;
      }
    };
  }, []);

  const onSubmit = async (data: CreatePostFormValues) => {
    setSubmitError('');
    setImageError('');

    if (!imageFile) {
      setImageError('Please upload a photo of the issue.');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadService.uploadImage(imageFile);
      
      createPostMutation.mutate(
        {
          title: data.title,
          description: data.description,
          category: data.category,
          area: data.area,
          distance: '0.1 km away',
          imageUrl,
          location: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        },
        {
          onSuccess: () => {
            setIsUploading(false);
            navigate('/');
          },
          onError: () => {
            setSubmitError('Failed to submit report. Please try again.');
            setIsUploading(false);
          }
        }
      );
    } catch {
      setSubmitError('Image upload failed.');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center" role="banner">
        <div className="w-full max-w-[600px] mx-auto px-margin-mobile flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            aria-label="Go back"
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
          >
            arrow_back
          </button>
          <h1 className="font-display-lg text-lg font-bold">Report Civic Issue</h1>
          <div className="w-6 h-6"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-margin-mobile max-w-[600px] mx-auto min-h-screen flex flex-col justify-between" role="main">
        <div className="flex-1">
          {submitError && (
            <div className="mb-5 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-label-bold" role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-6">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase ml-1">Photo upload</label>
              
              {imagePreview ? (
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 group">
                  <img className="w-full h-full object-cover" src={imagePreview} alt="Civic issue preview" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    aria-label="Delete uploaded image"
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-black transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="material-symbols-outlined text-lg block">delete</span>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-square w-full rounded-2xl border-2 border-dashed border-white/15 bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer select-none outline-none focus-within:ring-2 focus-within:ring-primary">
                  <span className="material-symbols-outlined text-primary text-4xl mb-2">add_a_photo</span>
                  <span className="font-label-bold text-xs text-on-surface">{t('snap_photo')}</span>
                  <span className="text-[10px] text-on-surface-variant mt-1.5">{t('max_file_size')}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              )}
              {imageError && (
                <p className="text-error text-xs font-label-bold ml-1" role="alert">{t('photo_required')}</p>
              )}
            </div>

            {/* Issue Title */}
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase ml-1">{t('issue_title')}</label>
              <input
                type="text"
                {...register('title')}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
                placeholder={t('title_placeholder')}
                className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.title && (
                <p id="title-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.title.message}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase ml-1">{t('category')}</label>
              <select
                {...register('category')}
                className="w-full h-12 bg-surface-container border-none rounded-xl px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{t(cat.toLowerCase())}</option>
                ))}
              </select>
            </div>

            {/* Area Name */}
            <div className="space-y-2 relative">
              <label className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase ml-1">{t('area_name')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register('area')}
                  onChange={(e) => {
                    setValue('area', e.target.value);
                    handleSearchAutocomplete(e.target.value);
                  }}
                  aria-invalid={!!errors.area}
                  aria-describedby={errors.area ? 'area-error' : undefined}
                  placeholder={t('area_placeholder')}
                  className="flex-1 h-12 bg-surface-container border-none rounded-xl px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleLocate}
                  disabled={isLocating}
                  aria-label="Detect current location coordinates"
                  className="h-12 w-12 bg-primary-container text-on-primary-container hover:bg-primary-container/80 flex items-center justify-center rounded-xl active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title={t('gps_auto')}
                >
                  {isLocating ? (
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">my_location</span>
                  )}
                </button>
              </div>
              
              {/* Autocomplete Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-14 mt-1 bg-surface-container-highest border border-white/10 rounded-xl max-h-60 overflow-y-auto z-50 shadow-2xl glass-panel p-1">
                  {searchSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 text-on-surface transition-colors truncate"
                    >
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}

              {errors.area && (
                <p id="area-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.area.message}</p>
              )}
            </div>

            {/* Coordinates display */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-[10px] font-label-bold text-on-surface-variant/50 uppercase tracking-widest px-1">
                <span>LAT: {watchLat ? watchLat.toFixed(6) : '0.000000'}</span>
                <span>LON: {watchLon ? watchLon.toFixed(6) : '0.000000'}</span>
              </div>

              {/* Live Map Preview */}
              {watchLat && watchLon && (
                <div className="space-y-1">
                  <label className="font-label-bold text-[10px] text-on-surface-variant/60 tracking-wider uppercase ml-1">{t('location_preview_map')}</label>
                  <div ref={previewMapRef} className="h-40 w-full rounded-xl border border-white/10 overflow-hidden bg-zinc-950 z-10" />
                </div>
              )}
            </div>

            {/* Caption / Description */}
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant tracking-wider uppercase ml-1">{t('description')}</label>
              <textarea
                {...register('description')}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
                placeholder={t('description_placeholder')}
                rows={4}
                className="w-full bg-surface-container border-none rounded-xl p-4 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none resize-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.description && (
                <p id="description-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.description.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || createPostMutation.isPending}
              aria-label="Submit report"
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline-lg-mobile flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(81,73,212,0.3)] rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isUploading || createPostMutation.isPending ? (
                <span className="animate-spin w-5 h-5 border-4 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  {t('report_issue')}
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
};
export default CreatePost;
