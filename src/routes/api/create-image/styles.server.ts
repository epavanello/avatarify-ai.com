import type { Styles } from './styles';

export default [
  {
    name: '3D Model',
    prompt:
      'professional 3d model {prompt} . octane render, highly detailed, volumetric, dramatic lighting',
    negative_prompt: 'ugly, deformed, noisy, low poly, blurry, painting'
  },
  {
    name: 'Analog Film',
    prompt:
      'analog film photo {prompt} . faded film, desaturated, 35mm photo, grainy, vignette, vintage, Kodachrome, Lomography, stained, highly detailed, found footage',
    negative_prompt:
      'painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured'
  },
  {
    name: 'Anime',
    prompt:
      'anime artwork {prompt} . anime style, key visual, vibrant, studio anime,  highly detailed',
    negative_prompt: 'photo, deformed, black and white, realism, disfigured, low contrast'
  },
  {
    name: 'Cinematic',
    prompt:
      'cinematic film still {prompt} . shallow depth of field, vignette, highly detailed, high budget, bokeh, cinemascope, moody, epic, gorgeous, film grain, grainy',
    negative_prompt:
      'anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured'
  },
  {
    name: 'Comic Book',
    prompt:
      'comic {prompt} . graphic illustration, comic art, graphic novel art, vibrant, highly detailed',
    negative_prompt: 'photograph, deformed, glitch, noisy, realistic, stock photo'
  },
  {
    name: 'Craft Clay',
    prompt: 'play-doh style {prompt} . sculpture, clay art, centered composition, Claymation',
    negative_prompt: 'sloppy, messy, grainy, highly detailed, ultra textured, photo'
  },
  {
    name: 'Digital Art',
    prompt:
      'concept art {prompt} . digital artwork, illustrative, painterly, matte painting, highly detailed',
    negative_prompt: 'photo, photorealistic, realism, ugly'
  },
  {
    name: 'Enhance',
    prompt: 'breathtaking {prompt} . award-winning, professional, highly detailed',
    negative_prompt: 'ugly, deformed, noisy, blurry, distorted, grainy'
  },
  {
    name: 'Fantasy Art',
    prompt:
      'ethereal fantasy concept art of  {prompt} . magnificent, celestial, ethereal, painterly, epic, majestic, magical, fantasy art, cover art, dreamy',
    negative_prompt:
      'photographic, realistic, realism, 35mm film, dslr, cropped, frame, text, deformed, glitch, noise, noisy, off-center, deformed, cross-eyed, closed eyes, bad anatomy, ugly, disfigured, sloppy, duplicate, mutated, black and white'
  },
  {
    name: 'Isometric Style',
    prompt:
      'isometric style {prompt} . vibrant, beautiful, crisp, detailed, ultra detailed, intricate',
    negative_prompt:
      'deformed, mutated, ugly, disfigured, blur, blurry, noise, noisy, realistic, photographic'
  },
  {
    name: 'Line Art',
    prompt:
      'line art drawing {prompt} . professional, sleek, modern, minimalist, graphic, line art, vector graphics',
    negative_prompt:
      'anime, photorealistic, 35mm film, deformed, glitch, blurry, noisy, off-center, deformed, cross-eyed, closed eyes, bad anatomy, ugly, disfigured, mutated, realism, realistic, impressionism, expressionism, oil, acrylic'
  },
  {
    name: 'Lowpoly',
    prompt:
      'low-poly style {prompt} . low-poly game art, polygon mesh, jagged, blocky, wireframe edges, centered composition',
    negative_prompt: 'noisy, sloppy, messy, grainy, highly detailed, ultra textured, photo'
  },
  {
    name: 'Neon Punk',
    prompt:
      'neonpunk style {prompt} . cyberpunk, vaporwave, neon, vibes, vibrant, stunningly beautiful, crisp, detailed, sleek, ultramodern, magenta highlights, dark purple shadows, high contrast, cinematic, ultra detailed, intricate, professional',
    negative_prompt:
      'painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured'
  },
  {
    name: 'Origami',
    prompt:
      'origami style {prompt} . paper art, pleated paper, folded, origami art, pleats, cut and fold, centered composition',
    negative_prompt: 'noisy, sloppy, messy, grainy, highly detailed, ultra textured, photo'
  },
  {
    name: 'Photographic',
    prompt:
      'cinematic photo {prompt} . 35mm photograph, film, bokeh, professional, 4k, highly detailed',
    negative_prompt:
      'drawing, painting, crayon, sketch, graphite, impressionist, noisy, blurry, soft, deformed, ugly'
  },
  {
    name: 'Pixel Art',
    prompt: 'pixel-art {prompt} . low-res, blocky, pixel art style, 8-bit graphics',
    negative_prompt:
      'sloppy, messy, blurry, noisy, highly detailed, ultra textured, photo, realistic'
  },
  {
    name: 'Texture',
    prompt: 'texture {prompt} top down close-up',
    negative_prompt: 'ugly, deformed, noisy, blurry'
  },
  {
    name: 'Advertising',
    prompt:
      'Advertising poster style {prompt} . Professional, modern, product-focused, commercial, eye-catching, highly detailed',
    negative_prompt: 'noisy, blurry, amateurish, sloppy, unattractive'
  },
  {
    name: 'Food Photography',
    prompt:
      'Food photography style {prompt} . Appetizing, professional, culinary, high-resolution, commercial, highly detailed',
    negative_prompt: 'unappetizing, sloppy, unprofessional, noisy, blurry'
  },
  {
    name: 'Real Estate',
    prompt:
      'Real estate photography style {prompt} . Professional, inviting, well-lit, high-resolution, property-focused, commercial, highly detailed',
    negative_prompt: 'dark, blurry, unappealing, noisy, unprofessional'
  },
  {
    name: 'Abstract',
    prompt:
      'Abstract style {prompt} . Non-representational, colors and shapes, expression of feelings, imaginative, highly detailed',
    negative_prompt: 'realistic, photographic, figurative, concrete'
  },
  {
    name: 'Cubist',
    prompt: 'Cubist artwork {prompt} . Geometric shapes, abstract, innovative, revolutionary',
    negative_prompt: 'anime, photorealistic, 35mm film, deformed, glitch, low contrast, noisy'
  },
  {
    name: 'Graffiti',
    prompt: 'Graffiti style {prompt} . Street art, vibrant, urban, detailed, tag, mural',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic'
  },
  {
    name: 'Hyperrealism',
    prompt:
      'Hyperrealistic art {prompt} . Extremely high-resolution details, photographic, realism pushed to extreme, fine texture, incredibly lifelike',
    negative_prompt: 'simplified, abstract, unrealistic, impressionistic, low resolution'
  },
  {
    name: 'Impressionist',
    prompt:
      'Impressionist painting {prompt} . Loose brushwork, vibrant color, light and shadow play, captures feeling over form',
    negative_prompt: 'anime, photorealistic, 35mm film, deformed, glitch, low contrast, noisy'
  },
  {
    name: 'Pointillism',
    prompt:
      'Pointillism style {prompt} . Composed entirely of small, distinct dots of color, vibrant, highly detailed',
    negative_prompt: 'line drawing, smooth shading, large color fields, simplistic'
  },
  {
    name: 'Pop Art',
    prompt:
      'Pop Art style {prompt} . Bright colors, bold outlines, popular culture themes, ironic or kitsch',
    negative_prompt:
      'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic, minimalist'
  },
  {
    name: 'Psychedelic',
    prompt:
      'Psychedelic style {prompt} . Vibrant colors, swirling patterns, abstract forms, surreal, trippy',
    negative_prompt:
      'monochrome, black and white, low contrast, realistic, photorealistic, plain, simple'
  },
  {
    name: 'Renaissance',
    prompt:
      'Renaissance style {prompt} . Realistic, perspective, light and shadow, religious or mythological themes, highly detailed',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, modernist, minimalist, abstract'
  },
  {
    name: 'Steampunk',
    prompt:
      'Steampunk style {prompt} . Antique, mechanical, brass and copper tones, gears, intricate, detailed',
    negative_prompt: 'deformed, glitch, noisy, low contrast, anime, photorealistic'
  },
  {
    name: 'Surrealist',
    prompt:
      'Surrealist art {prompt} . Dreamlike, mysterious, provocative, symbolic, intricate, detailed',
    negative_prompt: 'anime, photorealistic, realistic, deformed, glitch, noisy, low contrast'
  },
  {
    name: 'Typography',
    prompt: 'Typographic art {prompt} . Stylized, intricate, detailed, artistic, text-based',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic'
  },
  {
    name: 'Watercolor',
    prompt:
      'Watercolor painting {prompt} . Vibrant, beautiful, painterly, detailed, textural, artistic',
    negative_prompt: 'anime, photorealistic, 35mm film, deformed, glitch, low contrast, noisy'
  },
  {
    name: 'Fighting Game',
    prompt:
      'Fighting game style {prompt} . Dynamic, vibrant, action-packed, detailed character design, reminiscent of fighting video games',
    negative_prompt: 'peaceful, calm, minimalist, photorealistic'
  },
  {
    name: 'GTA',
    prompt:
      'GTA-style artwork {prompt} . Satirical, exaggerated, pop art style, vibrant colors, iconic characters, action-packed',
    negative_prompt:
      'realistic, black and white, low contrast, impressionist, cubist, noisy, blurry, deformed'
  },
  {
    name: 'Super Mario',
    prompt:
      'Super Mario style {prompt} . Vibrant, cute, cartoony, fantasy, playful, reminiscent of Super Mario series',
    negative_prompt: 'realistic, modern, horror, dystopian, violent'
  },
  {
    name: 'Minecraft',
    prompt:
      'Minecraft style {prompt} . Blocky, pixelated, vibrant colors, recognizable characters and objects, game assets',
    negative_prompt: 'smooth, realistic, detailed, photorealistic, noise, blurry, deformed'
  },
  {
    name: 'Pokémon',
    prompt: 'Pokémon style {prompt} . Vibrant, cute, anime, fantasy, reminiscent of Pokémon series',
    negative_prompt: 'realistic, modern, horror, dystopian, violent'
  },
  {
    name: 'Retro Arcade',
    prompt:
      'Retro arcade style {prompt} . 8-bit, pixelated, vibrant, classic video game, old school gaming, reminiscent of 80s and 90s arcade games',
    negative_prompt: 'modern, ultra-high resolution, photorealistic, 3D'
  },
  {
    name: 'Retro Game',
    prompt: 'Retro game art {prompt} . 16-bit, vibrant colors, pixelated, nostalgic, charming, fun',
    negative_prompt: 'realistic, photorealistic, 35mm film, deformed, glitch, low contrast, noisy'
  },
  {
    name: 'RPG Fantasy Game',
    prompt:
      'Role-playing game (RPG) style fantasy {prompt} . Detailed, vibrant, immersive, reminiscent of high fantasy RPG games',
    negative_prompt: 'sci-fi, modern, urban, futuristic, low detailed'
  },
  {
    name: 'Strategy Game',
    prompt:
      'Strategy game style {prompt} . Overhead view, detailed map, units, reminiscent of real-time strategy video games',
    negative_prompt: 'first-person view, modern, photorealistic'
  },
  {
    name: 'Street Fighter',
    prompt:
      'Street Fighter style {prompt} . Vibrant, dynamic, arcade, 2D fighting game, highly detailed, reminiscent of Street Fighter series',
    negative_prompt: '3D, realistic, modern, photorealistic, turn-based strategy'
  },
  {
    name: 'Legend of Zelda',
    prompt:
      'Legend of Zelda style {prompt} . Vibrant, fantasy, detailed, epic, heroic, reminiscent of The Legend of Zelda series',
    negative_prompt: 'sci-fi, modern, realistic, horror'
  },
  {
    name: 'Architectural',
    prompt:
      'Architectural style {prompt} . Clean lines, geometric shapes, minimalist, modern, architectural drawing, highly detailed',
    negative_prompt: 'curved lines, ornate, baroque, abstract, grunge'
  },
  {
    name: 'Disco',
    prompt:
      'Disco-themed {prompt} . Vibrant, groovy, retro 70s style, shiny disco balls, neon lights, dance floor, highly detailed',
    negative_prompt: 'minimalist, rustic, monochrome, contemporary, simplistic'
  },
  {
    name: 'Dreamscape',
    prompt: 'Dreamscape {prompt} . Surreal, ethereal, dreamy, mysterious, fantasy, highly detailed',
    negative_prompt: 'realistic, concrete, ordinary, mundane'
  },
  {
    name: 'Dystopian',
    prompt: 'Dystopian style {prompt} . Bleak, post-apocalyptic, somber, dramatic, highly detailed',
    negative_prompt:
      'ugly, deformed, noisy, blurry, low contrast, cheerful, optimistic, vibrant, colorful'
  },
  {
    name: 'Fairy Tale',
    prompt:
      'Fairy tale {prompt} . Magical, fantastical, enchanting, storybook style, highly detailed',
    negative_prompt: 'realistic, modern, ordinary, mundane'
  },
  {
    name: 'Gothic',
    prompt: 'Gothic style {prompt} . Dark, mysterious, haunting, dramatic, ornate, detailed',
    negative_prompt:
      'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic, cheerful, optimistic'
  },
  {
    name: 'Grunge',
    prompt:
      'Grunge style {prompt} . Textured, distressed, vintage, edgy, punk rock vibe, dirty, noisy',
    negative_prompt: 'smooth, clean, minimalist, sleek, modern, photorealistic'
  },
  {
    name: 'Horror',
    prompt:
      'Horror-themed {prompt} . Eerie, unsettling, dark, spooky, suspenseful, grim, highly detailed',
    negative_prompt: 'cheerful, bright, vibrant, light-hearted, cute'
  },
  {
    name: 'Minimalist',
    prompt: 'Minimalist style {prompt} . Simple, clean, uncluttered, modern, elegant',
    negative_prompt: 'ornate, complicated, highly detailed, cluttered, disordered, messy, noisy'
  },
  {
    name: 'Monochrome',
    prompt: 'Monochrome {prompt} . Black and white, contrast, tone, texture, detailed',
    negative_prompt: 'colorful, vibrant, noisy, blurry, deformed'
  },
  {
    name: 'Nautical',
    prompt:
      'Nautical-themed {prompt} . Sea, ocean, ships, maritime, beach, marine life, highly detailed',
    negative_prompt: 'landlocked, desert, mountains, urban, rustic'
  },
  {
    name: 'Space',
    prompt:
      'Space-themed {prompt} . Cosmic, celestial, stars, galaxies, nebulas, planets, science fiction, highly detailed',
    negative_prompt: 'earthly, mundane, ground-based, realism'
  },
  {
    name: 'Stained Glass',
    prompt: 'Stained glass style {prompt} . Vibrant, beautiful, translucent, intricate, detailed',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic'
  },
  {
    name: 'Techwear Fashion',
    prompt:
      'Techwear fashion {prompt} . Futuristic, cyberpunk, urban, tactical, sleek, dark, highly detailed',
    negative_prompt: 'vintage, rural, colorful, low contrast, realism, sketch, watercolor'
  },
  {
    name: 'Tribal',
    prompt:
      'Tribal style {prompt} . Indigenous, ethnic, traditional patterns, bold, natural colors, highly detailed',
    negative_prompt: 'modern, futuristic, minimalist, pastel'
  },
  {
    name: 'Zentangle',
    prompt:
      'Zentangle {prompt} . Intricate, abstract, monochrome, patterns, meditative, highly detailed',
    negative_prompt: 'colorful, representative, simplistic, large fields of color'
  },
  {
    name: 'Collage',
    prompt: 'Collage style {prompt} . Mixed media, layered, textural, detailed, artistic',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic'
  },
  {
    name: 'Flat Papercut',
    prompt:
      'Flat papercut style {prompt} . Silhouette, clean cuts, paper, sharp edges, minimalist, color block',
    negative_prompt: '3D, high detail, noise, grainy, blurry, painting, drawing, photo, disfigured'
  },
  {
    name: 'Kirigami',
    prompt:
      'Kirigami representation of {prompt} . 3D, paper folding, paper cutting, Japanese, intricate, symmetrical, precision, clean lines',
    negative_prompt: 'painting, drawing, 2D, noisy, blurry, deformed'
  },
  {
    name: 'Paper Mache',
    prompt:
      'Paper mache representation of {prompt} . 3D, sculptural, textured, handmade, vibrant, fun',
    negative_prompt: '2D, flat, photo, sketch, digital art, deformed, noisy, blurry'
  },
  {
    name: 'Paper Quilling',
    prompt:
      'Paper quilling art of {prompt} . Intricate, delicate, curling, rolling, shaping, coiling, loops, 3D, dimensional, ornamental',
    negative_prompt: 'photo, painting, drawing, 2D, flat, deformed, noisy, blurry'
  },
  {
    name: 'Papercut Collage',
    prompt:
      'Papercut collage of {prompt} . Mixed media, textured paper, overlapping, asymmetrical, abstract, vibrant',
    negative_prompt: 'photo, 3D, realistic, drawing, painting, high detail, disfigured'
  },
  {
    name: 'Papercut Shadow Box',
    prompt:
      '3D papercut shadow box of {prompt} . Layered, dimensional, depth, silhouette, shadow, papercut, handmade, high contrast',
    negative_prompt: 'painting, drawing, photo, 2D, flat, high detail, blurry, noisy, disfigured'
  },
  {
    name: 'Stacked Papercut',
    prompt:
      'Stacked papercut art of {prompt} . 3D, layered, dimensional, depth, precision cut, stacked layers, papercut, high contrast',
    negative_prompt: '2D, flat, noisy, blurry, painting, drawing, photo, deformed'
  },
  {
    name: 'Thick Layered Papercut',
    prompt:
      'Thick layered papercut art of {prompt} . Deep 3D, volumetric, dimensional, depth, thick paper, high stack, heavy texture, tangible layers',
    negative_prompt:
      '2D, flat, thin paper, low stack, smooth texture, painting, drawing, photo, deformed'
  },
  {
    name: 'Alien',
    prompt:
      'Alien-themed {prompt} . Extraterrestrial, cosmic, otherworldly, mysterious, sci-fi, highly detailed',
    negative_prompt: 'earthly, mundane, common, realistic, simple'
  },
  {
    name: 'Film Noir',
    prompt:
      'Film noir style {prompt} . Monochrome, high contrast, dramatic shadows, 1940s style, mysterious, cinematic',
    negative_prompt:
      'ugly, deformed, noisy, blurry, low contrast, realism, photorealistic, vibrant, colorful'
  },
  {
    name: 'HDR',
    prompt:
      'HDR photo of {prompt} . High dynamic range, vivid, rich details, clear shadows and highlights, realistic, intense, enhanced contrast, highly detailed',
    negative_prompt: 'flat, low contrast, oversaturated, underexposed, overexposed, blurred, noisy'
  },
  {
    name: 'Long Exposure',
    prompt:
      'Long exposure photo of {prompt} . Blurred motion, streaks of light, surreal, dreamy, ghosting effect, highly detailed',
    negative_prompt: 'static, noisy, deformed, shaky, abrupt, flat, low contrast'
  },
  {
    name: 'Neon Noir',
    prompt:
      'Neon noir {prompt} . Cyberpunk, dark, rainy streets, neon signs, high contrast, low light, vibrant, highly detailed',
    negative_prompt: 'bright, sunny, daytime, low contrast, black and white, sketch, watercolor'
  },
  {
    name: 'Silhouette',
    prompt:
      'Silhouette style {prompt} . High contrast, minimalistic, black and white, stark, dramatic',
    negative_prompt: 'ugly, deformed, noisy, blurry, low contrast, color, realism, photorealistic'
  },
  {
    name: 'Tilt-Shift',
    prompt:
      'Tilt-shift photo of {prompt} . Selective focus, miniature effect, blurred background, highly detailed, vibrant, perspective control',
    negative_prompt:
      'blurry, noisy, deformed, flat, low contrast, unrealistic, oversaturated, underexposed'
  }
] as {
  name: Styles;
  prompt: string;
  negative_prompt: string;
}[];
