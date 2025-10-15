import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
        port: "",
        pathname: "/**",
      },
      
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pantalonesdemezclilla.mx",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "periodicocorreo.com.mx",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shasa.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "myspringfield.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ss849.suburbia.com.mx",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "erivel.mx",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "calvinkleinmx.vteximg.com.br",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
