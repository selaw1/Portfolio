# Image Assets Guide for Portfolio Website

## 📁 Image Directory Structure

All images should be placed in the `app/public/` directory. Images in this folder are directly accessible from the root URL.

```
app/
└── public/
    ├── favicon.ico                    # Browser tab icon (16x16, 32x32)
    ├── logo.svg                       # Optional: Your personal logo
    ├── og-image.jpg                   # Social media preview (1200x630)
    ├── Yousef_Resume.pdf              # Your resume PDF
    │
    ├── projects/                      # Project screenshots
    │   ├── minbur-hero.jpg
    │   ├── minbur-dashboard.jpg
    │   ├── harakti-hero.jpg
    │   └── harakti-dashboard.jpg
    │
    └── profile/                       # Personal photos
        ├── avatar.jpg                 # For About section
        └── hero-photo.jpg             # Optional: For Hero section
```

---

## 🎨 Recommended Image Specifications

### 1. **Project Images**
Location: `app/public/projects/`

| Type | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| Hero/Thumbnail | 1200×800px | JPG/WebP | Main project card image |
| Dashboard/UI | 1920×1080px | JPG/WebP | Detailed project screenshots |
| Mobile Preview | 375×812px | PNG/WebP | Mobile app screenshots |

**Optimization:**
- Use **WebP format** for better performance (50-80% smaller than JPG)
- Compress images to < 200KB each
- Use tools: [Squoosh](https://squoosh.app/), [TinyPNG](https://tinypng.com/)

### 2. **Personal Photos**
Location: `app/public/profile/`

| Type | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| Avatar | 400×400px | JPG/WebP | About section, profile picture |
| Hero Photo | 800×800px | JPG/WebP | Optional hero background |

### 3. **Branding Assets**
Location: `app/public/`

| Type | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| Favicon | 32×32px | ICO/PNG | Browser tab icon |
| OG Image | 1200×630px | JPG | Social media preview (LinkedIn, Twitter) |
| Logo | Scalable | SVG | Navigation, footer |

---

## 📝 How to Use Images in Your Code

### Projects Section
Update the project image paths in [`app/src/sections/Projects.tsx`](app/src/sections/Projects.tsx):

```tsx
const projects = [
  {
    title: 'Minbur',
    description: '...',
    image: '/projects/minbur-hero.jpg',  // ✅ Add image path
    tech: ['Next.js', 'Django Ninja', ...],
    links: { ... }
  },
  {
    title: 'Harakti',
    description: '...',
    image: '/projects/harakti-hero.jpg',  // ✅ Already set
    tech: [...],
    links: { ... }
  },
];
```

### About Section (Optional)
If you want to add a profile photo to [`app/src/sections/About.tsx`](app/src/sections/About.tsx):

```tsx
// Add this inside the bio section
<div className="max-w-3xl mx-auto">
  <div className="flex items-center gap-8 mb-8">
    <img 
      src="/profile/avatar.jpg" 
      alt="Yousef Selawi"
      className="w-32 h-32 rounded-2xl object-cover shadow-lg"
    />
    <div className="flex-1 glass-card p-8 rounded-2xl">
      <p className="text-lg text-muted-foreground leading-relaxed">
        I'm a Software Engineer with 4+ years of experience...
      </p>
    </div>
  </div>
</div>
```

### Hero Section (Optional Background)
For a subtle hero background in [`app/src/sections/Hero.tsx`](app/src/sections/Hero.tsx):

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 opacity-10">
    <img 
      src="/profile/hero-photo.jpg" 
      alt="" 
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Rest of hero content */}
</section>
```

---

## 🚀 Image Optimization Best Practices

### 1. **Use WebP Format**
Convert JPG/PNG to WebP for 50-80% smaller file sizes:

```bash
# Install cwebp (if not installed)
brew install webp  # macOS
sudo apt install webp  # Linux

# Convert images
cwebp -q 80 input.jpg -o output.webp
```

### 2. **Lazy Loading**
Images below the fold are automatically lazy-loaded with `loading="lazy"`:

```tsx
<img 
  src="/projects/minbur-hero.jpg" 
  alt="Minbur Project"
  loading="lazy"  // ✅ Browser automatically lazy loads
  className="w-full h-full object-cover"
