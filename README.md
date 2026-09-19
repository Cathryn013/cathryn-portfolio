# Bright Minds - Resources for Amazing Teachers

A 5-page static website (Home, Resources, About, Blog, Contact) built to match the
"Bright Minds" mockup, with two Canva video presentations embedded on the About page.

## Files

```
index.html        Home page
resources.html    Resource library (with filter + search)
about.html        About + Meet the Creator + embedded Canva videos
blog.html         Blog listing
contact.html      Contact page with a form
css/style.css     All styling
js/script.js      Mobile nav, filters, search, contact form handling
```

No build step or server is required, it's plain HTML/CSS/JS, so it works as-is on
GitHub Pages.

## Hosting it on GitHub Pages

1. **Create a repository.** On github.com, click "New repository." Name it whatever
   you like (e.g. `bright-minds`). Public repos get free GitHub Pages hosting.
2. **Upload these files.** Easiest way: on the new repo's page, click
   "uploading an existing file" and drag in everything from this folder
   (`index.html`, `resources.html`, `about.html`, `blog.html`, `contact.html`,
   the `css` folder, and the `js` folder), keeping the same folder structure.
   Commit the files.
   - Or, if you use Git locally:
     ```
     git init
     git add .
     git commit -m "Initial site"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git push -u origin main
     ```
3. **Turn on Pages.** In the repo, go to Settings → Pages. Under "Build and
   deployment," set Source to "Deploy from a branch," Branch to `main` and
   folder to `/ (root)`. Save.
4. **Visit your site.** After a minute or two, GitHub will show a URL like
   `https://<your-username>.github.io/<repo-name>/`. That's your live site.

Any time you want to update the site, edit the files and push/upload the changes.
GitHub Pages rebuilds automatically within a minute or so.

## Connecting the contact form

GitHub Pages only serves static files, so the contact form on `contact.html` can't
send email on its own yet. The simplest fix is a free service like
[Formspree](https://formspree.io):

1. Create a free Formspree account and a new form.
2. Copy the endpoint it gives you (looks like `https://formspree.io/f/abcd1234`).
3. In `contact.html`, find this line near the bottom:
   ```html
   <form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
   ```
   and replace `your-form-id` with your real endpoint.

Until you do this, the form will still work visually (it shows a friendly "thanks!"
message via `js/script.js`), it just won't deliver anywhere.

## Customizing

- **Colors & fonts:** all defined as CSS variables at the top of `css/style.css`
  (`:root { ... }`), change them once and they update across every page.
- **Videos:** the two Canva embeds live in `about.html` inside `.video-embed` blocks.
  To swap or add presentations, copy that block and update the `src` and credit link.
- **Resource/blog cards:** each is a simple repeated HTML block in `resources.html`
  and `blog.html`, copy/paste a `<div class="card">...</div>` to add more.
