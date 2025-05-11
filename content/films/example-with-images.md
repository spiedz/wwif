---
title: How To Add Images In Film Pages
description: A demonstration of image embedding techniques for content creators on Where Was It Filmed.
slug: example-with-images
date: '2023-12-15'
year: '2023'
director: Content Team
genre:
  - Tutorial
  - Guide
posterImage: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg'
coordinates:
  - lat: 34.0522
    lng: -118.2437
    name: 'Los Angeles, California'
    description: 'Example location demonstrating image capabilities.'
---

# Image Embedding Tutorial

This guide shows how to effectively use images in your film location articles. Images help visitors recognize filming locations and compare them to scenes from the movies.

## Basic Image Embedding

The simplest way to add an image is using markdown syntax:

![Hollywood Sign](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg/1280px-Hollywood_Sign_%28Zuschnitt%29.jpg)

Just add an exclamation mark, followed by alt text in square brackets, and the image URL in parentheses.

## Image with Custom Styling

For more control over the appearance, you can use HTML syntax:

<img 
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/1280px-Above_Gotham.jpg" 
  alt="New York City Skyline"
  style="width: 100%; max-width: 800px; margin: 20px auto; display: block; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
/>

This gives you control over size, margins, and visual effects.

## Images with Captions

Adding captions helps provide context to your images:

<figure style="margin: 30px 0;">
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Griffith_observatory_2006.jpg/1280px-Griffith_observatory_2006.jpg" 
    alt="Griffith Observatory"
    style="width: 100%; border-radius: 8px;"
  />
  <figcaption style="text-align: center; font-style: italic; margin-top: 8px;">
    Griffith Observatory, featured in films like La La Land and Rebel Without a Cause
  </figcaption>
</figure>

## Before and After Comparison

Show how a location appears in the film versus real life:

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 30px 0;">
  <div style="flex: 1; min-width: 300px;">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Hobbiton_Movie_Set_03.jpg/1280px-Hobbiton_Movie_Set_03.jpg" 
      alt="Hobbiton Movie Set"
      style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;"
    />
    <p style="text-align: center; font-weight: bold; margin-top: 8px;">Hobbiton Movie Set</p>
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Matamata%2C_New_Zealand_%288201033945%29.jpg/1280px-Matamata%2C_New_Zealand_%288201033945%29.jpg" 
      alt="Matamata, New Zealand"
      style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px;"
    />
    <p style="text-align: center; font-weight: bold; margin-top: 8px;">Matamata, New Zealand (Location)</p>
  </div>
</div>

## Image Gallery

Display multiple related images in a row:

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin: 30px 0;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Universal_Studios_Hollywood_-_panoramio.jpg/1280px-Universal_Studios_Hollywood_-_panoramio.jpg" alt="Universal Studios" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Warner_Bros_Studios_Leavesden_entrance.jpg/1280px-Warner_Bros_Studios_Leavesden_entrance.jpg" alt="Warner Bros Studios" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Paramount_Pictures_Gate.jpg/1280px-Paramount_Pictures_Gate.jpg" alt="Paramount Pictures" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pinewood_Studios_-_panoramio.jpg/1280px-Pinewood_Studios_-_panoramio.jpg" alt="Pinewood Studios" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
</div>

## Image with Text Wrap

For a magazine-style layout, wrap text around images:

<div style="margin: 30px 0;">
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Los_angeles_from_the_griffith_observatory.jpg/1280px-Los_angeles_from_the_griffith_observatory.jpg" 
    alt="LA Skyline from Griffith Observatory"
    style="float: right; width: 300px; margin: 0 0 20px 20px; border-radius: 8px;"
  />
  <p>Los Angeles has been the setting for countless iconic films throughout Hollywood's history. From the gritty streets featured in crime dramas to the glamorous hills and beaches seen in romantic comedies, the city's diverse landscapes offer filmmakers an endless variety of backdrops.</p>
  <p>Griffith Observatory, shown in the image, has featured prominently in films like "La La Land" (2016), "Rebel Without a Cause" (1955), and "The Terminator" (1984). Its distinctive architecture and spectacular views of the Los Angeles basin make it an instantly recognizable location for movie fans worldwide.</p>
  <p>Visitors to the observatory can stand in the exact spots where famous scenes were filmed while also enjoying the educational exhibits inside the building. The observatory is open to the public and offers free admission to its grounds and main exhibit areas.</p>
  <div style="clear: both;"></div>
</div>

## Adding Maps and Location Context

When describing a specific filming location, combine images with location details:

<div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 12px;">
  <h3>Central Park, New York</h3>
  <div style="display: flex; flex-wrap: wrap; gap: 20px;">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Central_Park_from_helicopter.jpg/1280px-Central_Park_from_helicopter.jpg" 
      alt="Central Park Aerial View"
      style="flex: 1; min-width: 300px; border-radius: 8px; max-height: 300px; object-fit: cover;"
    />
    <div style="flex: 1; min-width: 300px;">
      <p><strong>Featured In:</strong> Home Alone 2, When Harry Met Sally, Enchanted</p>
      <p><strong>Address:</strong> Central Park, New York, NY</p>
      <p><strong>Visitor Info:</strong> Open daily 6am to 1am, free admission</p>
      <p><strong>Best Photo Spot:</strong> Bow Bridge and Bethesda Fountain</p>
      <p>This 843-acre urban park has appeared in over 350 films, making it one of the most filmed locations in the world. The famous Mall and Bethesda Terrace are particularly popular filming spots.</p>
    </div>
  </div>
</div>

## Final Tips for Content Creators

1. **Use high-quality images** - Aim for at least 1200px wide for good display quality
2. **Optimize file sizes** - Large images can slow down page loading
3. **Always include alt text** - This helps with accessibility and SEO
4. **Be consistent with styling** - Use similar image sizes and styles throughout
5. **Add context with captions** - Help readers understand what they're seeing
6. **Credit sources** - Always provide attribution for images when required

For more guidance, refer to the [Content Creation Guide](/README.md) in the repository. 