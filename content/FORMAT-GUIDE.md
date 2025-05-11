# Image Formatting Quick Reference Guide

This guide provides code snippets for various image formatting options you can use in your content markdown files. Simply copy and paste these examples, then customize them for your needs.

## Table of Contents
- [Basic Image](#basic-image)
- [Image with Custom Styling](#image-with-custom-styling)
- [Image with Caption](#image-with-caption)
- [Side-by-Side Images](#side-by-side-images)
- [Image Gallery](#image-gallery)
- [Text with Image Wrap](#text-with-image-wrap)
- [Image Cards](#image-cards)
- [Important Notes](#important-notes)

## Basic Image

The simplest way to add an image:

```markdown
![Alt text for the image](https://example.com/path/to/image.jpg)
```

## Image with Custom Styling

For more control over appearance:

```html
<img 
  src="https://example.com/path/to/image.jpg" 
  alt="Descriptive alt text"
  style="width: 100%; max-width: 800px; margin: 20px auto; display: block; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>
```

Common style properties you can adjust:
- `width` - Width of the image (use % for responsive sizing)
- `max-width` - Maximum width the image can reach
- `border-radius` - Rounded corners (8px recommended)
- `box-shadow` - Adds depth (format: horizontal-offset vertical-offset blur-radius spread-radius color)
- `margin` - Space around the image
- `display: block` and `margin: auto` - Centers the image

## Image with Caption

Add context with a caption:

```html
<figure style="margin: 30px 0;">
  <img 
    src="https://example.com/path/to/image.jpg" 
    alt="Descriptive alt text"
    style="width: 100%; border-radius: 8px;"
  />
  <figcaption style="text-align: center; font-style: italic; margin-top: 8px;">
    Your caption text goes here
  </figcaption>
</figure>
```

## Side-by-Side Images

Perfect for before/after comparisons or showing related images:

```html
<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 30px 0;">
  <div style="flex: 1; min-width: 300px;">
    <img 
      src="https://example.com/path/to/image1.jpg" 
      alt="First image description"
      style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;"
    />
    <p style="text-align: center; font-weight: bold; margin-top: 8px;">First Image Caption</p>
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img 
      src="https://example.com/path/to/image2.jpg" 
      alt="Second image description"
      style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;"
    />
    <p style="text-align: center; font-weight: bold; margin-top: 8px;">Second Image Caption</p>
  </div>
</div>
```

Parameters to adjust:
- `gap` - Space between images
- `min-width` - Minimum width before images stack vertically
- `height` - Fixed height for consistent appearance
- `object-fit: cover` - Makes images fill their container while maintaining aspect ratio

## Image Gallery

Display multiple images in a grid:

```html
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin: 30px 0;">
  <img src="https://example.com/path/to/image1.jpg" alt="Gallery image 1" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://example.com/path/to/image2.jpg" alt="Gallery image 2" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://example.com/path/to/image3.jpg" alt="Gallery image 3" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://example.com/path/to/image4.jpg" alt="Gallery image 4" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
</div>
```

Parameters to adjust:
- `minmax(200px, 1fr)` - Minimum size of each gallery item (200px) and maximum (1 fraction of available space)
- `height` - Consistent height for all gallery images

## Text with Image Wrap

Create a magazine-style layout with text wrapping around an image:

```html
<div style="margin: 30px 0;">
  <img 
    src="https://example.com/path/to/image.jpg" 
    alt="Image description"
    style="float: right; width: 300px; margin: 0 0 20px 20px; border-radius: 8px;"
  />
  <p>Your text here will wrap around the image. Write several paragraphs to demonstrate the wrapping effect.</p>
  
  <p>Second paragraph continues the text flow. The text will continue to wrap around the image until it extends beyond the height of the image.</p>
  
  <p>Third paragraph might extend below the image, depending on how much text you have and the image dimensions.</p>
  
  <div style="clear: both;"></div>
</div>
```

Important parameters:
- `float: right` or `float: left` - Determines which side the image appears on
- `margin: 0 0 20px 20px` - Format is top right bottom left (add space between image and text)
- `clear: both` - Required at the end to ensure content after this section doesn't wrap

## Image Cards

Create card-style layouts for locations or features:

```html
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin: 30px 0;">
  <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <img src="https://example.com/path/to/image1.jpg" alt="Card image 1" style="width: 100%; height: 180px; object-fit: cover;" />
    <div style="padding: 12px;">
      <h4 style="margin-top: 0;">Card Title</h4>
      <p>Card description or details go here.</p>
    </div>
  </div>
  <!-- Repeat the above div for additional cards -->
</div>
```

## Content with Image + Info Side by Side

Great for location details with image:

```html
<div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0;">
  <img 
    src="https://example.com/path/to/image.jpg" 
    alt="Location image"
    style="flex: 1; min-width: 300px; border-radius: 8px; object-fit: cover; max-height: 350px;"
  />
  <div style="flex: 1; min-width: 300px;">
    <h4>Location Name</h4>
    <p>Description of the location and its significance.</p>
    
    <h5>Visitor Information</h5>
    <ul>
      <li><strong>Address:</strong> Full address</li>
      <li><strong>Hours:</strong> Opening hours</li>
      <li><strong>Admission:</strong> Cost details</li>
    </ul>
  </div>
</div>
```

## Important Notes

1. **Image URLs:**
   - Use absolute URLs (starting with https://)
   - Make sure images are properly licensed for use
   - Optimize images for web before uploading (aim for <500KB per image)

2. **Responsive Design:**
   - Always use percentage widths (%) instead of fixed pixels for the outer width
   - Set a reasonable `max-width` to prevent images from becoming too large
   - Use `min-width` with flex layouts to control when items stack vertically
   - Always include `alt` text for accessibility and SEO

3. **Best Practices:**
   - Keep file sizes small (use .jpg for photos, .png for graphics with transparency)
   - Maintain consistent styling across your content
   - Use the same height for side-by-side images to keep them aligned
   - Add proper attribution for images when required

4. **Testing:**
   - Check how your layouts appear on both desktop and mobile devices
   - Verify that images load correctly after publishing

For more examples, please refer to the example content files or reach out to the content team. 