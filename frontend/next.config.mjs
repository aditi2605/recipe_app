/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
     images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',  
            },
            {
                protocol: 'https',
                hostname: 'bitecultstorage.blob.core.windows.net',
                pathname: '/uploads/**'
            },
        ],
    },
    
};

export default nextConfig;
