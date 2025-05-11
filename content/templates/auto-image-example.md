# Auto Image Template Example

This template demonstrates how to use the auto-image feature with SerpAPI for location images.

## Basic Usage

Simply use the special markdown syntax to automatically fetch an image for a location:

![auto-image: Times Square](Famous intersection in New York City)

The syntax follows this pattern:

```markdown
![auto-image: Location Name](Optional description)
```

## With Custom Dimensions

You can specify custom dimensions for your auto-images:

![auto-image: Grand Canyon](Natural wonder in Arizona, width=600, height=400)

The syntax with dimensions:

```markdown
![auto-image: Location Name](Description, width=600, height=400)
```

## Different Layouts

There are several built-in layouts:

### Rounded (Default)

![auto-image: Eiffel Tower](Iconic landmark in Paris, layout=rounded)

### Square

![auto-image: Central Park](Urban park in Manhattan, layout=square)

### Full Width

![auto-image: Golden Gate Bridge](Famous bridge in San Francisco, layout=full-width)

### Card Style

![auto-image: Empire State Building](Art Deco skyscraper in NYC, layout=card)

## Auto-detection from Coordinates

If you include coordinates in your frontmatter, the system will automatically detect location names in your text and add images for them.

For example, when you mention Tokyo Tower in a paragraph, the system can automatically insert an image after that paragraph if "Tokyo Tower" is in your coordinates list.

## How It Works

1. The markdown is processed by the template parser
2. Special auto-image syntax is detected
3. The system checks if there's already an image URL provided for the location
4. If not, it uses SerpAPI to search for an appropriate image
5. The image is displayed with proper formatting and fallbacks

## Configuration

To enable auto-images, set your SerpAPI key in the environment variables:

```
SERPAPI_API_KEY=your_api_key_here
```

You can also configure default image sizes and layouts in your site settings. 