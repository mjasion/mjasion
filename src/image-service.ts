import type { LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';
import sharp from 'sharp';

/**
 * Custom image service that extends Astro's Sharp service to rasterize SVGs.
 * When format="webp" (or png/avif) is requested for an SVG input,
 * Sharp converts the SVG to the requested raster format at build time.
 */
const service: LocalImageService = {
  getURL: sharpService.getURL,
  parseURL: sharpService.parseURL,
  getHTMLAttributes: sharpService.getHTMLAttributes,

  async transform(inputBuffer, transform, config) {
    const header = new TextDecoder().decode(inputBuffer.slice(0, 200));
    const isSvg = header.includes('<svg') || header.includes('<?xml');
    const wantsRaster = transform.format && transform.format !== 'svg';

    if (isSvg && wantsRaster) {
      let pipeline = sharp(Buffer.from(inputBuffer));

      if (transform.width || transform.height) {
        pipeline = pipeline.resize(transform.width || undefined, transform.height || undefined);
      }

      const quality = typeof transform.quality === 'number' ? transform.quality : 80;

      switch (transform.format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'png':
          pipeline = pipeline.png();
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          break;
        case 'jpeg':
        case 'jpg':
          pipeline = pipeline.jpeg({ quality });
          break;
      }

      const data = await pipeline.toBuffer();
      return { data: new Uint8Array(data), format: transform.format };
    }

    return sharpService.transform(inputBuffer, transform, config);
  },
};

export default service;
