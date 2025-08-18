# Certification Timeline Template

## How to Add New Certifications

You can now edit your certifications directly in the `index.html` file. Here's the template structure:

### For Completed Certifications:

```html
<div class="timeline-item left">  <!-- or "right" for alternating layout -->
    <div class="timeline-dot"></div>
    <div class="timeline-content">
        <div class="status-badge status-completed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/>
            </svg>
            Completed
        </div>
        <h3>Your Certification Title
            <span class="verified-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/>
                </svg>
                Verified
            </span>
        </h3>
        <p>Provider: Your Provider Name</p>
        <div class="links">
            <a href="YOUR_LINK_HERE" target="_blank" rel="noopener">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                View Credential
            </a>
        </div>
    </div>
</div>
```

### For In Progress Certifications:

```html
<div class="timeline-item right">  <!-- or "left" for alternating layout -->
    <div class="timeline-dot"></div>
    <div class="timeline-content">
        <div class="status-badge status-progress">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            In Progress
        </div>
        <h3>Your Course Title</h3>
        <p>Provider: Your Provider Name</p>
        <div class="links">
            <a href="YOUR_LINK_HERE" target="_blank" rel="noopener">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                Course Link
            </a>
        </div>
    </div>
</div>
```

## Key Points:

1. **Alternate left/right**: Use `left` and `right` classes alternately for visual balance
2. **Status badges**: Use `status-completed` or `status-progress` classes
3. **Verified badges**: Only add for official, verified certifications
4. **Links**: Use appropriate text like "View Credential", "View Course", or "Course Link"
5. **Copy-paste**: You can copy an existing certification and modify the details

## What You Can Edit:

- ✅ Certification title
- ✅ Provider name  
- ✅ Status (Completed/In Progress)
- ✅ Links and URLs
- ✅ Add/remove verified badges
- ✅ Add/remove entire certifications

The timeline will automatically maintain the beautiful design and animations! 🎨
