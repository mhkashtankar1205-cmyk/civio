import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '../hooks/useUser';
import { useTranslation } from '../services/i18n';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// Zod Validation Schema
const signUpSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  area: z.string().optional(),
  terms: z.boolean().optional()
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const JoinCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useSignUpMutation, useLoginMutation } = useUser();
  const signUpMutation = useSignUpMutation();
  const loginMutation = useLoginMutation();

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      area: '',
      terms: false
    }
  });


  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              const addr = data.address || {};
              const cityVal = addr.city || addr.town || addr.municipality || addr.county || addr.suburb || addr.neighbourhood || addr.village;
              const stateVal = addr.state || addr.country;
              const areaParts = [cityVal, stateVal].filter(Boolean);
              const resolvedArea = areaParts.length > 0 ? areaParts.join(', ') : `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
              setValue('area', resolvedArea, { shouldValidate: true });
            })
            .catch(() => {
              setValue('area', `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`, { shouldValidate: true });
            });
        },
        () => {
          setValue('area', 'Nagpur, Maharashtra', { shouldValidate: true });
        }
      );
    } else {
      setValue('area', 'Nagpur, Maharashtra', { shouldValidate: true });
    }
  };

  const onSubmit = (data: SignUpFormValues) => {
    setError('');
    
    if (isLogin) {
      loginMutation.mutate(
        {
          email: data.email,
          password: data.password
        },
        {
          onSuccess: (user) => {
            if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          },
          onError: () => {
            setError('Invalid email or password.');
          }
        }
      );
    } else {
      // Manual field validations for signup
      if (!data.name || data.name.trim().length < 2) {
        setError('Name must be at least 2 characters');
        return;
      }
      if (!data.username || data.username.trim().length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      if (!data.area || data.area.trim().length < 3) {
        setError('Please specify your area');
        return;
      }
      if (!data.terms) {
        setError('You must agree to the Terms of Service');
        return;
      }

      signUpMutation.mutate(
        {
          name: data.name,
          username: data.username,
          email: data.email,
          area: data.area,
          password: data.password
        },
        {
          onSuccess: () => {
            navigate('/');
          },
          onError: () => {
            setError('Failed to create account. Please try again.');
          }
        }
      );
    }
  };

  const handleSocialMock = (provider: string) => {
    signUpMutation.mutate(
      {
        name: `${provider} User`,
        username: `${provider.toLowerCase()}_user_${Math.floor(Math.random() * 1000)}`,
        email: `${provider.toLowerCase()}_${Math.floor(Math.random() * 10000)}@example.com`,
        area: 'Nagpur, Maharashtra',
        password: 'password123'
      },
      {
        onSuccess: () => {
          navigate('/');
        }
      }
    );
  };

  return (
    <main className="w-full max-w-[600px] mx-auto min-h-screen px-margin-mobile flex flex-col bg-black pb-12 select-none" role="main">
      {/* Top Header */}
      <header className="w-full z-50 bg-black flex justify-between items-center h-16 border-b border-white/5 mb-8" role="banner">
        <div 
          tabIndex={0}
          role="button"
          aria-label="Civio Home link"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/onboarding'); }}
          className="font-display-lg text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded" 
          onClick={() => navigate('/onboarding')}
        >
          Civio
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main registration form */}
      <div className="flex-1 flex flex-col">
        {/* Welcome */}
        <div className="mb-8 text-center">
          <h1 className="font-display-lg text-3xl text-white font-extrabold mb-1">
            {isLogin ? t('sign_in') : t('create_account')}
          </h1>
          <p className="font-body-md text-on-surface-variant opacity-80">
            {isLogin ? t('welcome_back_desc') : t('empower_neighborhood_desc')}
          </p>
        </div>

        {/* Social Logins - Google Only */}
        <div className="mb-8">
          <button
            onClick={() => handleSocialMock('Google')}
            type="button"
            aria-label={isLogin ? t('sign_in') : t('create_account')}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-surface-container border border-white/10 hover:bg-surface-container-high transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              alt="Google Logo"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCFycfn4DI6B1ox3z4RLFKYzZwe-aVKGUM6Rq_9Fb_dEgeabyRDB8SoMe1ToxCxNoqMD9gHCL8GipYBVNy70TgDfwbRgcX4ruYYf0-rq8i1g83PTozYtjpSTFvSywEinQGUb8Dnqlt4NFdQt0RgHe92P_W03KSwEk67g1zrMdRdfcuxoBKwr9lQ2gPVeEsL32teIvSjMpXPd4u0pzE9fwAG-jqbt4oRE0KxsbGjF8KE_B7pJ63tRU9NfYZdhFGfH8ORlD220hVbq8"
            />
            <span className="font-label-bold text-label-bold text-on-surface">{t('continue_with_google')}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="font-label-bold text-[10px] text-on-surface-variant/40 tracking-widest uppercase">{t('or_email')}</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-label-bold" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant ml-1 tracking-wider uppercase">{t('full_name')}</label>
              <div className="relative group">
                <input
                  type="text"
                  {...register('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="w-full h-14 bg-surface-container border-none rounded-xl pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder=""
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                  person
                </span>
              </div>
              {errors.name && (
                <p id="name-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* Username */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant ml-1 tracking-wider uppercase">{t('username')}</label>
              <div className="relative group">
                <input
                  type="text"
                  {...register('username')}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  className="w-full h-14 bg-surface-container border-none rounded-xl pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder=""
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                  alternate_email
                </span>
              </div>
              {errors.username && (
                <p id="username-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.username.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="font-label-bold text-[10px] text-on-surface-variant ml-1 tracking-wider uppercase">{t('email_address')}</label>
            <div className="relative group">
              <input
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full h-14 bg-surface-container border-none rounded-xl pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
                placeholder=""
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                mail
              </span>
            </div>
            {errors.email && (
              <p id="email-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="font-label-bold text-[10px] text-on-surface-variant ml-1 tracking-wider uppercase">{t('password')}</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full h-14 bg-surface-container border-none rounded-xl pl-12 pr-12 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
                placeholder=""
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.password.message}</p>
            )}
          </div>

          {/* Area */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="font-label-bold text-[10px] text-on-surface-variant ml-1 tracking-wider uppercase">{t('your_area')}</label>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <input
                    type="text"
                    {...register('area')}
                    aria-invalid={!!errors.area}
                    aria-describedby={errors.area ? 'area-error' : undefined}
                    className="w-full h-14 bg-surface-container border-none rounded-xl pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 transition-all outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder=""
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-xl">
                    map
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLocate}
                  aria-label="Locate via GPS"
                  className="h-14 w-14 flex items-center justify-center rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all active:scale-95 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Locate via GPS"
                >
                  <span className="material-symbols-outlined text-xl">my_location</span>
                </button>
              </div>
              {errors.area && (
                <p id="area-error" className="text-error text-xs font-label-bold ml-1" role="alert">{errors.area.message}</p>
              )}
            </div>
          )}

          {/* T&C */}
          {!isLogin && (
            <div className="pt-2 flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  {...register('terms')}
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? 'terms-error' : undefined}
                  className="mt-1 w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary focus:ring-offset-0 focus-visible:ring-2"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                  {t('agree_to_terms')}
                </label>
              </div>
              {errors.terms && (
                <p id="terms-error" className="text-error text-xs font-label-bold ml-1 mt-1" role="alert">{errors.terms.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signUpMutation.isPending || loginMutation.isPending}
            aria-label={isLogin ? "Submit Sign In Form" : "Submit Sign Up Form"}
            className="w-full h-16 mt-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-headline-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(81,73,212,0.3)] transition-all hover:shadow-[0_8px_40px_rgba(81,73,212,0.5)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {signUpMutation.isPending || loginMutation.isPending ? (
              <span className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                {isLogin ? t('sign_in') : t('sign_up')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Link */}
        <div className="mt-12 text-center pb-6">
          <p className="font-body-md text-on-surface-variant">
            {isLogin ? t('dont_have_account') : t('already_have_account_q')}
            <span 
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsLogin(!isLogin); setError(''); } }}
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="font-label-bold text-primary hover:underline cursor-pointer underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isLogin ? t('sign_up') : t('log_in')}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};
export default JoinCommunity;
