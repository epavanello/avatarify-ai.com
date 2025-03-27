---
title: 'Building Avatarify AI: A Simple Tool for Creating Custom Avatars'
description: A tool that lets you create custom avatars from a single photo. It's open source, self-hostable, and uses Stable Diffusion under the hood.
date: 2025-03-26
keywords: open source, custom avatars, stable diffusion, self-hostable, replicate, ghibli, anime, avatar, ai, tool
author: emadev01
readingTime: 5 min
---

Hey there! 👋 I'm a solo developer who built [Avatarify AI](https://avatarify-ai.com) - a tool that lets you create custom avatars from a single photo. It's open source, self-hostable, and uses Stable Diffusion under the hood.

## 🚀 The Problem I Wanted to Solve

I was tired of seeing people struggle with complex AI avatar generation tools. Most solutions require:

- Hours of model training
- Multiple photos
- Complex prompt engineering
- Technical knowledge

So I built something simpler: upload one photo, pick a style (or write your own prompt), and get your avatar.

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (with runes) + TailwindCSS + DaisyUI
- **Backend**: Supabase
- **Image Generation**: Stable Diffusion via Replicate
- **Payments**: Stripe
- **Analytics**: Plausible

### 💫 Why Svelte 5?

I built this with Svelte 5 and its new runes system. It's been a game-changer for state management - especially when handling image generation states and user interactions. The code is cleaner and more maintainable than my previous projects.

## 🎯 What It Does

- Upload a photo and generate avatars
- Choose from pre-built styles or write custom prompts
- Get one free generation per day
- Buy more credits if you need them
- Store your generated images
- Self-host the entire thing if you want

## 🔮 What's Next?

I'm working on:

- Video generation (because why not?)
- More style options
- Better mobile experience
- Real-time previews
- Integration with newer models

## 🤝 Want to Help?

As a solo dev, I'd love some help! Here's what you could do:

1. **Add New Styles**: Create and submit new artistic styles
2. **Build Features**: Help with video generation or other new features
3. **Improve UI/UX**: Make the interface better
4. **Write Docs**: Help with documentation or tutorials
5. **Test**: Write tests or report bugs
6. **Sponsor**: Support the project's development

## 💡 Why Open Source?

I believe in open source. While I offer a hosted version with a freemium model, you can:

- Self-host it
- Modify it
- Contribute to it
- Use it to learn

## 🚀 Try It Out

Check out the [GitHub repo](https://github.com/epavanello/avatarify-ai.com) for setup instructions.

## 🤔 Thoughts?

What would make this tool better? Drop a comment or open an issue on GitHub.

## 🙏 Thanks

Shoutout to:

- SvelteKit team
- Supabase
- Replicate
- The open source community

---

_Built with ❤️ by a solo dev who loves making tools that help people._
