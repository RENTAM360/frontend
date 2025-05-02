"use client"

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const [loginError, setLoginError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    // Fake login logic
    if (data.email !== 'user@example.com' || data.password !== 'password123') {
      setLoginError('Invalid login credentials. Please try again.');
      return;
    }
    setLoginError('');
    alert('Login successful!');
  };
  return (
    <main className="flex min-h-screen font-sans flex-col md:flex-row">
      {/* Left visual section */}
      <div className="relative md:w-1/2 h-[300px] md:h-auto">
        <Image
          src="/warehouse-bg.png"
          alt="Warehouse background"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 p-10 flex max-w-md flex-col justify-between text-white z-10">
          <div className="text-primary text-2xl font-bold">
            <Link href="/" className="flex items-center gap-2" aria-label="Rentam360 home">
                <svg width="197" height="40" viewBox="0 0 197 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3994 0.600098V11.7998L14.932 18.8152L15.2532 7.93406L1.76953 8.06745L9.33217 0.600098H22.3994Z" fill="#12B76A"/>
                    <path d="M0 9.93506H13.0672V39.8018C5.85029 39.8018 0 33.9515 0 26.7346V9.93506Z" fill="#12B76A"/>
                    <path d="M15.2539 21.1348L27.2839 33.1648C30.8665 36.7501 36.6596 36.81 40.3184 33.3037L42.0008 31.692L23.1732 13.2156L15.2539 21.1348Z" fill="#12B76A"/>
                    <path d="M51.909 27V10.9H58.878C60.3193 10.9 61.5613 11.1377 62.604 11.613C63.6467 12.073 64.4517 12.74 65.019 13.614C65.5863 14.488 65.87 15.5307 65.87 16.742C65.87 17.938 65.5863 18.973 65.019 19.847C64.4517 20.7057 63.6467 21.365 62.604 21.825C61.5613 22.285 60.3193 22.515 58.878 22.515H53.979L55.635 20.882V27H51.909ZM62.144 27L58.119 21.158H62.098L66.169 27H62.144ZM55.635 21.296L53.979 19.548H58.671C59.821 19.548 60.6797 19.3027 61.247 18.812C61.8143 18.306 62.098 17.616 62.098 16.742C62.098 15.8527 61.8143 15.1627 61.247 14.672C60.6797 14.1813 59.821 13.936 58.671 13.936H53.979L55.635 12.165V21.296ZM72.2491 17.386H80.0001V20.284H72.2491V17.386ZM72.5251 24.01H81.2881V27H68.8221V10.9H80.9891V13.89H72.5251V24.01ZM84.2528 27V10.9H87.3348L96.8338 22.492H95.3387V10.9H99.0188V27H95.9598L86.4378 15.408H87.9328V27H84.2528ZM106.163 27V13.936H101.011V10.9H115.041V13.936H109.889V27H106.163ZM114.121 27L121.297 10.9H124.977L132.176 27H128.266L122.378 12.786H123.85L117.939 27H114.121ZM117.709 23.55L118.698 20.721H126.978L127.99 23.55H117.709ZM133.847 27V10.9H136.929L143.783 22.262H142.15L148.889 10.9H151.948L151.994 27H148.498L148.475 16.259H149.119L143.737 25.298H142.058L136.561 16.259H137.343V27H133.847ZM160.022 27.276C158.903 27.276 157.791 27.1303 156.687 26.839C155.583 26.5323 154.648 26.103 153.881 25.551L155.33 22.699C155.944 23.1437 156.657 23.4963 157.469 23.757C158.282 24.0177 159.102 24.148 159.93 24.148C160.866 24.148 161.602 23.964 162.138 23.596C162.675 23.228 162.943 22.722 162.943 22.078C162.943 21.4647 162.706 20.9817 162.23 20.629C161.755 20.2763 160.988 20.1 159.93 20.1H158.228V17.639L162.713 12.556L163.127 13.89H154.686V10.9H165.956V13.315L161.494 18.398L159.608 17.317H160.689C162.667 17.317 164.162 17.7617 165.174 18.651C166.186 19.5403 166.692 20.6827 166.692 22.078C166.692 22.9827 166.455 23.8337 165.979 24.631C165.504 25.413 164.776 26.0493 163.794 26.54C162.813 27.0307 161.556 27.276 160.022 27.276ZM175.612 27.276C174.14 27.276 172.859 26.9693 171.771 26.356C170.697 25.7427 169.869 24.8457 169.287 23.665C168.704 22.4843 168.413 21.0277 168.413 19.295C168.413 17.4397 168.758 15.868 169.448 14.58C170.153 13.292 171.119 12.3107 172.346 11.636C173.588 10.9613 175.014 10.624 176.624 10.624C177.482 10.624 178.303 10.716 179.085 10.9C179.867 11.084 180.541 11.36 181.109 11.728L179.729 14.465C179.284 14.1583 178.809 13.9513 178.303 13.844C177.797 13.7213 177.268 13.66 176.716 13.66C175.32 13.66 174.216 14.0817 173.404 14.925C172.591 15.7683 172.185 17.018 172.185 18.674C172.185 18.95 172.185 19.2567 172.185 19.594C172.2 19.9313 172.246 20.2687 172.323 20.606L171.288 19.64C171.579 19.042 171.955 18.5437 172.415 18.145C172.875 17.731 173.419 17.4243 174.048 17.225C174.692 17.0103 175.397 16.903 176.164 16.903C177.206 16.903 178.142 17.11 178.97 17.524C179.798 17.938 180.457 18.5207 180.948 19.272C181.454 20.0233 181.707 20.905 181.707 21.917C181.707 23.0057 181.431 23.9563 180.879 24.769C180.342 25.5663 179.614 26.1873 178.694 26.632C177.789 27.0613 176.762 27.276 175.612 27.276ZM175.405 24.493C175.926 24.493 176.386 24.401 176.785 24.217C177.199 24.0177 177.521 23.734 177.751 23.366C177.981 22.998 178.096 22.5763 178.096 22.101C178.096 21.365 177.843 20.7823 177.337 20.353C176.846 19.9083 176.187 19.686 175.359 19.686C174.807 19.686 174.324 19.7933 173.91 20.008C173.496 20.2073 173.166 20.491 172.921 20.859C172.691 21.2117 172.576 21.6257 172.576 22.101C172.576 22.561 172.691 22.975 172.921 23.343C173.151 23.6957 173.473 23.9793 173.887 24.194C174.301 24.3933 174.807 24.493 175.405 24.493ZM189.957 27.276C188.638 27.276 187.458 26.954 186.415 26.31C185.372 25.6507 184.552 24.7 183.954 23.458C183.356 22.216 183.057 20.7133 183.057 18.95C183.057 17.1867 183.356 15.684 183.954 14.442C184.552 13.2 185.372 12.257 186.415 11.613C187.458 10.9537 188.638 10.624 189.957 10.624C191.291 10.624 192.472 10.9537 193.499 11.613C194.542 12.257 195.362 13.2 195.96 14.442C196.558 15.684 196.857 17.1867 196.857 18.95C196.857 20.7133 196.558 22.216 195.96 23.458C195.362 24.7 194.542 25.6507 193.499 26.31C192.472 26.954 191.291 27.276 189.957 27.276ZM189.957 24.125C190.586 24.125 191.13 23.9487 191.59 23.596C192.065 23.2433 192.433 22.6837 192.694 21.917C192.97 21.1503 193.108 20.1613 193.108 18.95C193.108 17.7387 192.97 16.7497 192.694 15.983C192.433 15.2163 192.065 14.6567 191.59 14.304C191.13 13.9513 190.586 13.775 189.957 13.775C189.344 13.775 188.799 13.9513 188.324 14.304C187.864 14.6567 187.496 15.2163 187.22 15.983C186.959 16.7497 186.829 17.7387 186.829 18.95C186.829 20.1613 186.959 21.1503 187.22 21.917C187.496 22.6837 187.864 23.2433 188.324 23.596C188.799 23.9487 189.344 24.125 189.957 24.125Z" fill="#12B76A"/>
                </svg>
            </Link>
          </div>
          <div className="mt-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Not everything needs to be owned.
            </h2>
            <p className="text-sm md:text-base text-[#FFFFFF]/65 max-w-sm">
              Access what you need, when you need it without the cost of ownership. From heavy equipment to everyday tools, Rentam360 makes renting simple, affordable, and sustainable.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[#424647]/80" /> {/* dark overlay */}
      </div>

      {/* Right form section */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 md:px-20">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-8 text-center">Welcome back David</h2>

          {loginError && (
            <div className="bg-[#F044380A] border border-[#F044383D] text-[#F04438] px-4 py-4 rounded mb-6 text-sm">
              {loginError}
            </div>
          )}

          <form className="space-y-4 text-right" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className={`w-full border rounded px-4 py-2 focus:outline-none ${
                  errors.email
                    ? 'border-[#F044383D] bg-[#F044380A] focus:ring-red-500'
                    : 'focus:ring-primary'
                }`}
                required
              />
              {errors.email && (
                <p className="text-[#F04438] text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <a href="#" className="text-sm text-right text-primary ml-2 whitespace-nowrap">Forgot password</a>
            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className={`w-full border block rounded px-4 py-2 focus:outline-none ${
                  errors.password
                    ? 'border-[#F044383D] bg-[#F044380A] focus:ring-red-500'
                    : 'focus:ring-primary'
                }`}
                required
              />
              {errors.password && (
                <p className="text-[#F04438] text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary mt-8 cursor-pointer text-white rounded-full py-3 font-semibold hover:bg-green-600 transition"
            >
              {isSubmitting ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <a href="/signup" className="text-primary font-medium">Sign up</a>
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 border rounded px-4 py-2 w-full justify-center">
              <Image src="/google-play-badge.svg" alt="Google" width={20} height={20} />
              <span>Google</span>
            </button>
            <button className="flex items-center gap-2 border rounded px-4 py-2 w-full justify-center">
              <Image src="/app-store-badge.svg" alt="Apple" width={20} height={20} />
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
