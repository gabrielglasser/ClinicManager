import type { NextConfig } from "next";

const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};


const nextConfig: NextConfig = {
 
};

export default nextConfig;
