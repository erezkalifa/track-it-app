# Visual Enhancements Specification

## Filter Bar and Job Cards Design System

### 1. Filter Bar Container

**Container Specifications:**

- **Background:** `#FFFFFF` (Solid white)
- **Border:** `1px solid #E5E7EB` (Soft light gray)
- **Shadow:** `0 2px 8px rgba(0,0,0,0.08)` (Subtle elevation)
- **Border Radius:** `12px` (Rounded corners)
- **Padding:** `16px` (All sides)
- **Margin:** `0 16px` (Horizontal spacing)

**Layout:**

- Left-aligned under the header
- Inline-flex wrap of filter pills
- `16px` gaps between filter elements
- `16px` side margins for alignment

**Responsive Behavior:**

- **Desktop:** Full filter bar with dropdowns
- **Mobile (<768px):** Horizontal scroll with `16px` side padding
- **Tablet:** Maintains desktop layout with adjusted spacing

### 2. Job Cards

**Card Specifications:**

- **Background:** `#FFFFFF` (Solid white)
- **Border:** `1px solid #E5E7EB` (Soft light gray)
- **Shadow:** `0 4px 12px rgba(0,0,0,0.10)` (Medium elevation)
- **Border Radius:** `12px` (Rounded corners)
- **Padding:** `24px` (Internal spacing)
- **Hover Shadow:** `0 6px 16px rgba(0,0,0,0.15)` (Enhanced elevation)

**Grid Layout:**

- **Desktop:** Three-wide grid (`repeat(3, 1fr)`)
- **Tablet:** Two-wide grid (`repeat(2, 1fr)`)
- **Mobile:** Single column stack
- **Gap:** `16px` between cards
- **Alignment:** Flush with filter bar's left edge

**Responsive Breakpoints:**

- **Desktop:** `>1024px` (3 columns)
- **Tablet:** `768px - 1024px` (2 columns)
- **Mobile:** `<768px` (1 column)

### 3. Spacing & Alignment

**Consistent Spacing:**

- **Filter Bar:** `16px` padding, `16px` gaps, `16px` margins
- **Job Cards:** `24px` internal padding, `16px` grid gaps
- **Page Container:** `16px` side padding for alignment

**Alignment Rules:**

- Filter bar left edge aligns with job cards left edge
- Consistent `16px` side margins on mobile
- Cards stack vertically with `16px` vertical gutters on mobile

### 4. Color System

**Primary Colors:**

- **Background:** `#FFFFFF` (Pure white)
- **Border:** `#E5E7EB` (Light gray)
- **Page Background:** `#FAFBFC` (Very light gray)

**Brand Accents (Unchanged):**

- **Primary:** `#4F46E5` (Indigo)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)
- **Success:** `#10B981` (Green)

**Shadow System:**

- **Light:** `0 2px 8px rgba(0,0,0,0.08)`
- **Medium:** `0 4px 12px rgba(0,0,0,0.10)`
- **Heavy:** `0 6px 16px rgba(0,0,0,0.15)`

### 5. Implementation Notes

**CSS Properties Applied:**

```css
/* Filter Bar Container */
.filter-bar-wrapper {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin: 0 16px;
}

/* Job Card */
.job-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.job-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Grid Layout */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 0 16px;
}

@media (max-width: 1024px) {
  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .jobs-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
```

**Key Changes Made:**

1. ✅ Filter bar background changed to solid white
2. ✅ Filter bar shadow enhanced to `0 2px 8px rgba(0,0,0,0.08)`
3. ✅ Job cards background set to solid white
4. ✅ Job cards border added: `1px solid #E5E7EB`
5. ✅ Job cards shadow enhanced to `0 4px 12px rgba(0,0,0,0.10)`
6. ✅ Grid layout updated to 3/2/1 responsive columns
7. ✅ Consistent 16px spacing throughout
8. ✅ Proper alignment with filter bar left edge

**Visual Result:**

- Filter bar and job cards now stand out clearly against the `#FAFBFC` page background
- Consistent white containers with subtle shadows create depth
- Responsive grid maintains proper spacing and alignment
- Brand colors preserved for interactive elements