/>
```

### 3. **Responsive Images**
For different screen sizes, use `srcset`:

```tsx
<img 
  src="/projects/minbur-hero.jpg"
  srcset="
    /projects/minbur-hero-small.jpg 600w,
    /projects/minbur-hero-medium.jpg 1200w,
    /projects/minbur-hero-large.jpg 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Minbur Project"
/>
```

---

## 🎯 Quick Setup Checklist

- [ ] **Create directories:**
  ```bash
  mkdir -p app/public/projects app/public/profile
  ```

- [ ] **Add project images:**
  - `app/public/projects/minbur-hero.jpg`
  - `app/public/projects/harakti-hero.jpg`

- [ ] **Add personal photos (optional):**
  - `app/public/profile/avatar.jpg`

- [ ] **Add branding assets:**
  - `app/public/favicon.ico`
  - `app/public/og-image.jpg` (for social sharing)

- [ ] **Add resume:**
  - `app/public/Yousef_Resume.pdf` (already exists)

- [ ] **Optimize all images:**
  - Compress to < 200KB each
  - Convert to WebP format
  - Verify image paths in code

---

## 🔗 Image Path Reference

| File Location | URL Path | Example |
|--------------|----------|---------|
| `app/public/image.jpg` | `/image.jpg` | `<img src="/image.jpg" />` |
| `app/public/projects/app.jpg` | `/projects/app.jpg` | `<img src="/projects/app.jpg" />` |
| `app/public/profile/avatar.jpg` | `/profile/avatar.jpg` | `<img src="/profile/avatar.jpg" />` |

**Important:** All paths start with `/` because `public/` is the root directory.

---

## 🛠️ Tools & Resources

### Image Optimization
- [Squoosh.app](https://squoosh.app/) — Browser-based image compression
- [TinyPNG](https://tinypng.com/) — PNG/JPG compression
- [Cloudinary](https://cloudinary.com/) — Image CDN with automatic optimization

### Stock Photos (if needed)
- [Unsplash](https://unsplash.com/) — Free high-quality photos
- [Pexels](https://www.pexels.com/) — Free stock photos & videos

### Design Tools
- [Figma](https://www.figma.com/) — UI mockups & screenshots
- [Canva](https://www.canva.com/) — Social media images (OG images)

---

## 📌 Current Image Status

### Projects Section
- **Minbur:** ❌ No image (currently shows Terminal icon fallback)
  - Add: `app/public/projects/minbur-hero.jpg`
  - Update path in `Projects.tsx`: `image: '/projects/minbur-hero.jpg'`

- **Harakti:** ✅ Image path set (`/harakti.jpg`)
  - Current: `app/public/harakti.jpg`
  - Recommended: Move to `app/public/projects/harakti-hero.jpg` for better organization

### Hero Section
- Currently using animated grid background (no image needed)
- Optional: Add subtle background photo

### About Section
- Currently text-based (no image)
- Optional: Add profile photo

---

## 🎨 Design System Colors (for image editing)

If you're creating graphics or mockups, use these brand colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0070a0` | Main brand color, buttons, accents |
| Accent | `#1b9cca` | Hover states, highlights |
| Dark | `#1f1f1f` | Dark mode background |
| Light | `#f7f9fa` | Light mode background |

---

## ✅ Testing Images

After adding images, verify:

1. **Image loads correctly:**
   - Open browser DevTools → Network tab
   - Check image HTTP status is `200`

2. **Performance:**
   - Run Lighthouse audit
   - Ensure images are < 200KB
   - Check for layout shifts (CLS score)

3. **Accessibility:**
   - All images have descriptive `alt` text
   - Decorative images use `alt=""`

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Image not loading** | Check path starts with `/` (e.g., `/projects/image.jpg`) |
| **Slow loading** | Compress images, convert to WebP format |
| **Layout shift** | Add `width` and `height` attributes or use `aspect-ratio` in CSS |
| **Blurry on Retina screens** | Use 2× resolution images (e.g., 2400×1600 for 1200×800 display) |

---

## 📧 Need Help?

If you encounter any issues with images or need help optimizing them, refer to:
- [Vite Static Assets Guide](https://vitejs.dev/guide/assets.html)
- [React Image Best Practices](https://react.dev/learn/adding-interactivity#rendering-lists)
- [WebP Conversion Guide](https://developers.google.com/speed/webp)

---

**Last Updated:** May 1, 2026
